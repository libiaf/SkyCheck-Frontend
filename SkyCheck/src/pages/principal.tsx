import { useState } from "react";
import Header from "../components/header.tsx";
import MapView from "../components/mapView.tsx";
import { geocodeMock } from "../lib/geocodeMock";

type Viewport = { lat:number; lon:number; zoom:number; label?:string };

export default function Principal() {
  const [vp, setVp] = useState<Viewport>({
    lat: 29.0892, lon: -110.9613, zoom: 11, label: "Hermosillo, Sonora"
  });
import Dashboard from '../components/dashboard';
import WeatherWidgets from '../components/weatherWidgets.tsx';
import WindOverview from '../components/WindOverview.tsx';
import UVindice from '../components/UVindex.tsx';
import ReactDatePicker from '../components/datepicker';
import Alerts from '../components/Alerts';
import AirQuality from '../components/airQuality.tsx';
import TemperatureChartCJ, { type TempPoint } from "../components/TemperatureChart";
import Probability from '../components/probability.tsx';

import '../styles/principal.css';

const mockTemps: TempPoint[] = [
  { dateISO: "2025-09-04", highC: 35, lowC: 24 },
  { dateISO: "2025-09-05", highC: 34, lowC: 21 },
  { dateISO: "2025-09-06", highC: 35, lowC: 21 },
  { dateISO: "2025-09-07", highC: 38, lowC: 24 },
  { dateISO: "2025-09-08", highC: 39, lowC: 25 },
  { dateISO: "2025-09-09", highC: 40, lowC: 26 },
  { dateISO: "2025-09-10", highC: 41, lowC: 26 },
  { dateISO: "2025-09-11", highC: 38, lowC: 28 },
  { dateISO: "2025-09-12", highC: 37, lowC: 28 },
  { dateISO: "2025-09-13", highC: 35, lowC: 27 },
  { dateISO: "2025-09-14", highC: 33, lowC: 27 },
  { dateISO: "2025-09-15", highC: 30, lowC: 24 },
  { dateISO: "2025-09-16", highC: 32, lowC: 24 },
  { dateISO: "2025-09-17", highC: 30, lowC: 22 },
];



const Principal = () => {
    return (
        <div> {/* mapa */}
            <div> {/* nav bar */}
                
            </div>
            <div> {/* content */} 
                <div> {/* left content, wet+date+hours */}
                    {/*<ReactDatePicker></ReactDatePicker>*/}
                    <div> {/* wet */}
                    </div>
                    <div> {/* date + hours */}
                        <div> {/* date */}
                            <ReactDatePicker></ReactDatePicker>
                        </div>
                        <div> {/* hours */}

                        </div>
                    </div>
                </div>
                <div className="principal-container d-flex justify-content-end align-items-end">
                <Dashboard ciudad="Hermosillo" >
                    <div className= "espacio"></div>
                    <Alerts
                    items={[
                        "Warning: High UV index expected.",
                        "Warning: Strong winds after 3 PM."
                    ]}
                    />
                    <WeatherWidgets />
                    <WindOverview velocity={15} direction={0} gusts={25} />
                    <UVindice uvIndex={8} level="High" />
                    <AirQuality aqi={120} level="Moderate" />
                    <TemperatureChartCJ data={mockTemps} />
                    <Probability hot={30} cold={40} wind={70} uv={20} rain={93} humidity={67} />
                    <div className= "espacio"></div>
                </Dashboard>
                </div>
            </div>
        </div>
    );
};

  return (
    <div style={{ padding: 12, height: "100vh", display: "grid", gridTemplateRows: "auto 1fr", gap: 12 }}>
      <Header
        onSearch={async (q) => {
          try {
            const r = await geocodeMock(q);
            setVp({ lat: r.lat, lon: r.lon, zoom: 12, label: r.name });
          } catch {
            alert("No encontré esa ubicación");
          }
        }}
        onInfoClick={() => alert("SkyCheck — beta")}
      />
      <div style={{ borderRadius: 12, overflow: "hidden" }}>
        <MapView lat={vp.lat} lon={vp.lon} zoom={vp.zoom} label={vp.label} />
      </div>
    </div>
  );
}