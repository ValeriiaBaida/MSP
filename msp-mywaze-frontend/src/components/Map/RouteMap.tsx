import React, { useEffect, useRef, useState } from 'react';
import { MapContainer, TileLayer, Polyline, Marker, Popup } from 'react-leaflet';
import { Marker as LeafletMarker } from 'leaflet';
import UserLocation from './UserLocation';
import ZoomToRoute from './RouteZoomHandler';
import { customMarkerIcon } from './Icons';
import './RouteMap.css';

interface RouteMapProps {
  currentLocation: [number, number] | null;
  destination: string;
}

const RouteMap: React.FC<RouteMapProps> = ({ currentLocation, destination }) => {
  const [route, setRoute] = useState<[number, number][]>([]);
  const [destinationCoords, setDestinationCoords] = useState<[number, number] | null>(null);
  const [destinationNameDisplay, setDestinationNameDisplay] = useState<string | null>(null);

  const destinationMarkerRef = useRef<LeafletMarker | null>(null);

  useEffect(() => {
    const fetchRoute = async () => {
      if (!currentLocation || !destination) return;

      try {
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

    fetchRoute();
  //}, [destination, currentLocation]); // This is the better way but I had to remove it to keep api consumption low
  }, [destination]);


  return (
    <MapContainer
        center={currentLocation || [38.7169, -9.1399]} /* Default: Lisbon */
        zoom={13}
        className="map-container"
        zoomAnimation={true}
        fadeAnimation={false}
        zoomSnap={0}
        wheelPxPerZoomLevel={60}
    >
      <TileLayer
        attribution="&copy; OpenStreetMap contributors"
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />

      {currentLocation && (
        <UserLocation currentLocation={currentLocation} />
      )}

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
  );
};

export default RouteMap;