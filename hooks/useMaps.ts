"use client";

import { useEffect, useRef, useState } from "react";
import maplibregl, { Map } from "maplibre-gl";
import "maplibre-gl/dist/maplibre-gl.css";
import { toast } from "sonner";

interface MapApiResponse {
  key?: string;
  error?: string;
}

const useMap = () => {
  const refMap = useRef<HTMLDivElement | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cleanup: (() => void) | undefined;

    const initMap = async (): Promise<void> => {
      setIsLoading(true);
      setError(null);

      try {
        const res = await fetch("/api/maptiler");
        if (!res.ok) throw new Error("Falha ao obter chave do mapa");

        const data: MapApiResponse = await res.json();
        const key = data.key;
        if (!key) throw new Error("Chave ausente");

        const map: Map = new maplibregl.Map({
          container: refMap.current as HTMLDivElement,
          style: `https://api.maptiler.com/maps/streets/style.json?key=${key}`,
          center: [-43.2096, -22.9035],
          zoom: 12,
        });

        new maplibregl.Marker().setLngLat([-43.2096, -22.9035]).addTo(map);

        cleanup = () => map.remove();
      } catch (err) {
        if (err instanceof Error) {
          console.error(err);
          setError(err.message);
          toast.error(err.message);
        } else {
          console.error("Erro desconhecido:", err);
          setError("Erro inesperado ao carregar o mapa");
          toast.error("Erro inesperado ao carregar o mapa");
        }
      } finally {
        setIsLoading(false);
      }
    };

    initMap();
    return () => cleanup?.();
  }, []);

  return { refMap, isLoading, error };
};

export default useMap;
