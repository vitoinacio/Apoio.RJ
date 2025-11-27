"use client";
import useSWR from "swr";
import type { SuggestionsResponse, SuggestionStatus } from "@/types/suggestion";

export type SuggestionsQuery = {
  page?: number;
  pageSize?: number;
  status?: SuggestionStatus;
  q?: string;
};

type ErrorPayload = { error: string };

function isErrorPayload(v: unknown): v is ErrorPayload {
  if (typeof v !== "object" || v === null) return false;
  const o = v as Record<string, unknown>;
  return typeof o.error === "string";
}

const fetcher = async (url: string): Promise<SuggestionsResponse> => {
  const res = await fetch(url);
  if (!res.ok) {
    const j: unknown = await res.json().catch(() => null);
    const msg = isErrorPayload(j) ? j.error : "Falha ao carregar sugestões";
    throw new Error(msg);
  }
  return (await res.json()) as SuggestionsResponse;
};

function buildUrl(base: string, query: SuggestionsQuery): string {
  const p = new URLSearchParams();
  if (query.page) p.set("page", String(query.page));
  if (query.pageSize) p.set("pageSize", String(query.pageSize));
  if (query.status) p.set("status", query.status);
  if (query.q) p.set("q", query.q);
  const qs = p.toString();
  return qs ? `${base}?${qs}` : base;
}

export function useSuggestions(query: SuggestionsQuery = {}) {
  const url = buildUrl("/api/admin/suggestions", {
    page: query.page ?? 1,
    pageSize: query.pageSize ?? 20,
    status: query.status,
    q: query.q?.trim() || undefined,
  });

  const { data, error, isLoading, mutate } = useSWR<SuggestionsResponse, Error>(
    url,
    fetcher,
    {
      revalidateOnFocus: false,
      keepPreviousData: true,
    }
  );

  return {
    data,
    error,
    isLoading,
    mutate,
  };
}
