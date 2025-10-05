import React from "react";
import "../styles/probability.css"; // el css que pegaste (mismo nombre/ruta que uses)

type Props = {
  title?: string;
  hot?: number;    // Very hot   (0..100)
  cold?: number;   // Very cold  (0..100)
  humid?: number;  // Very humid (0..100)
  rain?: number;   // Rainy day / Very wet (0..100)
  wind?: number;   // Extreme wind (0..100)
  uv?: number;     // Dangerous UV (0..100)
};

const clampPct = (v?: number) =>
  Math.max(0, Math.min(100, Math.round(typeof v === "number" ? v : 0)));

export default function Probability({
  title = "Probability Check",
  hot = 0,
  cold = 0,
  humid = 0,
  rain = 0,
  wind = 0,
  uv = 0,
}: Props) {
  const vHot = clampPct(hot);
  const vCold = clampPct(cold);
  const vHum = clampPct(humid);
  const vRain = clampPct(rain);
  const vWind = clampPct(wind);
  const vUV = clampPct(uv);

  return (
    <div id="mainbox">
      <div id="title">
        {/* si tienes un icono aquí lo pones */}
        <h1>{title}</h1>
      </div>

      <div id="databox">
        <div id="left">
          {/* Very hot */}
          <div className="bar">
            <p>Very hot</p>
            <div className="bar-track">
              <div className="bar-fill-hot" style={{ width: `${vHot}%` }} />
              <span className="bar-text-hot">{vHot}%</span>
            </div>
          </div>

          {/* Very cold */}
          <div className="bar">
            <p>Very cold</p>
            <div className="bar-track">
              <div className="bar-fill-cold" style={{ width: `${vCold}%` }} />
              <span className="bar-text-cold">{vCold}%</span>
            </div>
          </div>

          {/* Very humid */}
          <div className="bar">
            <p>Very humid</p>
            <div className="bar-track">
              <div className="bar-fill-humidity" style={{ width: `${vHum}%` }} />
              <span className="bar-text-humidity">{vHum}%</span>
            </div>
          </div>
        </div>

        <div id="right">
          {/* Extreme rain / Rainy day */}
          <div className="bar">
            <p>Extreme rain</p>
            <div className="bar-track">
              <div className="bar-fill-rain" style={{ width: `${vRain}%` }} />
              <span className="bar-text-rain">{vRain}%</span>
            </div>
          </div>

          {/* Extreme wind */}
          <div className="bar">
            <p>Extreme wind</p>
            <div className="bar-track">
              <div className="bar-fill-wind" style={{ width: `${vWind}%` }} />
              <span className="bar-text-wind">{vWind}%</span>
            </div>
          </div>

          {/* Dangerous UV */}
          <div className="bar">
            <p>Dangerous UV</p>
            <div className="bar-track">
              <div className="bar-fill-uv" style={{ width: `${vUV}%` }} />
              <span className="bar-text-uv">{vUV}%</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}