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
import { Point } from "@/types/points";
import CategoryPill from "./CategoryPill";

const ItemList = ({ point }: { point: Point }) => {
  return (
    <Card className="shadow-sm border border-border/60 hover:shadow-md transition-shadow">
      <CardContent className="px-3 py-1">
        {point.verificado && (
            <Badge variant="secondary" className="mb-2">
              <ShieldCheck className="h-1 w-1" />
              ID {point.id.replace(/^[a-z-]+/, "").toUpperCase()}
            </Badge>
          )}
        <div className="flex items-start justify-between gap-3">
          <div className="min-w-0">
            <div className="flex items-center gap-2">
              <h2 className="text-sm font-semibold truncate" title={point.nome}>
                {point.nome}
              </h2>
              <VerificationBadge verified={point.verificado} />
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
                <span>Horário: {point.horario}</span>
              </span>
            </div>

            <div className="mt-2 flex items-center gap-2">
              <CategoryPill categoria={point.categoria} />
              {point.fonte && (
                <span className="text-[10px] text-muted-foreground/80">
                  Fonte: {point.fonte}
                </span>
              )}
            </div>
          </div>
        </div>

        <div className="mt-3 flex justify-between gap-2">
          <Button className="text-xs p-1">
            <Navigation className="h-1 w-1" />
            Como chegar
          </Button>
          <Button variant="secondary" className="text-xs p-1">
            <Focus className="h-1 w-1" />
            Focar no mapa
          </Button>
          <Button variant="destructive" className="text-xs p-1">
            <Flag className="h-1 w-1" />
            Reportar erro
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default ItemList;
