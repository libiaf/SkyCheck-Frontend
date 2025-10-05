import '../styles/AirQuality.css';
import airQuality from '../assets/airQuality.svg'; 

// Mock data - luego vendrá del backend
const mockData = [
  { day: 'sáb', readings: [30, 35, 30] },
  { day: 'dom', readings: [25, 35, 35] },
  { day: 'lun', readings: [35, 35, 30] },
  { day: 'lun', readings: [35, 35, 30] },
  { day: 'lun', readings: [35, 35, 30] }
];

interface AirQualityProps {
  aqi?: number;      // Air Quality Index (0-500)
  level?: string;    // "Great", "Good", "Moderate", etc.
  data?: typeof mockData;
}

const AirQuality: React.FC<AirQualityProps> = ({ 
  aqi = 0, 
  level = "Great",
  data = mockData 
}) => {
  // Normalizamos el AQI a una escala 0-100 para la barra
  // AQI va de 0 a 500, pero la mayoría del rango útil está en 0-300
  const progress = Math.min((aqi / 300) * 100, 100);

  return (
    <div className="air-quality-container glass shadow-md">
      {/* Header con icono y título */}
      <div className="air-quality-header">
        <div className="air-quality-title-wrapper">
          <img src={airQuality} alt="Air Quality" />
          <span className="air-quality-title">Air quality</span>
        </div>
      </div>

      {/* Valor + Barra */}
      <div className="air-quality-content">
        <span className="air-quality-value">{aqi}</span>
        <span className="air-quality-level">{level}</span>

        <div className="air-quality-bar">
          <div 
            className="air-quality-marker" 
            style={{ left: `${progress}%` }}
          ></div>
        </div>
      </div>

      {/* Gráfica de barras histórica */}
      <div className="air-quality-chart">
        {data.map((dayData, dayIndex) => (
          <div key={dayIndex} className="chart-day-group">
            <div className="chart-bars-container">
              {dayData.readings.map((value, readingIndex) => (
                <div key={readingIndex} className="chart-bar-wrapper">
                  <div 
                    className="chart-bar"
                    style={{ height: `${(value / 40) * 100}%` }}
                  >
                    <span className="chart-bar-value">{value}</span>
                  </div>
                  <span className="chart-time">
                    {String((5 + readingIndex * 6) % 24).padStart(2, '0')}:00
                  </span>
                </div>
              ))}
            </div>
            <div className="chart-day-label">{dayData.day}</div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default AirQuality;
