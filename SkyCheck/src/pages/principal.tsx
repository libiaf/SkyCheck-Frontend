import { useState } from "react";
import Header from "../components/header";
import MapView from "../components/MapView";
import { geocodeMock } from "../lib/geocodeMock";

type Viewport = { lat:number; lon:number; zoom:number; label?:string };

export default function Principal() {
  const [vp, setVp] = useState<Viewport>({
    lat: 29.0892, lon: -110.9613, zoom: 11, label: "Hermosillo, Sonora"
  });

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