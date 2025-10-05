// src/components/timeline.tsx
import { useEffect, useMemo, useState } from "react";
import "../styles/timeline.css";

// SVGs
import sun from "../assets/Sun1.svg";
import rain from "../assets/Rain.svg";
import moon from "../assets/Moon.svg";
import cloud from "../assets/Cloud.svg";
import arrowLeft from "../assets/Chevron Left.svg";
import arrowRight from "../assets/Chevron Right.svg";

// ===== Tipos (compatibles con tu backend) =====
export interface WeatherHourData {
  timeLocal: string;            // "HH:mm"
  tempC: number;
  probPrecip1h_pct: number;     // 0..100
  precip1h_mm: number;
  uv_idx: number;
}

type TimelineProps = {
  /** Serie de 24 puntos (o las horas disponibles) */
  hours?: WeatherHourData[];
  /** Hora seleccionada (0..23). Si no se pasa, se usa estado interno. */
  value?: number;
  /** Callback cuando el usuario elige una hora (0..23) */
  onChangeHour?: (hour: number) => void;
};

// ===== Mock de respaldo (por si no llega `hours`) =====
const MOCK_HOURS: WeatherHourData[] = Array.from({ length: 24 }, (_, h) => ({
  timeLocal: `${String(h).padStart(2, "0")}:00`,
  tempC: 25 + Math.sin((h / 24) * Math.PI) * 10,
  probPrecip1h_pct: h === 4 ? 60 : 5,
  precip1h_mm: h === 4 ? 0.3 : 0,
  uv_idx: h >= 9 && h <= 15 ? 7 : h === 8 || h === 16 ? 4 : 0,
}));

export default function Timeline({ hours, value, onChangeHour }: TimelineProps) {
  // Serie efectiva
  const data = useMemo<WeatherHourData[]>(() => hours && hours.length ? hours : MOCK_HOURS, [hours]);

  // Selección interna (si no es controlado)
  const getInitialSelected = () => {
    const nowH = new Date().getHours();
    const idx = data.findIndex(h => parseInt(h.timeLocal.slice(0, 2)) === nowH);
    return idx >= 0 ? idx : 0;
  };

  const [internalSelected, setInternalSelected] = useState<number>(getInitialSelected());
  const selectedIndex = typeof value === "number"
    ? data.findIndex(h => parseInt(h.timeLocal.slice(0, 2)) === value)
    : internalSelected;

  // Mantener ventana visible (8 ítems)
  const [scrollPosition, setScrollPosition] = useState<number>(() => Math.max(0, Math.min(selectedIndex - 3, data.length - 8)));

  useEffect(() => {
    // si es controlado y cambia `value`, ajusta scroll
    if (typeof value === "number") {
      const idx = data.findIndex(h => parseInt(h.timeLocal.slice(0, 2)) === value);
      if (idx >= 0) {
        setScrollPosition(Math.max(0, Math.min(idx - 3, data.length - 8)));
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [value, data.length]);

  const visible = data.slice(scrollPosition, scrollPosition + 8);

  const iconFor = (h: WeatherHourData) => {
    const hour = parseInt(h.timeLocal.slice(0, 2));
    if (h.precip1h_mm > 0.1 || h.probPrecip1h_pct >= 50) return rain;
    const isDay = hour >= 6 && hour < 18;
    if (!isDay) return moon;
    return h.uv_idx > 4 ? sun : cloud;
  };

  const selectByIndex = (idxAbs: number) => {
    const hStr = data[idxAbs]?.timeLocal ?? "00:00";
    const hour = parseInt(hStr.slice(0, 2), 10); // "12:00" -> 12 (mediodía), "00:00" -> 0 (medianoche)
    onChangeHour?.(hour);

    // modo no controlado: guarda internal
    if (typeof value !== "number") setInternalSelected(idxAbs);
  };

  const handlePrev = () => setScrollPosition(p => Math.max(0, p - 1));
  const handleNext = () => setScrollPosition(p => Math.min(data.length - 8, p + 1));

  const format = (time: string) => {
    const h = parseInt(time.slice(0, 2));
    const display = h === 0 ? 12 : h > 12 ? h - 12 : h;
    const ampm = h >= 12 ? "pm" : "am";
    return { display, ampm };
  };

  return (
    <div className="container">
      <div className="arrow-btn arrow-left" onClick={handlePrev} aria-label="Previous hours">
        <img src={arrowLeft} alt="" className="arrow-icon"/>
      </div>

      <div className="timeline-container">
        {visible.map((h, i) => {
          const idxAbs = scrollPosition + i;
          const { display, ampm } = format(h.timeLocal);
          const isSelected = idxAbs === selectedIndex;

          return (
            <div
              key={idxAbs}
              className={`timeline-item ${isSelected ? "selected" : ""}`}
              onClick={() => selectByIndex(idxAbs)}
              role="button"
              tabIndex={0}
              onKeyDown={(e) => (e.key === "Enter" || e.key === " ") && selectByIndex(idxAbs)}
              aria-label={`Select ${h.timeLocal}`}
            >
              <div className="time-label">
                {display}:00 <span className="period">{ampm}</span>
              </div>
              <div className="weather">
                <img src={iconFor(h)} alt="" className="weather-icon"/>
              </div>
            </div>
          );
        })}
      </div>

      <div className="arrow-btn arrow-right" onClick={handleNext} aria-label="Next hours">
        <img src={arrowRight} alt="" className="arrow-icon"/>
      </div>
    </div>
  );
}