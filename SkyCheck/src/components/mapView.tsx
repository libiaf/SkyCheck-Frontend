import { MapContainer, TileLayer, Marker, Popup, useMap } from "react-leaflet";
import { useEffect } from "react";

type Props = { lat: number; lon: number; zoom: number; label?: string; };

function FlyTo({ lat, lon, zoom }: { lat:number; lon:number; zoom:number }) {
  const map = useMap();
  useEffect(() => { map.flyTo([lat, lon], zoom, { duration: 0.8 }); }, [lat, lon, zoom]);
  return null;
}

export default function MapView({ lat, lon, zoom, label }: Props) {
  return (
    <MapContainer
      center={[lat, lon]}
      zoom={zoom}
      style={{ width: "100%", height: "100%" }}
      scrollWheelZoom
    >
      <TileLayer
        attribution="&copy; OpenStreetMap"
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />
      <FlyTo lat={lat} lon={lon} zoom={zoom} />
      <Marker position={[lat, lon]}>
        <Popup>{label ?? `${lat.toFixed(4)}, ${lon.toFixed(4)}`}</Popup>
      </Marker>
    </MapContainer>
  );
}