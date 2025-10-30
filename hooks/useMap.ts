"use client";

import { useRef, useState } from "react";
import maplibregl from "maplibre-gl";
import { toast } from "sonner";

interface MapApiResponse {
  key?: string;
  error?: string;
}

const useMaps = () => {
  const refMap = useRef<HTMLDivElement | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const setMap = async () => {
    if (!refMap.current) return;

    const res = await fetch("/api/maptiler");
    if (!res.ok) throw new Error("Falha ao obter a chave do mapa.");

    const data: MapApiResponse = await res.json();
    const key = data.key;
    if (!key) throw new Error("Chave do MapTiler ausente.");

    try {
      setIsLoading(true);
      const map = new maplibregl.Map({
        container: refMap.current,
        style: `https://api.maptiler.com/maps/streets/style.json?key=${key}`,
        center: [-43.2096, -22.9035],
        zoom: 12,
      });
      new maplibregl.Marker().setLngLat([-43.2096, -22.9035]).addTo(map);
      return () => map.remove();
    } catch {
      toast.error("Falha ao carregar o mapa");
    } finally {
      setIsLoading(false);
    }
  };

  return {
    refMap,
    setMap,
    isLoading,
  };
};

export default useMaps;
