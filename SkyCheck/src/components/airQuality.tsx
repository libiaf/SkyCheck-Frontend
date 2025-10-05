// src/components/airQuality.tsx
import '../styles/AirQuality.css';
import airQuality from '../assets/airQuality.svg';

// Mock (fallback) – conserva tu estructura original
const mockData = [
  { day: 'sáb', readings: [30, 35, 30] },
  { day: 'dom', readings: [25, 35, 35] },
  { day: 'lun', readings: [35, 35, 30] },
  { day: 'lun', readings: [35, 35, 30] },
  { day: 'lun', readings: [35, 35, 30] }
];

type SeriesPoint = { label: string; value: number }; // value en escala AQI 0..500

interface AirQualityProps {
  aqi?: number;                    // Air Quality Index (0..500)
  level?: string;                  // "Great", "Good", "Moderate", etc.
  /** NUEVO: serie horaria para las barras (si viene, se usa en lugar de mockData) */
  series?: SeriesPoint[];
  /** Fallback legacy (mantengo compatibilidad) */
  data?: typeof mockData;
}

const clamp01 = (x: number) => Math.max(0, Math.min(1, x));

const AirQuality: React.FC<AirQualityProps> = ({
  aqi = 0,
  level = 'Great',
  series,
  data = mockData
}) => {
  // Normaliza posición de la perilla (0..100%) usando 0..500
  const progress = clamp01(aqi / 500) * 100;

  // Normalizador de altura de barra (0..100%) también en 0..500
  const hPct = (v: number) => `${clamp01(v / 500) * 100}%`;

  const hasSeries = Array.isArray(series) && series.length > 0;

  return (
    <div className="air-quality-container glass shadow-md">
      {/* Header */}
      <div className="air-quality-header">
        <div className="air-quality-title-wrapper">
          <img src={airQuality} alt="Air Quality" />
          <span className="air-quality-title">Air quality</span>
        </div>
      </div>

      {/* Valor + Barra de gradiente */}
      <div className="air-quality-content">
        <span className="air-quality-value">{Math.round(aqi)}</span>
        <span className="air-quality-level">{level}</span>

        <div className="air-quality-bar">
          <div
            className="air-quality-marker"
            style={{ left: `${progress}%` }}
          />
        </div>
      </div>

      {/* Gráfica de barras */}
      <div className="air-quality-chart">
        {hasSeries ? (
          // ====== MODO SERIE REAL (una tira continua de barras) ======
          <div className="chart-day-group">
            <div className="chart-bars-container">
              {series!.map((pt, i) => (
                <div key={`${pt.label}-${i}`} className="chart-bar-wrapper">
                  <div
                    className="chart-bar"
                    style={{ height: hPct(pt.value) }}
                  >
                    <span className="chart-bar-value">
                      {Math.round(pt.value)}
                    </span>
                  </div>
                  <span className="chart-time">{pt.label}</span>
                </div>
              ))}
            </div>
            {/* Etiqueta de “día” opcional; puedes poner el nombre real si quieres */}
            <div className="chart-day-label">today</div>
          </div>
        ) : (
          // ====== MODO MOCK LEGACY (tu vista por días) ======
          data.map((dayData, dayIndex) => (
            <div key={dayIndex} className="chart-day-group">
              <div className="chart-bars-container">
                {dayData.readings.map((value, readingIndex) => (
                  <div key={readingIndex} className="chart-bar-wrapper">
                    <div
                      className="chart-bar"
                      style={{ height: hPct(value) }}
                    >
                      <span className="chart-bar-value">{value}</span>
                    </div>
                    <span className="chart-time">
                      {String((5 + readingIndex * 6) % 24).padStart(2, '0')}
                      :00
                    </span>
                  </div>
                ))}
              </div>
              <div className="chart-day-label">{dayData.day}</div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default AirQuality;