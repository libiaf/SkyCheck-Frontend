// src/lib/nowcast.ts
import type { DashboardResponse } from "./api";

export type IconKey = "Sun1" | "Moon" | "Rain" | "Cloud";

function findSlotForHour(data: DashboardResponse, hour?: number) {
  const slots = data.hourly ?? [];
  if (!slots.length) return null;
  if (typeof hour !== "number") return slots[0];

  // Busca el slot cuya HH (de "HH:mm") esté más cerca de `hour`
  let best = slots[0];
  let bestDiff = 999;
  for (const s of slots) {
    const hh = parseInt(String(s.timeLocal).slice(0, 2), 10);
    const diff = Math.abs(hh - hour);
    if (diff < bestDiff) { best = s; bestDiff = diff; }
  }
  return best;
}

export function buildWeatherSummary(
  data: DashboardResponse,
  opts?: { hour?: number }   // ← hora seleccionada 0..23
): { desc: string; icon: IconKey } {

  const slot = findSlotForHour(data, opts?.hour);

  const uv = slot?.uv_idx ?? data.panel?.uv_index ?? 0;
  const precipMM = slot?.precip1h_mm ?? data.panel?.precipLast1h_mm ?? 0;
  const probPct  = slot?.probPrecip1h_pct ?? 0;

  // Día/noche: preferimos UV del slot; si no, caemos a regla por hora (6..17 = día)
  let isDay = uv > 0.2;
  if (!isDay && slot?.timeLocal) {
    const hh = parseInt(String(slot.timeLocal).slice(0, 2), 10);
    isDay = hh >= 6 && hh < 18; // 12 = mediodía → día
  }

  // Reglas simples para icono/descripcion
  if (precipMM >= 0.2 || probPct >= 50) {
    return { desc: probPct >= 50 ? "Rain likely" : "Light rain", icon: "Rain" };
  }
  if (!isDay) return { desc: "Clear night", icon: "Moon" };

  if (uv >= 5) return { desc: "Sunny", icon: "Sun1" };
  return { desc: "Partly cloudy", icon: "Cloud" };
}