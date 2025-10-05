const API_BASE = import.meta.env.VITE_API_BASE as string;

export type DashboardRequest = {
  lat: number;
  lon: number;
  targetISO?: string;
  timezone?: string;
};

export type HourlyPoint = {
  timeLocal: string;
  tempC: number;
  probPrecip1h_pct: number;
  precip1h_mm: number;
  uv_idx: number;
};

export type DashboardResponse = {
  mode: 'historical' | 'forecast' | 'outlook';
  location: { lat: number; lon: number; name?: string | null };
  panel?: {
    veryFlag: {
      veryWet: number; veryHot: number; veryCold: number;
      veryHumid: number; extremeRain: number; dangerousUV: number;
    };
    tempNowC: number;
    hiC: number; loC: number;
    precipLast1h_mm: number; precipLast24h_mm: number;
    humidity_pct: number;
    uv_index: number; uv_level: string;
    wind: {
      speed_kmh: number; direction_deg: number;
      direction_cardinal: string; gust_kmh: number;
    };
  };
  hourly?: HourlyPoint[];
  airQuality?: { overall_idx: number; overall_text: string };
  outlook?: any;
  meta: any;
};

async function jsonFetch<T>(path: string, init?: RequestInit): Promise<T> {
  const r = await fetch(`${API_BASE}${path}`, {
    headers: { 'Content-Type': 'application/json' },
    ...init
  });
  if (!r.ok) {
    const text = await r.text();
    throw new Error(`${r.status} ${r.statusText}: ${text}`);
  }
  return r.json() as Promise<T>;
}

export function postDashboard(body: DashboardRequest) {
  return jsonFetch<DashboardResponse>('/dashboard', {
    method: 'POST',
    body: JSON.stringify(body),
  });
}

export function getHealth() {
  return jsonFetch<{ ok: boolean; ts: string }>('/health');
}