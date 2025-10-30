"use client"

import { Point } from "@/types/points";

const pill =
  "inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-[10px] font-medium bg-muted/60";

const CategoryPill = ({ categoria }: { categoria: Point["categoria"] }) => {
  const map: Record<string, string> = {
    saude: "bg-emerald-50 text-emerald-700",
    seguranca: "bg-sky-50 text-sky-700",
    educacao: "bg-amber-50 text-amber-700",
    assistencia: "bg-violet-50 text-violet-700",
    internet: "bg-cyan-50 text-cyan-700",
  };
  const cls = map[categoria] ?? "bg-slate-50 text-slate-700";
  return <span className={`${pill} ${cls}`}>{categoria}</span>;
};

export default CategoryPill;
