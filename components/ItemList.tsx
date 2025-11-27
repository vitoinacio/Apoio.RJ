"use client";

import { Card, CardContent } from "@/components/ui/card";
import { Button } from "./ui/button";
import {
  Clock,
  Flag,
  Focus,
  MapPin,
  Navigation,
  ShieldCheck,
} from "lucide-react";
import { Badge } from "./ui/badge";
import VerificationBadge from "./VerificationBadge";
import CategoryPill from "./CategoryPill";
import type { Suggestion } from "@/types/suggestion";

interface ItemListProps {
  point: Suggestion;
  setPin: React.Dispatch<React.SetStateAction<[number, number]>>;
}

function buildDirectionsUrl(lat: number, lng: number): string {
  return `https://www.google.com/maps/dir/?api=1&destination=${lat},${lng}`;
}

const ItemList = ({ point, setPin }: ItemListProps) => {
  const categoria = point.categoria ?? "assistencia";
  const horario = point.horario ?? "—";
  const fonte = point.observacoes ?? undefined;

  return (
    <Card className="shadow-sm border border-border/60 hover:shadow-md transition-shadow">
      <CardContent className="px-3 py-1">
        <Badge variant="secondary" className="mb-2">
          <ShieldCheck className="h-1 w-1" />
          ID {point.id}
        </Badge>

        <div className="flex items-start justify-between gap-3">
          <div className="min-w-0">
            <div className="flex items-center gap-2">
              <h2 className="text-sm font-semibold truncate" title={point.nome}>
                {point.nome}
              </h2>
              <VerificationBadge status={point.status} />
            </div>

            <div className="mt-1 flex flex-wrap items-center gap-2 text-xs text-muted-foreground">
              <span className="inline-flex items-center gap-1">
                <MapPin className="h-3 w-3" aria-hidden />
                <span className="truncate" title={point.endereco}>
                  {point.endereco}
                </span>
              </span>
              <span className="inline-flex items-center gap-1">
                <Clock className="h-3 w-3" aria-hidden />
                <span>Horário: {horario}</span>
              </span>
            </div>

            <div className="mt-2 flex items-center gap-2">
              <CategoryPill categoria={categoria} />
              {fonte && (
                <span className="text-[10px] text-muted-foreground/80">
                  Fonte: {fonte}
                </span>
              )}
            </div>
          </div>
        </div>

        <div className="mt-3 flex justify-between gap-2">
          <Button
            asChild
            className="text-xs p-1 cursor-pointer"
            title="Abrir rotas no Google Maps"
          >
            <a
              href={buildDirectionsUrl(point.lat, point.lng)}
              target="_blank"
              rel="noreferrer"
            >
              <Navigation className="h-1 w-1" />
              Como chegar
            </a>
          </Button>

          <Button
            variant="secondary"
            className="text-xs p-1 cursor-pointer hover:bg-gray-200"
            onClick={() => setPin([point.lng, point.lat])}
            title="Focar no mapa"
          >
            <Focus className="h-1 w-1" />
            Focar no mapa
          </Button>

          <Button
            variant="destructive"
            className="text-xs p-1 cursor-pointer"
            title="Reportar erro"
          >
            <Flag className="h-1 w-1" />
            Reportar erro
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default ItemList;
