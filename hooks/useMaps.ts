"use client";

import { useRef, useState } from "react";
import maplibregl from "maplibre-gl";
import { toast } from "sonner";

const useMaps = () => {
  const refMap = useRef<HTMLDivElement | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const mapKey = process.env.NEXT_PUBLIC_MAPTILER_KEY;

  const setMap = () => {
    if (!refMap.current) return;

    try {
      setIsLoading(true);
      const map = new maplibregl.Map({
        container: refMap.current,
        style: `https://api.maptiler.com/maps/streets/style.json?key=${mapKey}`,
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
