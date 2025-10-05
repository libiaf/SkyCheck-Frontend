import { useMemo, useState } from "react";
import Header from "../components/header";
import MapView from "../components/mapView.tsx";
import { geocodeMock } from "../lib/geocodeMock";

import Dashboard from "../components/dashboard";
import WeatherWidgets from "../components/weatherWidgets.tsx";
import WindOverview from "../components/WindOverview.tsx";
import UVindice from "../components/UVindex.tsx";
import ReactDatePicker from "../components/datepicker";
import Alerts from "../components/Alerts";
import AirQuality from "../components/airQuality.tsx";
import TemperatureChartCJ, { type TempPoint } from "../components/TemperatureChart";
import Probability from "../components/probability.tsx";
import Timeline from "../components/timeline.tsx";

import "../styles/principal.css";

type Viewport = { lat: number; lon: number; zoom: number; label?: string };

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

export default function Principal() {
    const [vp, setVp] = useState<Viewport>({
        lat: 29.0892,
        lon: -110.9613,
        zoom: 11,
        label: "Hermosillo, Sonora",
    });

    const owmKey = import.meta.env.VITE_OWM_KEY as string | undefined;

    // Capa de nubes en tiempo real (overlay)
    const cloudsUrl = useMemo(() => {
        if (!owmKey) return "";
        return `https://tile.openweathermap.org/map/clouds_new/{z}/{x}/{y}.png?appid=${owmKey}`;
    }, [owmKey]);

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
                        const r = await geocodeMock(q);
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
                />

                <div className="date-overlay">
                    <ReactDatePicker></ReactDatePicker>
                </div>

                <div className="time-overlay">
                    <Timeline />
                </div>

                {/* Dashboard flotante a la derecha */}
                <div
                    className="dashboard-overlay"
                >
                    <Dashboard ciudad={vp.label ?? "Hermosillo"}>
                        <div className="espacio"></div>
                        <Alerts
                            items={[
                                "Warning: High UV index expected.",
                                "Warning: Strong winds after 3 PM.",
                            ]}
                        />
                        <WeatherWidgets />
                        <WindOverview velocity={15} direction={0} gusts={25} />
                        <UVindice uvIndex={8} level="High" />
                        <AirQuality aqi={120} level="Moderate" />
                        <TemperatureChartCJ data={mockTemps} />
                        <Probability
                            hot={30}
                            cold={40}
                            wind={70}
                            uv={20}
                            rain={93}
                            humidity={67}
                        />
                        <div className="espacio"></div>
                    </Dashboard>
                </div>

            </div>
        </div>
    );
}
