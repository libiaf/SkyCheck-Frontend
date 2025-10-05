import { useState, useEffect } from 'react';
import '../styles/timeline.css';

// Importa tus SVGs
import sun from '../assets/Sun.svg';
import rain from '../assets/Rain.svg';
import moon from '../assets/Moon.svg';
import cloud from '../assets/Cloud.svg';
import arrowLeft from '../assets/Chevron Left.svg';
import arrowRight from '../assets/Chevron Right.svg';

// Tipos basados en la respuesta de la API Meteomatics
interface WeatherHourData {
    timeLocal: string;
    tempC: number;
    probPrecip1h_pct: number;
    precip1h_mm: number;
    uv_idx: number;
}

interface WeatherApiResponse {
    mode: string;
    location: {
        lat: number;
        lon: number;
        veryHot: number;
        veryCold: number;
        veryHumid: number;
        extremeRain: number;
    };
    current: {
        timeLocal: string;
        tempC: number;
        wind: {
            speed_kmh: number;
            direction_deg: number;
        };
        precipLast1h_mm: number;
        precipLast24h_mm: number;
        humidity_pct: number;
        uv_idx: number;
    };
    hourly: WeatherHourData[];
}

interface TimelineProps {
    onHourSelect?: (data: WeatherHourData) => void;
    apiEndpoint?: string; // URL del endpoint del backend
    lat?: number;
    lon?: number;
    date?: string;
}

// Mock data completo basado en la respuesta de la API
const mockApiResponse: WeatherApiResponse = {
    mode: "forecast",
    location: {
        lat: 29.0892,
        lon: -110.9613,
        veryHot: 0.16,
        veryCold: 0,
        veryHumid: 0,
        extremeRain: 0
    },
    current: {
        timeLocal: "00:00",
        tempC: 27.5,
        wind: {
            speed_kmh: 6,
            direction_deg: 246.7
        },
        precipLast1h_mm: 0,
        precipLast24h_mm: 0,
        humidity_pct: 60,
        uv_idx: 0
    },
    hourly: [
        { timeLocal: '00:00', tempC: 27.5, probPrecip1h_pct: 1, precip1h_mm: 0, uv_idx: 0 },
        { timeLocal: '01:00', tempC: 27.2, probPrecip1h_pct: 1, precip1h_mm: 0, uv_idx: 0 },
        { timeLocal: '02:00', tempC: 26.8, probPrecip1h_pct: 1, precip1h_mm: 0, uv_idx: 0 },
        { timeLocal: '03:00', tempC: 26.5, probPrecip1h_pct: 1, precip1h_mm: 0, uv_idx: 0 },
        { timeLocal: '04:00', tempC: 26.2, probPrecip1h_pct: 1, precip1h_mm: 0.3, uv_idx: 0 },
        { timeLocal: '05:00', tempC: 26.0, probPrecip1h_pct: 1, precip1h_mm: 0, uv_idx: 0 },
        { timeLocal: '06:00', tempC: 26.8, probPrecip1h_pct: 1, precip1h_mm: 0, uv_idx: 0 },
        { timeLocal: '07:00', tempC: 27.3, probPrecip1h_pct: 1, precip1h_mm: 0, uv_idx: 0 },
        { timeLocal: '08:00', tempC: 28.0, probPrecip1h_pct: 1, precip1h_mm: 0, uv_idx: 1 },
        { timeLocal: '09:00', tempC: 30.1, probPrecip1h_pct: 1, precip1h_mm: 0, uv_idx: 7 },
        { timeLocal: '10:00', tempC: 31.6, probPrecip1h_pct: 1, precip1h_mm: 0, uv_idx: 8 },
        { timeLocal: '11:00', tempC: 33.4, probPrecip1h_pct: 1, precip1h_mm: 0, uv_idx: 8 },
        { timeLocal: '12:00', tempC: 35.2, probPrecip1h_pct: 1, precip1h_mm: 0, uv_idx: 8 },
        { timeLocal: '13:00', tempC: 36.1, probPrecip1h_pct: 1, precip1h_mm: 0, uv_idx: 8 },
        { timeLocal: '14:00', tempC: 36.8, probPrecip1h_pct: 1, precip1h_mm: 0, uv_idx: 7 },
        { timeLocal: '15:00', tempC: 36.9, probPrecip1h_pct: 1, precip1h_mm: 0, uv_idx: 5 },
        { timeLocal: '16:00', tempC: 36.2, probPrecip1h_pct: 1, precip1h_mm: 0, uv_idx: 2 },
        { timeLocal: '17:00', tempC: 34.0, probPrecip1h_pct: 1, precip1h_mm: 0, uv_idx: 2 },
        { timeLocal: '18:00', tempC: 34.3, probPrecip1h_pct: 1, precip1h_mm: 0, uv_idx: 1 },
        { timeLocal: '19:00', tempC: 32.5, probPrecip1h_pct: 1, precip1h_mm: 0, uv_idx: 0 },
        { timeLocal: '20:00', tempC: 31.0, probPrecip1h_pct: 1, precip1h_mm: 0, uv_idx: 0 },
        { timeLocal: '21:00', tempC: 29.8, probPrecip1h_pct: 1, precip1h_mm: 0, uv_idx: 0 },
        { timeLocal: '22:00', tempC: 28.8, probPrecip1h_pct: 1, precip1h_mm: 0, uv_idx: 0 },
        { timeLocal: '23:00', tempC: 28.5, probPrecip1h_pct: 1, precip1h_mm: 0, uv_idx: 0 },
    ]
};

