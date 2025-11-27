"use client";
import { createContext, useContext } from "react";
import useMaps from "@/hooks/useMap";

export type MapsCtxValue = ReturnType<typeof useMaps>;
const MapsContext = createContext<MapsCtxValue | null>(null);

export function MapsProvider({ children }: { children: React.ReactNode }) {
  const value = useMaps(); // <- usa o hook com toda a lógica
  return <MapsContext.Provider value={value}>{children}</MapsContext.Provider>;
}

export function useMapsContext() {
  const ctx = useContext(MapsContext);
  if (!ctx)
    throw new Error("useMapsContext deve ser usado dentro de <MapsProvider>.");
  return ctx;
}
