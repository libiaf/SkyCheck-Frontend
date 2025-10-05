const API_BASE = import.meta.env.VITE_API_BASE || "http://localhost:3000";

export type GeoResult = { name: string; lat: number; lon: number; score?: number };

export async function geocode(q: string, limit = 5): Promise<GeoResult[]> {
  const url = new URL(`${API_BASE}/geocode`);
  url.searchParams.set("q", q);
  url.searchParams.set("limit", String(limit));
  const resp = await fetch(url.toString());
  if (!resp.ok) throw new Error(`Geocode ${resp.status}`);
  const data = await resp.json();
  return (data?.results ?? []) as GeoResult[];
}

export async function geocodeReverse(lat: number, lon: number): Promise<GeoResult | null> {
  const url = new URL(`${API_BASE}/geocode/reverse`);
  url.searchParams.set("lat", String(lat));
  url.searchParams.set("lon", String(lon));
  const resp = await fetch(url.toString());
  if (!resp.ok) return null;
  const data = await resp.json();
  if (data?.ok && data?.result) {
    return { name: data.result.name, lat, lon };
  }
  return null;
}