import { NextRequest, NextResponse } from "next/server";
import { sbServer } from "@/lib/supabase";
import { SuggestionSchema } from "@/schema/schema";

const recent = new Map<string, number>();
const WINDOW_MS = 15_000;

export async function POST(req: NextRequest) {
  try {
    const ip =
      req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() || "0.0.0.0";
    const last = recent.get(ip) || 0;
    if (Date.now() - last < WINDOW_MS) {
      return NextResponse.json(
        { error: "Aguarde alguns segundos e tente novamente." },
        { status: 429 }
      );
    }

    const body = await req.json();
    const parsed = SuggestionSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json(
        { error: "Dados inválidos", details: parsed.error.flatten() },
        { status: 400 }
      );
    }

    const sb = sbServer();
    const { error } = await sb.from("suggestions").insert({
      ...parsed.data,
    });

    if (error) {
      console.error("supabase insert error", error);
      return NextResponse.json(
        { error: "Falha ao registrar sugestão." },
        { status: 500 }
      );
    }

    recent.set(ip, Date.now());
    return NextResponse.json({ ok: true }, { status: 201 });
  } catch (e) {
    console.error(e);
    return NextResponse.json({ error: "Erro inesperado" }, { status: 500 });
  }
}
