import { useEffect, useMemo, useState } from "react";
import Header from "../components/header";
import MapView from "../components/mapView";
import { geocode, geocodeReverse } from "../lib/geocode";

import Weather from "../components/weather";
import Dashboard from "../components/dashboard";
import WeatherWidgets from "../components/weatherWidgets";
import WindOverview from "../components/WindOverview";
import ReactDatePicker from "../components/datepicker";
import Alerts from "../components/Alerts";
import UVindice from "../components/UVindex";
import AirQuality from "../components/airQuality";
import TemperatureChartCJ, { type TempPoint } from "../components/TemperatureChart";
import Probability from "../components/probability";
import Timeline from "../components/timeline";

import { postDashboard, type DashboardResponse } from "../lib/api";
import { toISOWithTZ } from "../lib/time";
import { buildWeatherSummary } from "../lib/nowcast";
import "../styles/principal.css";

// Iconos (assets)
import Sun1Icon from "../assets/Sun1.svg";
import MoonIcon from "../assets/Moon.svg";
import RainIcon from "../assets/Rain.svg";
import CloudIcon from "../assets/Cloud.svg";

const ICONS: Record<string, string> = {
  Sun1: Sun1Icon,
  Moon: MoonIcon,
  Rain: RainIcon,
  Cloud: CloudIcon,
};

type Viewport = { lat: number; lon: number; zoom: number; label?: string };

