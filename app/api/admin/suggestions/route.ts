import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { sbServer } from "@/lib/supabase";

const QuerySchema = z.object({
  page: z.coerce.number().int().min(1).default(1),
  pageSize: z.coerce.number().int().min(1).max(200).default(20),
  status: z.enum(["pendente", "aprovado", "rejeitado"]).optional(),
  q: z.string().trim().max(140).optional(),
});

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const parsed = QuerySchema.safeParse(
      Object.fromEntries(searchParams.entries())
    );
    if (!parsed.success) {
      return NextResponse.json(
        { error: "Parâmetros inválidos", details: parsed.error.flatten() },
        { status: 400 }
      );
    }

    const { page, pageSize, status, q } = parsed.data;
    const from = (page - 1) * pageSize;
    const to = from + pageSize - 1;

    const sb = sbServer();

    let query = sb
      .from("suggestions")
      .select(
        "id,nome,categoria,endereco,bairro,lat,lng,horario,telefone,observacoes,status,created_at",
        { count: "exact" }
      )
      .order("created_at", { ascending: false });

    if (status) {
      query = query.eq("status", status);
    }

    if (q && q.length > 0) {
      const like = `%${q}%`;
      query = query.or(
        `nome.ilike.${like},endereco.ilike.${like},bairro.ilike.${like},telefone.ilike.${like}`
      );
    }

    const { data, error, count } = await query.range(from, to);

    if (error) {
      console.error("supabase select error", error);
      return NextResponse.json(
        { error: "Falha ao buscar sugestões" },
        { status: 500 }
      );
    }

    return NextResponse.json(
      { page, pageSize, total: count ?? 0, items: data ?? [] },
      { headers: { "Cache-Control": "no-store" } }
    );
  } catch (e) {
    console.error(e);
    return NextResponse.json(
      { error: "Erro inesperado ao listar sugestões" },
      { status: 500 }
    );
  }
}
