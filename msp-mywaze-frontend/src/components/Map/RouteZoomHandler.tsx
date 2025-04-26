import { useMap } from 'react-leaflet';
import { LatLngBounds } from 'leaflet';
import { useEffect } from 'react';

// Component to control zoom-to-route
const RouteZoomHandler: React.FC<{ route: [number, number][] }> = ({ route }) => {
  const map = useMap();

  useEffect(() => {
    if (route.length > 0) {
      const bounds = new LatLngBounds(route);
      map.flyToBounds(bounds.pad(0.2), { animate: true, duration: 0.5 }); 
      // pad makes bounds wider (map is not edge to edge showing the route)
    }
  }, [route, map]);

  return null;
};

export default RouteZoomHandler;