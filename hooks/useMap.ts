"use client";
import { useEffect, useRef, useState } from "react";
import maplibregl from "maplibre-gl";
import { toast } from "sonner";

interface MapApiResponse {
  key?: string;
  error?: string;
}

export default function useMaps() {
  const mapRef = useRef<maplibregl.Map | null>(null);
  const refMap = useRef<HTMLDivElement | null>(null);
  const markerRef = useRef<maplibregl.Marker | null>(null);

  const [isLoading, setIsLoading] = useState(false);
  const [pin, setPin] = useState<[number, number]>([-43.2096, -22.9035]);

  useEffect(() => {
    if (!refMap.current || mapRef.current) return;

    const container = refMap.current as HTMLElement;

    let cancelled = false;
    (async () => {
      setIsLoading(true);
      try {
        const res = await fetch("/api/maptiler");
        if (!res.ok) throw new Error("Falha ao obter a chave do mapa.");
        const data: MapApiResponse = await res.json();
        const key = data.key;
        if (!key) throw new Error("Chave do MapTiler ausente.");

        const map = new maplibregl.Map({
          container,
          style: `https://api.maptiler.com/maps/streets/style.json?key=${key}`,
          center: pin,
          zoom: 12,
        });

        map.setPadding({ left: 450, top: 80, right: 0, bottom: 0 });
        const marker = new maplibregl.Marker().setLngLat(pin).addTo(map);

        mapRef.current = map;
        markerRef.current = marker;
      } catch {
        toast.error("Falha ao carregar o mapa");
      } finally {
        if (!cancelled) setIsLoading(false);
      }
    })();

    return () => {
      cancelled = true;
      mapRef.current?.remove();
      mapRef.current = null;
      markerRef.current = null;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (!mapRef.current) return;
    mapRef.current.flyTo({ center: pin, zoom: 14 });
    markerRef.current?.setLngLat(pin);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pin[0], pin[1]]);

  return { refMap, isLoading, pin, setPin, map: mapRef.current };
}
