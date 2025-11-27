"use client";
import { MapPin, Home, Route, Building2, Search } from "lucide-react";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { useMapsContext } from "@/context/MapsContext";
import useGeocodeSearch, { GeoResult } from "@/hooks/useGeocodeSearch";
import { useState } from "react";
import SuggestPointDialog, { SuggestDefaults } from "../SuggestPointDialog";

function pickIcon(r: GeoResult) {
  const a = r.address || {};
  if (a.road && a.house_number) return <Home className="h-5 w-5" />;
  if (a.road) return <Route className="h-5 w-5" />;
  if (a.city || a.suburb) return <Building2 className="h-5 w-5" />;
  return <MapPin className="h-5 w-5" />;
}

const SuggestionItem = ({
  r,
  active,
  onClick,
}: {
  r: GeoResult;
  active: boolean;
  onClick: () => void;
}) => {
  return (
    <button
      onClick={onClick}
      className={`w-full grid grid-cols-[24px_1fr_auto] items-center gap-3 px-3 py-2 text-left
        ${active ? "bg-muted/70" : "hover:bg-muted/50"}`}
    >
      <span className="text-blue-700">{pickIcon(r)}</span>
      <span className="min-w-0">
        <div className="font-medium truncate">{r.labelPrimary}</div>
        <div className="text-xs text-muted-foreground truncate">
          {r.labelSecondary}
        </div>
      </span>
      {r.address.postcode && (
        <span className="ml-2 text-[10px] px-1.5 py-0.5 rounded bg-blue-50 text-blue-700 border border-blue-100">
          {r.address.postcode}
        </span>
      )}
    </button>
  );
};

const EmptyState = ({ q }: { q: string }) => (
  <div className="p-3 text-sm text-muted-foreground">
    Nenhum resultado para <span className="font-medium">&quot;{q}&quot;</span>.
    Tente um formato: <em>21540-000</em>, <em>21540000</em>,{" "}
    <em>21540-000 45</em>, <em>Rua do Amparo 45</em>.
  </div>
);

const LoadingSkeleton = () => (
  <div className="p-3 space-y-2">
    <div className="h-3 bg-muted/60 rounded" />
    <div className="h-3 bg-muted/60 rounded w-5/6" />
    <div className="h-3 bg-muted/60 rounded w-3/4" />
  </div>
);

const Header = () => {
  const { setPin, pin } = useMapsContext();
  const [open, setOpen] = useState(false);
  const [defaults, setDefaults] = useState<SuggestDefaults>({
    lat: pin[1],
    lng: pin[0],
  });

  const {
    q,
    setQ,
    results,
    loading,
    highlight,
    onKeyDown,
    pick,
    boxRef,
  } = useGeocodeSearch({
    onSelect: (r) => {
      setPin([r.lon, r.lat]);
      setDefaults({
        lat: r.lat,
        lng: r.lon,
        endereco: [r.address.road, r.address.house_number]
          .filter(Boolean)
          .join(", "),
        bairro: r.address.suburb || "",
      });
    },
  });

  return (
    <header className="absolute z-20 w-[90%] flex items-center justify-between bg-white mt-4 rounded-2xl p-3 shadow-lg border">
      <h1 className="text-xl md:text-2xl text-blue-700 font-bold pl-1">
        Apoio.RJ
      </h1>

      <div
        ref={boxRef}
        className="flex items-center gap-3 flex-1 justify-end relative"
      >
        <div className="relative w-[55%]">
          <Input
            type="text"
            placeholder="Ex.: 21540-000 • 21540000 • Rua do Amparo 45 • 21540-000 45"
            className="h-12 pl-4 pr-10 w-full bg-gray-50"
            value={q}
            onChange={(e) => setQ(e.target.value)}
            onKeyDown={onKeyDown}
            aria-autocomplete="list"
            aria-expanded={results.length > 0}
          />
          <Search className="absolute right-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400 pointer-events-none" />

          {(loading || results.length > 0) && (
            <div className="absolute left-0 right-0 top-full mt-2 bg-white rounded-xl shadow-lg border z-50 max-h-96 overflow-auto">
              {loading && <LoadingSkeleton />}

              {!loading && results.length === 0 && <EmptyState q={q} />}

              {!loading &&
                results.map((r, i) => (
                  <SuggestionItem
                    key={`${r.lon}-${r.lat}-${i}`}
                    r={r}
                    active={i === highlight}
                    onClick={() => pick(r)}
                  />
                ))}

              <div className="px-3 py-2 text-[10px] text-muted-foreground border-t bg-muted/20">
                Dados por OpenStreetMap • Nominatim
              </div>
            </div>
          )}
        </div>

        <Button
          className="bg-blue-700 h-12 px-4"
          disabled={loading}
          onClick={() => setOpen(true)}
        >
          <MapPin className="mr-2 h-5 w-5" />
          Sugerir ponto
        </Button>

        <SuggestPointDialog
          open={open}
          onOpenChange={setOpen}
          defaults={defaults}
        />
      </div>
    </header>
  );
};

export default Header;
