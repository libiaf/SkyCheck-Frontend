import '../styles/weatherWidgets.css';
import wet from '../assets/Wet.svg';
import moisture from '../assets/Moisture.svg';

interface WeatherData {
    precipitation: {
        lastHour: number;
        last24Hours: number;
    };
    humidity: {
        percentage: number;
        level: 'Low' | 'Medium' | 'High';
    };
}

interface Props {
    data?: WeatherData;
}

// Mock data por defecto
const defaultData: WeatherData = {
    precipitation: {
        lastHour: 2.1,
        last24Hours: 18.6,
    },
    humidity: {
        percentage: 30,
        level: 'Low'
    }
};

export const WeatherWidgets = ({ data = defaultData }: Props) => {
    return (
        <div className="widgets-container">
            <PrecipitationWidget data={data.precipitation} />
            <HumidityWidget data={data.humidity} />
        </div>
    );
};

const PrecipitationWidget = ({ data }: { data: WeatherData['precipitation'] }) => {
    return (
        <div className="widget-card">
            <div className="widget-header">
                <img src={wet} alt="Precipitation" />
                <h3 className='extra-margin2'>Precipitation</h3>
            </div>

            <div className="precipitation-grid">
                <div className="precipitation-square">
                    <div className="data-card">
                        <div className="value">{data.lastHour}</div>
                        <div className="unit">mm</div>
                    </div>
                    <div className="badge badge-purple">Last hour</div>
                </div>

                <div className="precipitation-square">
                    <div className="data-card">
                        <div className="value">{data.last24Hours}</div>
                        <div className="unit">mm</div>
                    </div>
                    <div className="badge badge-blue">Last 24 hours</div>
                </div>
            </div>
        </div>
  );
};

const HumidityWidget = ({ data }: { data: WeatherData['humidity'] }) => {
    return (
        <div className="humidity-widget">
            <div className="widget-header extra-margin">
                <img src={moisture} alt="Humidity" />
                <h3>Humidity</h3>
            </div>

            <div className="data-card large">
                <div className="value large">{data.percentage}%</div>
            </div>

            <div className={`badge badge-${data.level.toLowerCase()}`}>
                {data.level}
            </div>
        </div>
    );
};

export default WeatherWidgets;