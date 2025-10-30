import { NextResponse } from "next/server";

export async function GET() {
  const key = process.env.MAPTILER_SECRET_KEY;
  if (!key) {
    return NextResponse.json({ error: "Chave não configurada" }, { status: 500 });
  }

  return NextResponse.json({ key });
}
