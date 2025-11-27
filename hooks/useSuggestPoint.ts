"use client";
import { useEffect, useState, useRef } from "react";
import { toast } from "sonner";
import {
  ApiError,
  Categoria,
  FormState,
  SuggestDefaults,
} from "@/types/suggestion";
import parseNumber from "@/utils/parseNumber";
import { useMapsContext } from "@/context/MapsContext";
import { MapMouseEvent } from "maplibre-gl";
import { mutate as swrMutate } from "swr";

type UseSuggestPointOptions = {
  onSuccess?: () => void;
  onStartPicking?: () => void;
  onPicked?: () => void;
};

export function useSuggestPoint(
  defaults: SuggestDefaults,
  options?: UseSuggestPointOptions
) {
  const { map, setPin } = useMapsContext();
  const [loading, setLoading] = useState(false);
  const [picking, setPicking] = useState(false);
  const restoreCursor = useRef<string | null>(null);

  const [form, setForm] = useState<FormState>(() => ({
    nome: defaults.nome ?? "",
    categoria: (defaults.categoria ?? "assistencia") as Categoria,
    endereco: defaults.endereco ?? "",
    bairro: defaults.bairro ?? "",
    lat: defaults.lat,
    lng: defaults.lng,
    horario: defaults.horario ?? "",
    telefone: "",
    observacoes: "",
  }));

  useEffect(() => {
    setForm((prev) => ({
      ...prev,
      nome: defaults.nome ?? "",
      categoria: (defaults.categoria ?? "assistencia") as Categoria,
      endereco: defaults.endereco ?? "",
      bairro: defaults.bairro ?? "",
      lat: defaults.lat,
      lng: defaults.lng,
      horario: defaults.horario ?? "",
    }));
  }, [
    defaults.lat,
    defaults.lng,
    defaults.endereco,
    defaults.bairro,
    defaults.nome,
    defaults.categoria,
    defaults.horario,
  ]);

  function setLatLng(lat: number, lng: number): void {
    setForm((f) => ({ ...f, lat, lng }));
    setPin([lng, lat]);
  }
  function setEndereco(value: string): void {
    setForm((f) => ({ ...f, endereco: value }));
  }
  function setBairro(value: string): void {
    setForm((f) => ({ ...f, bairro: value }));
  }

  function stopPickOnMap(): void {
    if (map) {
      const canvas = map.getCanvas();
      if (restoreCursor.current !== null) {
        canvas.style.cursor = restoreCursor.current;
        restoreCursor.current = null;
      } else {
        canvas.style.cursor = "";
      }
    }
    setPicking(false);
  }

  function startPickOnMap(): void {
    if (!map) {
      toast.warning("Mapa não está pronto ainda.");
      return;
    }
    if (picking) return;

    options?.onStartPicking?.();

    setPicking(true);
    const canvas = map.getCanvas();
    restoreCursor.current = canvas.style.cursor || null;
    canvas.style.cursor = "crosshair";

    const onClick = (e: MapMouseEvent): void => {
      const { lng, lat } = e.lngLat;
      setLatLng(lat, lng);

      void (async () => {
        let endereco = "";
        let bairro = "";
        try {
          const r = await fetch(`/api/revgeocode?lat=${lat}&lon=${lng}`);
          if (r.ok) {
            const j: unknown = await r.json();
            if (j && typeof j === "object") {
              const o = j as {
                endereco?: string;
                bairro?: string;
                cidadeUF?: string;
                cep?: string;
              };
              endereco = o.endereco ?? "";
              bairro = o.bairro ?? "";
              if (!endereco) {
                const pieces = [bairro, o.cidadeUF, o.cep].filter(Boolean);
                endereco = pieces.join(" • ");
              }
            }
          }
        } catch {}

        if (endereco) setEndereco(endereco);
        if (bairro) setBairro(bairro);

        stopPickOnMap();
        options?.onPicked?.();
      })();
    };

    map.once("click", onClick);
  }

  async function submit(): Promise<void> {
    try {
      setLoading(true);
      const res = await fetch("/api/suggest", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      if (!res.ok) {
        const data: unknown = await res.json().catch(() => null);
        const errorMsg: string =
          typeof data === "object" &&
          data !== null &&
          "error" in data &&
          typeof (data as Record<string, unknown>).error === "string"
            ? (data as ApiError).error!
            : "Falha ao enviar sugestão";
        throw new Error(errorMsg);
      }
      toast.success("Sugestão enviada! Obrigado por colaborar.");
      await swrMutate(
        (key) =>
          typeof key === "string" && key.startsWith("/api/admin/suggestions"),
        undefined,
        { revalidate: true }
      );

      options?.onSuccess?.();
    } catch (e: unknown) {
      toast.error(e instanceof Error ? e.message : "Erro ao enviar");
    } finally {
      setLoading(false);
    }
  }

  return {
    form,
    setForm,
    loading,
    picking,
    onChangeText: (
      e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
    ) => {
      const { name, value } = e.target;
      setForm((f) => ({ ...f, [name]: value }));
    },
    onChangeCategoria: (e: React.ChangeEvent<HTMLSelectElement>) => {
      setForm((f) => ({ ...f, categoria: e.target.value as Categoria }));
    },
    onChangeLat: (e: React.ChangeEvent<HTMLInputElement>) => {
      setForm((f) => ({ ...f, lat: parseNumber(e.target.value) }));
    },
    onChangeLng: (e: React.ChangeEvent<HTMLInputElement>) => {
      setForm((f) => ({ ...f, lng: parseNumber(e.target.value) }));
    },
    setLatLng,
    setEndereco,
    setBairro,
    startPickOnMap,
    stopPickOnMap,
    submit,
  };
}
