"use client";
import { useEffect, useRef, useState } from "react";

export type GeoResult = {
  labelPrimary: string;
  labelSecondary: string;
  lat: number;
  lon: number;
  address: {
    road?: string;
    house_number?: string;
    suburb?: string;
    city?: string;
    state?: string;
    postcode?: string;
  };
};

type UseGeocodeSearchOptions = {
  onSelect?: (picked: GeoResult) => void;
  minLength?: number;
  debounceMs?: number;
};

function isCepLike(s: string) {
  const d = s.replace(/\D/g, "");
  return d.length >= 7 || /\bcep\s*\d{5}-?\d{3}\b/i.test(s);
}
function isStreetNumberLike(s: string) {
  return /.+[,\s]+\d+[A-Za-z]?$/.test(s.trim());
}

export default function useGeocodeSearch({
  onSelect,
  minLength = 3,
  debounceMs = 350,
}: UseGeocodeSearchOptions = {}) {
  const [q, setQ] = useState("");
  const [results, setResults] = useState<GeoResult[]>([]);
  const [loading, setLoading] = useState(false);
  const [highlight, setHighlight] = useState(-1);

  const abortRef = useRef<AbortController | null>(null);
  const boxRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const term = q.trim();

    const shouldSearch =
      term.length >= minLength || isCepLike(term) || isStreetNumberLike(term);

    if (!shouldSearch) {
      setResults([]);
      setHighlight(-1);
      return;
    }

    setLoading(true);
    abortRef.current?.abort();
    const ac = new AbortController();
    abortRef.current = ac;

    const t = setTimeout(async () => {
      try {
        const res = await fetch(`/api/geocode?q=${encodeURIComponent(term)}`, {
          signal: ac.signal,
        });
        const json = (await res.json()) as { results?: GeoResult[] };
        setResults(json.results ?? []);
        setHighlight(-1);
      } catch {
        /* ignore */
      } finally {
        setLoading(false);
      }
    }, debounceMs);

    return () => {
      clearTimeout(t);
      ac.abort();
    };
  }, [q, minLength, debounceMs]);

  useEffect(() => {
    function onDocClick(e: MouseEvent) {
      if (!boxRef.current) return;
      if (!boxRef.current.contains(e.target as Node)) setResults([]);
    }
    document.addEventListener("mousedown", onDocClick);
    return () => document.removeEventListener("mousedown", onDocClick);
  }, []);

  function pick(r: GeoResult) {
    onSelect?.(r);
    setQ(r.labelPrimary);
    setResults([]);
    setHighlight(-1);
  }

  function submit() {
    if (!results.length) return;
    pick(results[highlight >= 0 ? highlight : 0]);
  }

  function onKeyDown(e: React.KeyboardEvent<HTMLInputElement>) {
    if (!results.length) {
      if (e.key === "Enter") submit();
      return;
    }
    if (e.key === "ArrowDown") {
      e.preventDefault();
      setHighlight((h) => Math.min(h + 1, results.length - 1));
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setHighlight((h) => Math.max(h - 1, 0));
    } else if (e.key === "Enter") {
      e.preventDefault();
      submit();
    } else if (e.key === "Escape") {
      setResults([]);
      setHighlight(-1);
    }
  }

  return {
    q,
    setQ,
    results,
    loading,
    highlight,
    onKeyDown,
    pick,
    submit,
    boxRef,
  };
}
