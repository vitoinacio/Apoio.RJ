"use client";

import { ReactNode, useEffect } from "react";
import "maplibre-gl/dist/maplibre-gl.css";
import useMaps from "@/hooks/useMap";
import { Spinner } from "./ui/spinner";

const Mapa = ({ children }: { children: ReactNode }) => {
  const { refMap, setMap, isLoading } = useMaps();

  useEffect(() => {
    setMap();
  }, [setMap]);

  if (isLoading) {
    return (
      <main className="w-full h-dvh px-[5%] relative top-0">
        {children}
        <Spinner className="text-blue-800 size-16 z-2 absolute right-[27%] top-[55%]" />
      </main>
    );
  }

  return (
    <main ref={refMap} className="w-full h-dvh px-[5%] relative top-0">
      {children}
    </main>
  );
};

export default Mapa;