export default function Principal() {
  // === Ubicación (mapa/buscador)
  const [vp, setVp] = useState<Viewport>({
    lat: 29.0892,
    lon: -110.9613,
    zoom: 11,
    label: "Hermosillo, Sonora",
  });

  // Serie diaria para el chart
  const [dailyTemps, setDailyTemps] = useState<TempPoint[] | null>(null);
  const [dailyLoading, setDailyLoading] = useState(false);
  const [dailyError, setDailyError] = useState<string | null>(null);

  // === Zona horaria
  const [timezone] = useState<string>("America/Mazatlan");

  // === Fecha/hora objetivo
  const [selectedHour, setSelectedHour] = useState<number>(new Date().getHours());
  const [baseDate, setBaseDate] = useState<Date | null>(() => {
    const d = new Date();
    d.setMinutes(0, 0, 0);
    return d;
  });
  const [targetISO, setTargetISO] = useState<string | undefined>(() => {
    const d = new Date();
    d.setMinutes(0, 0, 0);
    return toISOWithTZ(d, "America/Mazatlan");
  });

  // === Datos del backend
  const [data, setData] = useState<DashboardResponse | null>(null);
  const [loading, setLoading] = useState(false);
  const [errMsg, setErrMsg] = useState<string | null>(null);

  // === Overlay de nubes (OWM opcional)
  const owmKey = import.meta.env.VITE_OWM_KEY as string | undefined;
  const cloudsUrl = useMemo(() => {
    if (!owmKey) return "";
    return `https://tile.openweathermap.org/map/clouds_new/{z}/{x}/{y}.png?appid=${owmKey}`;
  }, [owmKey]);

  // === Fetch al backend
  async function fetchDashboard(lat: number, lon: number, when?: string) {
    setLoading(true);
    setErrMsg(null);
    try {
      const res = await postDashboard({ lat, lon, targetISO: when, timezone });
      setData(res);
    } catch (e: any) {
      console.error(e);
      setErrMsg(e.message ?? "Fetch error");
      setData(null);
    } finally {
      setLoading(false);
    }
  }

  async function fetchDailyTemps(lat: number, lon: number, startDate: Date, days = 6) {
    setDailyLoading(true);
    setDailyError(null);
    try {
      const out: TempPoint[] = [];
      const base = new Date(startDate);
      base.setHours(12, 0, 0, 0);

      for (let i = 0; i < days; i++) {
        const d = new Date(base);
        d.setDate(base.getDate() + i);

        const dayRes = await postDashboard({
          lat,
          lon,
          targetISO: toISOWithTZ(d, timezone),
          timezone,
        });

        out.push({
          dateISO: toISOWithTZ(d, timezone).slice(0, 10),
          highC: Math.round(dayRes.panel?.hiC ?? NaN),
          lowC: Math.round(dayRes.panel?.loC ?? NaN),
        });
      }

      const cleaned = out.filter((p) => Number.isFinite(p.highC) && Number.isFinite(p.lowC));
      setDailyTemps(cleaned.length ? cleaned : []);
    } catch (e: any) {
      setDailyError(e?.message ?? "No se pudo cargar la serie diaria");
      setDailyTemps([]);
    } finally {
      setDailyLoading(false);
    }
  }

  // Carga inicial
  useEffect(() => {
    fetchDashboard(vp.lat, vp.lon, targetISO);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Refresca cuando cambia ubicación o fecha/hora
  useEffect(() => {
    fetchDashboard(vp.lat, vp.lon, targetISO);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [vp.lat, vp.lon, targetISO]);

  // Recalcula la serie diaria cuando cambian ubicación o la fecha base (día)
  useEffect(() => {
    const day0 = new Date(baseDate ?? new Date());
    day0.setHours(0, 0, 0, 0);
    fetchDailyTemps(vp.lat, vp.lon, day0, 6);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [vp.lat, vp.lon, baseDate, timezone]);

  // === Helpers / Selectores
  const pct = (x?: number) => (typeof x === "number" ? Math.round(x * 100) : 0);
  const panel = data?.panel;
  const air = data?.airQuality;

  // Serie para AirQuality (barra pequeña por hora)
  const airSeries = useMemo(() => {
    if (!data?.hourly?.length) return [];
    return data.hourly.map((h: any) => ({
      label: h.timeLocal ?? "",
      value: ((typeof h.aqi_idx === "number" ? h.aqi_idx : air?.overall_idx ?? 0) * 50),
    }));
  }, [data?.hourly, air?.overall_idx]);

  // Adaptador de alertas
  const alertItems = useMemo(() => {
    const raw = (data as any)?.alerts;
    if (!Array.isArray(raw)) return [];
    return raw
      .map((a) => (typeof a === "string" ? a : a?.text))
      .filter((t): t is string => typeof t === "string" && t.trim().length > 0);
  }, [data?.alerts]);

  // Weather summary (card superior)
  const weather = data ? buildWeatherSummary(data, { hour: selectedHour }) : { desc: "—", icon: "Cloud" as const };
  const iconSrc = ICONS[weather.icon];
  const deg = Math.round(panel?.tempNowC ?? 0);
  const hi = Math.round(panel?.hiC ?? 0);
  const lo = Math.round(panel?.loC ?? 0);

  // UV dinámico (OMS)
  function uvLevelText(u: number) {
    if (u < 3) return "Low";
    if (u < 6) return "Moderate";
    if (u < 8) return "High";
    if (u < 11) return "Very High";
    return "Extreme";
  }
  const uvAtHour = data?.hourly?.[selectedHour]?.uv_idx ?? panel?.uv_index ?? 0;
  const uvLevel = uvLevelText(uvAtHour);

  // Heurística de “viento extremo” en %
  const gust = panel?.wind.gust_kmh ?? 0;
  const extremeWindPct = Math.max(0, Math.min(100, Math.round(((gust - 40) / 40) * 100)));

  // === Date / Time handlers
  function handleDateChange(d: Date | null) {
    setBaseDate(d);
    const base = d ?? new Date();
    const copy = new Date(base);
    copy.setHours(selectedHour, 0, 0, 0);
    copy.setSeconds(0, 0);
    // Antes: setTargetISO(toISOWithTZ(copy, timezone));
    setTargetISO(copy.toISOString()); // UTC puro
    }


    function handleHourChange(hour: number) {
    setSelectedHour(hour);
    const base = baseDate ?? new Date();
    const d = new Date(base);
    d.setHours(hour, 0, 0, 0);
    setTargetISO(d.toISOString()); // UTC puro
    }

  return (
    <div
      style={{
        padding: 12,
        height: "100vh",
        display: "grid",
        gridTemplateRows: "auto 1fr",
        gap: 12,
      }}
    >
      {/* HEADER + SEARCH */}
      <Header
        onSearch={async (q) => {
          try {
            const results = await geocode(q, 1);
            if (!results.length) {
              alert("No encontré esa ubicación");
              return;
            }
            const r = results[0];
            setVp({ lat: r.lat, lon: r.lon, zoom: 12, label: r.name });
          } catch {
            alert("No encontré esa ubicación");
          }
        }}
        onInfoClick={() => alert("SkyCheck — beta")}
      />

      {/* MAPA + DASHBOARD */}
      <div
        style={{
          borderRadius: 12,
          overflow: "hidden",
          position: "relative",
        }}
      >
        {/* Mapa principal con overlay */}
        <MapView
          lat={vp.lat}
          lon={vp.lon}
          zoom={vp.zoom}
          label={vp.label}
          overlayUrl={cloudsUrl || undefined}
          overlayOpacity={0.55}
          onPick={async (la, lo) => {
            setVp((prev) => ({ ...prev, lat: la, lon: lo }));
            try {
              const r = await geocodeReverse(la, lo);
              setVp((prev) => ({
                ...prev,
                label: r?.name ?? `${la.toFixed(4)}, ${lo.toFixed(4)}`,
              }));
            } catch {
              setVp((prev) => ({
                ...prev,
                label: `${la.toFixed(4)}, ${lo.toFixed(4)}`,
              }));
            }
          }}
        />

        {/* DatePicker */}
        <div className="date-overlay">
          <ReactDatePicker value={targetISO ? new Date(targetISO) : baseDate} onChange={handleDateChange} />
        </div>

        {/* Weather overlay */}
        <div className="weather-overlay">
          <Weather description={weather.desc} icon={iconSrc} degrees={deg} high={hi} low={lo} />
        </div>

        {/* Timeline */}
        <div className="time-overlay">
          <Timeline hours={data?.hourly ?? []} value={selectedHour} onChangeHour={handleHourChange} />
        </div>

        {/* Dashboard flotante a la derecha */}
        <div className="dashboard-overlay">
          <Dashboard ciudad={vp.label ?? "Hermosillo"}>
            <div className="espacio"></div>

            {/* Estado de carga / error */}
            {loading && <div style={{ color: "#888" }}>Cargando…</div>}
            {errMsg && <div style={{ color: "tomato" }}>Error: {errMsg}</div>}

            {/* Alerts */}
            <Alerts title="Alerts" items={alertItems} />

            {/* Widgets varios (datos reales) */}
            <WeatherWidgets
              key={`wx-${vp.lat}-${vp.lon}-${targetISO ?? ""}`}
              data={{
                precipitation: {
                  lastHour: panel?.precipLast1h_mm ?? 0,
                  last24Hours: panel?.precipLast24h_mm ?? 0,
                },
                humidity: {
                  percentage: Math.round(panel?.humidity_pct ?? 0),
                  level: humidityLevel(panel?.humidity_pct),
                },
              }}
            />

            {/* Viento */}
            <WindOverview
              velocity={panel?.wind.speed_kmh ?? 0}
              direction={panel?.wind.direction_deg ?? 0}
              gusts={panel?.wind.gust_kmh ?? 0}
            />

            {/* UV dinámico */}
            <UVindice key={`uv-${selectedHour}-${targetISO ?? ""}`} uvIndex={Math.round(uvAtHour)} level={uvLevel} />

            {/* Air quality (barra + mini chart) */}
            <AirQuality
            aqi={typeof air?.overall_idx === 'number' ? air.overall_idx * 50 : 0}
            level={air?.overall_text ?? '—'}
            series={airSeries}
            />

            {/* Temperatura diaria */}
            {dailyLoading ? (
              <div className="card-muted">Cargando temperatura diaria…</div>
            ) : dailyError ? (
              <div className="card-error">{dailyError}</div>
            ) : dailyTemps && dailyTemps.length > 0 ? (
              <TemperatureChartCJ data={dailyTemps} />
            ) : (
              <div className="card-muted">Sin datos de temperatura para este rango.</div>
            )}

            {/* Probabilidades */}
            <Probability
              hot={pct(panel?.veryFlag.veryHot)}
              cold={pct(panel?.veryFlag.veryCold)}
              humidity={Math.round(panel?.humidity_pct ?? 0)}
              rain={pct(panel?.veryFlag.veryWet)}
              wind={extremeWindPct}
              uv={pct(panel?.veryFlag.dangerousUV)}
            />

            <div className="espacio"></div>
          </Dashboard>
        </div>
      </div>
    </div>
  );
}

/** Traduce % de humedad a Low/Medium/High para el widget */
function humidityLevel(p?: number): "Low" | "Medium" | "High" {
  const h = typeof p === "number" ? p : 0;
  if (h < 40) return "Low";
  if (h < 70) return "Medium";
  return "High";
}