export function parseLatLon(q: string) {
  const m = q.trim().match(/^\s*(-?\d+(\.\d+)?)\s*,\s*(-?\d+(\.\d+)?)\s*$/);
  if (!m) return null;
  const lat = parseFloat(m[1]); const lon = parseFloat(m[3]);
  if (lat < -90 || lat > 90 || lon < -180 || lon > 180) return null;
  return { lat, lon };
}

const aliases: Record<string, {lat:number; lon:number; name:string}> = {
  hermosillo: { lat: 29.0892, lon: -110.9613, name: "Hermosillo, Sonora" },
  "cdmx": { lat: 19.4326, lon: -99.1332, name: "Ciudad de México" },
  "mexico city": { lat: 19.4326, lon: -99.1332, name: "Ciudad de México" },
  "guadalajara": { lat: 20.6597, lon: -103.3496, name: "Guadalajara, Jalisco" },
};

export async function geocodeMock(q: string) {
  const coords = parseLatLon(q);
  if (coords) return { ...coords, name: `${coords.lat}, ${coords.lon}` };

  const key = q.trim().toLowerCase();
  if (aliases[key]) return aliases[key];

  if (key === "mi ubicacion" || key === "mi ubicación") {
    // usa geolocalización del navegador si disponible
    const pos = await new Promise<GeolocationPosition>((res, rej) =>
      navigator.geolocation
        ? navigator.geolocation.getCurrentPosition(res, rej, { enableHighAccuracy: true, timeout: 5000 })
        : rej(new Error("no_geolocation"))
    ).catch(() => null);
    if (pos) {
      return { lat: pos.coords.latitude, lon: pos.coords.longitude, name: "Mi ubicación" };
    }
  }

  throw new Error("not_found");
}
