// MapView.tsx
import React, { useState, useRef, useEffect } from 'react';
import { MapContainer, TileLayer, Polyline, Marker, Popup, useMap } from 'react-leaflet';
import { Marker as LeafletMarker, LatLngBounds } from 'leaflet';
import 'leaflet/dist/leaflet.css';
import UserLocation from './components/UserLocation'; // Adjust the path as necessary
import { Icon } from 'leaflet';

const customMarkerIcon = new Icon({
  iconUrl: '/map-marker.webp', // relative to public/
  iconSize: [32, 32], // adjust size if needed
  iconAnchor: [16, 32], // point of the icon which corresponds to marker's location (middle bottom)
  popupAnchor: [0, -32], // point from which the popup should open relative to the iconAnchor
});

// Component to control zoom-to-route
const ZoomToRoute: React.FC<{ route: [number, number][] }> = ({ route }) => {
  const map = useMap();

  useEffect(() => {
    if (route.length > 0) {
      const bounds = new LatLngBounds(route);
      map.flyToBounds(bounds.pad(0.2), { animate: true, duration: 0.5 }); 
      // pad(0.2) means 20% wider bounds (zoom out a little bit)
    }
  }, [route, map]);

  return null;
};

const MapView: React.FC = () => {
  const [currentLocation, setCurrentLocation] = useState<[number, number] | null>(null);
  const [destination, setDestination] = useState('');
  const [route, setRoute] = useState<[number, number][]>([]);
  const [destinationCoords, setDestinationCoords] = useState<[number, number] | null>(null);
  const [destinationNameDisplay, setDestinationNameDisplay] = useState<string | null>(null);
  const destinationMarkerRef = useRef<LeafletMarker | null>(null);

  const handleRoute = async () => {
    if (!currentLocation || !destination) return;

    try {
      // Geocode destination via backend
      const geocodeRes = await fetch(
        `http://localhost:3000/api/routing/geocode?destination=${encodeURIComponent(destination)}`
      );
      const geocodeData = await geocodeRes.json();
      if (!geocodeData.features || geocodeData.features.length === 0) {
        console.error('No geocoding results found.');
        return;
      }
      const [lon, lat] = geocodeData.features[0].geometry.coordinates;
      const destinationName = geocodeData.features[0].properties.name;

      setDestinationCoords([lat, lon]);
      setDestinationNameDisplay(destinationName);

      // Fetch route via backend
      const routeRes = await fetch('http://localhost:3000/api/routing/route', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          start: [currentLocation[1], currentLocation[0]],
          end: [lon, lat],
        }),
      });
      const routeData = await routeRes.json();
      if (!routeData.features || routeData.features.length === 0) {
        console.error('No route data found.');
        return;
      }
      const coords = routeData.features[0].geometry.coordinates.map(
        (c: number[]) => [c[1], c[0]]
      );
      setRoute(coords);
    } catch (error) {
      console.error('Error getting route:', error);
    }
  };

  // Open destination popup automatically when destinationCoords and marker are ready
  /*useEffect(() => {
    if (destinationCoords && destinationMarkerRef.current) {
      destinationMarkerRef.current.openPopup();
    }
  }, [destinationCoords]);*/

  return (
    <div style={{ height: '100vh', width: '100vw', position: 'relative' }}>
      <div style={{
        position: 'absolute',
        top: 10,
        left: '50%',
        transform: 'translateX(-50%)',
        zIndex: 1000,
        display: 'flex',
        gap: '8px',
        backgroundColor: 'white',
        padding: '8px',
        borderRadius: '8px',
        boxShadow: '0 2px 6px rgba(0,0,0,0.3)'
      }}>
        <input
          type="text"
          placeholder="Enter destination"
          value={destination}
          onChange={(e) => setDestination(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && handleRoute()}
          style={{
            padding: '8px',
            borderRadius: '4px',
            border: '1px solid #ccc',
            width: '250px'
          }}
        />
        <button
          onClick={handleRoute}
          style={{
            padding: '8px 16px',
            borderRadius: '4px',
            border: 'none',
            backgroundColor: '#3388ff',
            color: 'white',
            cursor: 'pointer'
          }}
        >
          Go
        </button>
      </div>

      <MapContainer
        center={[38.7169, -9.1399]} // Lisbon coordinates
        zoom={13}
        style={{ height: '100%', width: '100%' }}
        zoomAnimation={true}
        fadeAnimation={false}
        zoomSnap={0}
        wheelPxPerZoomLevel={60}
      >
        <TileLayer
          attribution="&copy; OpenStreetMap contributors"
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          updateWhenIdle={true}
          updateWhenZooming={false}
          keepBuffer={4}
        />
        <UserLocation onLocationFound={setCurrentLocation} />
        
        {route.length > 0 && (
          <>
            <Polyline positions={route} color="blue" />
            <ZoomToRoute route={route} />
          </>
        )}

        {destinationCoords && destinationNameDisplay && (
          <Marker
            position={destinationCoords}
            icon={customMarkerIcon}
            ref={(marker) => {
              if (marker) {
                destinationMarkerRef.current = marker;
                marker.openPopup();
              }
            }}
          >
            <Popup>{destinationNameDisplay}</Popup>
          </Marker>
        )}
      </MapContainer>
    </div>
  );
};

export default MapView;