const Timeline = ({
    onHourSelect,
    apiEndpoint,
    lat,
    lon,
    date
}: TimelineProps) => {
    const [weatherData, setWeatherData] = useState<WeatherHourData[]>(mockApiResponse.hourly);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    
    const getCurrentHourIndex = () => {
        const now = new Date();
        const currentHour = now.getHours();
        return weatherData.findIndex(hour => {
            const hourValue = parseInt(hour.timeLocal.split(':')[0]);
            return hourValue === currentHour;
        });
    };
    
    const [selectedHour, setSelectedHour] = useState(getCurrentHourIndex() !== -1 ? getCurrentHourIndex() : 12);
    const [scrollPosition, setScrollPosition] = useState(
        Math.max(0, Math.min(selectedHour - 3, weatherData.length - 8))
    );

    // Fetch data from API
    useEffect(() => {
        const fetchWeatherData = async () => {
            // Si no hay apiEndpoint, usar mock data
            if (!apiEndpoint) {
                setWeatherData(mockApiResponse.hourly);
                return;
            }

            setLoading(true);
            setError(null);

            try {
                const params = new URLSearchParams();
                if (lat) params.append('lat', lat.toString());
                if (lon) params.append('lon', lon.toString());
                if (date) params.append('date', date);

                const response = await fetch(`${apiEndpoint}?${params.toString()}`);
                
                if (!response.ok) {
                    throw new Error('Error al obtener datos del clima');
                }

                const data: WeatherApiResponse = await response.json();
                setWeatherData(data.hourly);
            } catch (err) {
                setError(err instanceof Error ? err.message : 'Error desconocido');
                // Fallback a mock data en caso de error
                setWeatherData(mockApiResponse.hourly);
            } finally {
                setLoading(false);
            }
        };

        fetchWeatherData();
    }, [apiEndpoint, lat, lon, date]);

    // Determina el ícono basado en los datos de la API
    const getWeatherIcon = (hourData: WeatherHourData): string => {
        const hour = parseInt(hourData.timeLocal.split(':')[0]);

        // 1. PRIORIDAD: Si hay precipitación significativa -> LLUVIA
        if (hourData.precip1h_mm > 0.1 || hourData.probPrecip1h_pct > 30) {
            return rain;
        }

        // 2. Determinar si es de día o noche (6am-6pm = día)
        const isDaytime = hour >= 6 && hour < 18;

        // 3. Si es de noche -> LUNA
        if (!isDaytime) {
            return moon;
        }

        // 4. Si es de día, determinar basado en UV index
        // UV alto (>4) = despejado/soleado
        // UV bajo (<=4) = nublado
        if (hourData.uv_idx > 4) {
            return sun; // Día despejado
        } else {
            return cloud; // Día nublado
        }
    };

    const handlePrevious = () => {
        if (scrollPosition > 0) {
            setScrollPosition(scrollPosition - 1);
        }
    };

    const handleNext = () => {
        if (scrollPosition < weatherData.length - 8) {
            setScrollPosition(scrollPosition + 1);
        }
    };

    const handleHourClick = async (index: number) => {
        setSelectedHour(index);
        const selectedData = weatherData[index];
        
        // Llama al callback para actualizar el dashboard localmente
        if (onHourSelect) {
            onHourSelect(selectedData);
        }

        // Enviar la hora seleccionada al backend
        if (apiEndpoint) {
            try {
                await fetch(`${apiEndpoint}/select-hour`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({
                        timeLocal: selectedData.timeLocal,
                        tempC: selectedData.tempC,
                        probPrecip1h_pct: selectedData.probPrecip1h_pct,
                        precip1h_mm: selectedData.precip1h_mm,
                        uv_idx: selectedData.uv_idx,
                        lat: lat,
                        lon: lon,
                        date: date
                    }),
                });
            } catch (err) {
                console.error('Error al enviar hora seleccionada al backend:', err);
            }
        }
    };

    const formatTime = (timeString: string): { displayHour: number; period: string } => {
        const hour = parseInt(timeString.split(':')[0]);
        const displayHour = hour === 0 ? 12 : hour > 12 ? hour - 12 : hour;
        const period = hour >= 12 ? 'pm' : 'am';
        return { displayHour, period };
    };

    const visibleHours = weatherData.slice(scrollPosition, scrollPosition + 8);

    if (loading) {
        return (
            <div className="container">
                <div className="timeline-loading">Cargando datos del clima...</div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="container">
                <div className="timeline-error">Error: {error}. Usando datos de ejemplo.</div>
            </div>
        );
    }

    return (
        <div className="container">
            <button
                className="arrow-btn arrow-left"
                onClick={handlePrevious}
                disabled={scrollPosition === 0}
                aria-label="Previous hours"
            >
                <img src={arrowLeft} alt="Previous" />
            </button>

            <div className="timeline-container">
                {visibleHours.map((hour, index) => {
                    const actualIndex = scrollPosition + index;
                    const { displayHour, period } = formatTime(hour.timeLocal);

                    return (
                        <div
                            key={actualIndex}
                            className={`timeline-item ${selectedHour === actualIndex ? 'selected' : ''}`}
                            onClick={() => handleHourClick(actualIndex)}
                            role="button"
                            tabIndex={0}
                            aria-label={`Select ${hour.timeLocal}`}
                            onKeyDown={(e) => {
                                if (e.key === 'Enter' || e.key === ' ') {
                                    e.preventDefault();
                                    handleHourClick(actualIndex);
                                }
                            }}
                        >
                            <div className="time-label">
                                {displayHour}:00
                                <span className="period">{period}</span>
                            </div>
                            <div className="weather-icon">
                                <img src={getWeatherIcon(hour)} alt="Weather condition" />
                            </div>
                        </div>
                    );
                })}
            </div>

            <button
                className="arrow-btn arrow-right"
                onClick={handleNext}
                disabled={scrollPosition >= weatherData.length - 8}
                aria-label="Next hours"
            >
                <img src={arrowRight} alt="Next" />
            </button>
        </div>
    );
};

export default Timeline;