"use client";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { ScrollArea } from "./ui/scroll-area";
import ItemList from "./ItemList";
import { useMapsContext } from "@/context/MapsContext";
import { useSuggestions } from "@/hooks/useSuggestions";

export default function SideBar() {
  const { setPin } = useMapsContext();
  const { data } = useSuggestions();

  return (
    <aside className="w-full z-2 md:w-[380px] lg:w-[420px] xl:w-[460px] sticky top-28 self-start">
      <Card className="shadow-xl border-0 overflow-hidden">
        <CardHeader>
          <CardTitle className="text-base font-semibold text-blue-700 tracking-tight flex items-center gap-2">
            Pontos de Apoio
          </CardTitle>
          <p className="text-xs/relaxed text-gray-500">
            Locais próximos com serviços públicos e utilidades.
          </p>
        </CardHeader>

        <CardContent className="p-3">
          <ScrollArea className="h-[45vh] bg-gray-100 rounded-2xl p-1">
            <div className="flex flex-col gap-3">
              {(data?.items ?? []).map((point) => (
                <ItemList key={point.id} point={point} setPin={setPin} />
              ))}
            </div>
          </ScrollArea>
        </CardContent>

        <CardFooter>
          <div className="w-full bg-muted rounded-2xl text-center p-3 text-muted-foreground text-xs">
            Anúncios
          </div>
        </CardFooter>
      </Card>
    </aside>
  );
}
