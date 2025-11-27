"use client";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { SuggestDefaults } from "@/types/suggestion";
import { useSuggestPoint } from "@/hooks/useSuggestPoint";
import useGeocodeSearch, { GeoResult } from "@/hooks/useGeocodeSearch";
import { MapPin, SquareMousePointer } from "lucide-react";
import { useState } from "react";

interface SuggestPointDialogProps {
  open: boolean;
  onOpenChange: (v: boolean) => void;
  defaults: SuggestDefaults;
}

export default function SuggestPointDialog({
  open,
  onOpenChange,
  defaults,
}: SuggestPointDialogProps) {
  const {
    form,
    loading,
    picking,
    onChangeText,
    onChangeCategoria,
    onChangeLat,
    onChangeLng,
    setLatLng,
    setEndereco,
    setBairro,
    startPickOnMap,
    submit,
  } = useSuggestPoint(defaults, {
    onSuccess: () => onOpenChange(false),
    onStartPicking: () => onOpenChange(false),
    onPicked: () => onOpenChange(true),
  });

  const [searchOpen, setSearchOpen] = useState(false);
  const {
    q,
    setQ,
    results,
    loading: geLoading,
    highlight,
    onKeyDown,
    pick,
    boxRef,
  } = useGeocodeSearch({
    onSelect: (r: GeoResult) => {
      setQ(r.labelPrimary);
      pick(r);
      applyGeoResult(r);
      setSearchOpen(false);
    },
  });

  function applyGeoResult(r: GeoResult): void {
    setLatLng(r.lat, r.lon);
    const endereco = [r.address.road, r.address.house_number]
      .filter(Boolean)
      .join(", ");
    setEndereco(endereco);
    setBairro(r.address.suburb ?? "");
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[640px]">
        <DialogHeader>
          <DialogTitle>Sugerir ponto</DialogTitle>
        </DialogHeader>

        {/* Local: busca ou marcar no mapa */}
        <div className="grid grid-cols-1 gap-3 py-2">
          <div className="space-y-2" ref={boxRef}>
            <Label>Local (busque ou marque no mapa)</Label>
            <div className="flex gap-2">
              <div className="relative flex-1">
                <Input
                  type="text"
                  placeholder="Ex.: 21540-000 • Rua do Amparo 45"
                  value={q}
                  onChange={(e) => {
                    setQ(e.target.value);
                    setSearchOpen(true);
                  }}
                  onKeyDown={onKeyDown}
                />
                {searchOpen && (geLoading || results.length > 0) && (
                  <div className="absolute left-0 right-0 top-full mt-2 bg-white rounded-xl shadow-lg border z-50 max-h-80 overflow-auto">
                    {geLoading && (
                      <div className="p-3 text-sm text-muted-foreground">
                        Buscando…
                      </div>
                    )}
                    {!geLoading &&
                      results.map((r, i) => (
                        <button
                          key={`${r.lon}-${r.lat}-${i}`}
                          onClick={() => {
                            applyGeoResult(r);
                            setSearchOpen(false);
                          }}
                          className={`w-full text-left px-3 py-2 hover:bg-muted/50 ${
                            i === highlight ? "bg-muted/70" : ""
                          }`}
                        >
                          <div className="font-medium truncate">
                            {r.labelPrimary}
                          </div>
                          <div className="text-xs text-muted-foreground truncate">
                            {r.labelSecondary}
                          </div>
                        </button>
                      ))}
                    {!geLoading && results.length === 0 && (
                      <div className="p-3 text-sm text-muted-foreground">
                        Nenhum resultado.
                      </div>
                    )}
                    <div className="px-3 py-2 text-[10px] text-muted-foreground border-t bg-muted/20">
                      Dados por OpenStreetMap • Nominatim
                    </div>
                  </div>
                )}
              </div>

              <Button
                type="button"
                variant={picking ? "secondary" : "default"}
                onClick={startPickOnMap}
                title="Clique no mapa para marcar"
              >
                <SquareMousePointer className="h-4 w-4 mr-2" />
                Marcar no mapa
              </Button>
            </div>
          </div>
        </div>

        {/* Demais campos */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          <div className="space-y-1">
            <Label htmlFor="nome">Nome do local</Label>
            <Input
              id="nome"
              name="nome"
              value={form.nome}
              onChange={onChangeText}
            />
          </div>

          <div className="space-y-1">
            <Label htmlFor="categoria">Categoria</Label>
            <select
              id="categoria"
              name="categoria"
              className="h-10 w-full rounded-md border px-3 bg-white"
              value={form.categoria}
              onChange={onChangeCategoria}
            >
              <option value="assistencia">Assistência</option>
              <option value="saude">Saúde</option>
              <option value="educacao">Educação</option>
              <option value="seguranca">Segurança</option>
              <option value="internet">Internet</option>
            </select>
          </div>

          <div className="space-y-1 md:col-span-2">
            <Label htmlFor="endereco">Endereço</Label>
            <Input
              id="endereco"
              name="endereco"
              value={form.endereco}
              onChange={onChangeText}
            />
          </div>

          <div className="space-y-1">
            <Label htmlFor="bairro">Bairro</Label>
            <Input
              id="bairro"
              name="bairro"
              value={form.bairro}
              onChange={onChangeText}
            />
          </div>

          <div className="space-y-1">
            <Label>Coordenadas</Label>
            <div className="grid grid-cols-2 gap-2">
              <Input
                type="number"
                inputMode="decimal"
                name="lat"
                value={form.lat}
                onChange={onChangeLat}
              />
              <Input
                type="number"
                inputMode="decimal"
                name="lng"
                value={form.lng}
                onChange={onChangeLng}
              />
            </div>
          </div>

          <div className="space-y-1">
            <Label htmlFor="horario">Horário (opcional)</Label>
            <Input
              id="horario"
              name="horario"
              value={form.horario}
              onChange={onChangeText}
              placeholder="07h–18h"
            />
          </div>

          <div className="space-y-1">
            <Label htmlFor="telefone">Telefone (opcional)</Label>
            <Input
              id="telefone"
              name="telefone"
              value={form.telefone}
              onChange={onChangeText}
            />
          </div>

          <div className="space-y-1 md:col-span-2">
            <Label htmlFor="observacoes">Observações (opcional)</Label>
            <Textarea
              id="observacoes"
              name="observacoes"
              value={form.observacoes}
              onChange={onChangeText}
              rows={3}
            />
          </div>
        </div>

        <DialogFooter>
          <Button
            variant="secondary"
            onClick={() => onOpenChange(false)}
            disabled={loading}
          >
            Cancelar
          </Button>
          <Button onClick={submit} disabled={loading}>
            <MapPin className="h-4 w-4 mr-2" />
            Enviar
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
