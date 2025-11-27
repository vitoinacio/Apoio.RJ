import { NextRequest, NextResponse } from "next/server";

interface NominatimAddress {
  road?: string;
  house_number?: string;
  neighbourhood?: string;
  suburb?: string;
  city?: string;
  town?: string;
  municipality?: string;
  state?: string;
  postcode?: string;
}

interface NominatimItem {
  display_name: string;
  lat: string;
  lon: string;
  address?: NominatimAddress;
  class?: string;
  type?: string;
  importance?: number;
}

function isNominatimItem(v: unknown): v is NominatimItem {
  if (typeof v !== "object" || v === null) return false;
  const o = v as Record<string, unknown>;
  return (
    typeof o.display_name === "string" &&
    typeof o.lat === "string" &&
    typeof o.lon === "string"
  );
}
function isNominatimArray(v: unknown): v is NominatimItem[] {
  return Array.isArray(v) && v.every(isNominatimItem);
}

function pickCity(addr?: NominatimAddress) {
  return addr?.city || addr?.town || addr?.municipality || "";
}
function pickBairro(addr?: NominatimAddress) {
  return addr?.suburb || addr?.neighbourhood || "";
}
function formatCEP(postcode?: string) {
  const d = (postcode ?? "").replace(/\D/g, "");
  if (d.length !== 8) return postcode ?? "";
  return `${d.slice(0, 5)}-${d.slice(5)}`;
}

function formatNominatimResult(it: NominatimItem) {
  const a = it.address;
  const rua = a?.road;
  const numero = a?.house_number;
  const bairro = pickBairro(a);
  const cidade = pickCity(a);

  let labelPrimary = "";
  let labelSecondary = "";

  if (rua) {
    labelPrimary = [rua, numero].filter(Boolean).join(", ");
    labelSecondary = [
      bairro,
      [cidade, a?.state].filter(Boolean).join(" - "),
      formatCEP(a?.postcode),
    ]
      .filter(Boolean)
      .join(" • ");
  } else if (bairro) {
    labelPrimary = bairro;
    labelSecondary = [
      [cidade, a?.state].filter(Boolean).join(" - "),
      formatCEP(a?.postcode),
    ]
      .filter(Boolean)
      .join(" • ");
  } else if (cidade) {
    labelPrimary = [cidade, a?.state].filter(Boolean).join(" - ");
    labelSecondary = formatCEP(a?.postcode) || it.display_name;
  } else {
    const parts = it.display_name.split(",");
    labelPrimary = parts[0]?.trim() || it.display_name;
    labelSecondary = [parts[1]?.trim(), parts[2]?.trim()]
      .filter(Boolean)
      .join(", ");
  }

  return {
    labelPrimary,
    labelSecondary,
    lat: parseFloat(it.lat),
    lon: parseFloat(it.lon),
    address: {
      road: a?.road,
      house_number: a?.house_number,
      suburb: pickBairro(a),
      city: pickCity(a),
      state: a?.state,
      postcode: formatCEP(a?.postcode),
    },
  };
}

const RIO_VIEWBOX = "-43.8,-23.1,-43.1,-22.7";

function buildParamsFromQuery(raw: string) {
  const term = raw.trim().replace(/\s+/g, " ");

  const base = new URLSearchParams({
    format: "jsonv2",
    addressdetails: "1",
    limit: "8",
    countrycodes: "br",
  });

  const mCepNum =
    term.match(/(?:^|\b)(?:cep\s*)?(\d{5}-?\d{3})\D+(\d+[A-Za-z]?)\b/i) ||
    term.match(/(?:^|\b)(\d{5}-?\d{3})\s*,?\s*(\d+[A-Za-z]?)\b/i);
  if (mCepNum) {
    const cep = mCepNum[1].replace(/\D/g, "");
    const num = mCepNum[2];
    const p = new URLSearchParams(base);
    p.set("q", `${cep} ${num}`);
    return p;
  }

  const digits = term.replace(/\D/g, "");
  const mCepOnly =
    term.match(/(?:^|\b)(?:cep\s*)?(\d{5}-?\d{3})(?:\b|$)/i) ||
    (digits.length === 8 ? [term, digits] : null);
  if (mCepOnly) {
    const cep = mCepOnly[1].replace(/\D/g, "");
    const p = new URLSearchParams(base);
    p.set("postalcode", cep);
    p.set("viewbox", RIO_VIEWBOX);
    p.set("bounded", "1");
    return p;
  }

  const mStreetNum = term.match(/^\s*(.+?)[,\s]+(\d+[A-Za-z]?)\s*$/u);
  if (mStreetNum) {
    const street = `${mStreetNum[1].trim()} ${mStreetNum[2]}`;
    const p = new URLSearchParams(base);
    p.set("street", street);
    p.set("viewbox", RIO_VIEWBOX);
    p.set("bounded", "1");
    return p;
  }

  const p = new URLSearchParams(base);
  p.set("q", term);
  p.set("viewbox", RIO_VIEWBOX);
  p.set("bounded", "0");
  return p;
}

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const q = searchParams.get("q")?.trim() ?? "";
  if (!q) return NextResponse.json({ results: [] });

  const params = buildParamsFromQuery(q);
  const url = `https://nominatim.openstreetmap.org/search?${params.toString()}`;

  const res = await fetch(url, {
    headers: {
      "User-Agent": "apoio-rj/1.1 (victor.hugo.ina10@gmail.com)",
      "Accept-Language": "pt-BR,pt;q=0.9",
    },
    next: { revalidate: 60 },
  });

  if (!res.ok)
    return NextResponse.json({ results: [] }, { status: res.status });

  const data: unknown = await res.json();
  const items = isNominatimArray(data) ? data : [];
  const results = items.map(formatNominatimResult);

  return NextResponse.json({ results });
}
