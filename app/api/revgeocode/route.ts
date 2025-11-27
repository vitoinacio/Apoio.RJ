import { NextRequest, NextResponse } from "next/server";

interface NominatimAddress {
  road?: string;
  house_number?: string;
  suburb?: string;
  neighbourhood?: string;
  city?: string;
  town?: string;
  municipality?: string;
  state?: string;
  postcode?: string;
}
function pickCity(a?: NominatimAddress) {
  return a?.city || a?.town || a?.municipality || "";
}
function pickBairro(a?: NominatimAddress) {
  return a?.suburb || a?.neighbourhood || "";
}
function formatCEP(postcode?: string) {
  const d = (postcode ?? "").replace(/\D/g, "");
  return d.length === 8 ? `${d.slice(0, 5)}-${d.slice(5)}` : postcode ?? "";
}

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const lat = searchParams.get("lat");
  const lon = searchParams.get("lon");
  if (!lat || !lon) {
    return NextResponse.json(
      { error: "lat/lon obrigatórios" },
      { status: 400 }
    );
  }

  const res = await fetch(
    `https://nominatim.openstreetmap.org/reverse?format=jsonv2&lat=${encodeURIComponent(
      lat
    )}&lon=${encodeURIComponent(lon)}&addressdetails=1`,
    {
      headers: {
        "User-Agent": "apoio-rj/1.1 (victor.hugo.ina10@gmail.com)",
        "Accept-Language": "pt-BR,pt;q=0.9",
      },
      next: { revalidate: 60 },
    }
  );

  if (!res.ok)
    return NextResponse.json(
      { error: "reverse geocode falhou" },
      { status: res.status }
    );

  const json = (await res.json()) as { address?: NominatimAddress };
  const a = json.address;
  const endereco = [a?.road, a?.house_number].filter(Boolean).join(", ");
  const bairro = pickBairro(a);
  const cidadeUF = [pickCity(a), a?.state].filter(Boolean).join(" - ");
  const cep = formatCEP(a?.postcode);

  return NextResponse.json({ endereco, bairro, cidadeUF, cep });
}
