"use client";
import { ReactNode } from "react";
import "maplibre-gl/dist/maplibre-gl.css";
import { useMapsContext } from "@/context/MapsContext";
import { Spinner } from "./ui/spinner";

export default function Mapa({ children }: { children: ReactNode }) {
  const { refMap, isLoading } = useMapsContext();

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
}
