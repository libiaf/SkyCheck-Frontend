import { MapContainer, TileLayer, Marker, Popup, useMap } from "react-leaflet";
import { useEffect } from "react";

type Props = {
  lat: number;
  lon: number;
  zoom: number;
  label?: string;
  overlayUrl?: string;    
  overlayOpacity?: number; 
};

function FlyTo({ lat, lon, zoom }: { lat:number; lon:number; zoom:number }) {
  const map = useMap();
  useEffect(() => { map.flyTo([lat, lon], zoom, { duration: 0.8 }); }, [lat, lon, zoom]);
  return null;
}

export default function MapView({ lat, lon, zoom, label, overlayUrl, overlayOpacity = 0.55 }: Props) {
  return (
    <MapContainer
      center={[lat, lon]}
      zoom={zoom}
      style={{ width: "100%", height: "95%" }}
      scrollWheelZoom
    >
      {/* Basemap CLARO (SIEMPRE) */}
      <TileLayer
        attribution="&copy; Stadia, &copy; OpenStreetMap"
        url="https://tiles.stadiamaps.com/tiles/alidade_smooth/{z}/{x}/{y}{r}.png"
        zIndex={200}
      />

      {/* Overlay de nubes (encima, con opacidad controlada) */}
      {overlayUrl && (
        <TileLayer
          url={overlayUrl}
          opacity={1}
          zIndex={300}
          className="clouds-tiles clouds-dark"
          attribution="Clouds © OpenWeatherMap"
        />
      )}

      <FlyTo lat={lat} lon={lon} zoom={zoom} />
      <Marker position={[lat, lon]}>
        <Popup>{label ?? `${lat.toFixed(4)}, ${lon.toFixed(4)}`}</Popup>
      </Marker>
    </MapContainer>
  );
}