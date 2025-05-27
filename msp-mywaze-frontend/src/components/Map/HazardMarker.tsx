import React from 'react';
import { Marker, Popup } from 'react-leaflet';
import L from 'leaflet';

interface HazardMarkerProps {
  lat: number;
  lon: number;
  name: string;
}

const hazardIconMap: Record<string, string> = {
  'Accident': '/hazards/accident.png',
  'Construction': '/hazards/construction.png',
  'Police': '/hazards/police.png',
};

const getHazardIcon = (name: string): L.Icon => {
  const iconUrl = hazardIconMap[name] || '/hazards/generic.png';
  return L.icon({
    iconUrl,
    iconSize: [32, 32],
    iconAnchor: [16, 32],
    popupAnchor: [0, -32],
  });
};

const HazardMarker: React.FC<HazardMarkerProps> = ({ lat, lon, name }) => {
  return (
    <Marker
      position={[lat, lon]}
      icon={getHazardIcon(name)}
    >
      <Popup>{name}</Popup>
    </Marker>
  );
};

export default HazardMarker;