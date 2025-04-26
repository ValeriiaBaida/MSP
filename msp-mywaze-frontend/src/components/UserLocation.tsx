import { useEffect, useState } from 'react';
import { useMap, CircleMarker } from 'react-leaflet';
import { LatLngExpression } from 'leaflet';

interface UserLocationProps {
  onLocationFound?: (coords: [number, number]) => void;
}

const UserLocation: React.FC<UserLocationProps> = ({ onLocationFound }) => {
  const map = useMap();
  const [position, setPosition] = useState<LatLngExpression | null>(null);

  useEffect(() => {
    if (!navigator.geolocation) {
      console.error('Geolocation is not supported by your browser');
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (pos) => {
        const coords: [number, number] = [pos.coords.latitude, pos.coords.longitude];
        setPosition(coords);
        onLocationFound?.(coords);
        map.setView(coords, 13);
      },
      (err) => {
        console.error('Error obtaining location:', err);
      }
    );
  }, [map, onLocationFound]);

  return position ? (
    <CircleMarker
      center={position}
      radius={10}
      pathOptions={{
        color: '#ffffff',
        weight: 3,
        fillColor: '#3388ff',
        fillOpacity: 1,
      }}
    />
  ) : null;
};

export default UserLocation;