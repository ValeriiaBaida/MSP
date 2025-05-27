import React, { useEffect, useRef, useState } from 'react';
import { MapContainer, TileLayer, Polyline } from 'react-leaflet';
import { Marker as LeafletMarker } from 'leaflet';
import UserLocation from './UserLocation';
import ZoomToRoute from './RouteZoomHandler';
import DestinationMarker from './DestinationMarker';
import BookmarkModal from './BookmarkModal';
import { useUser } from '../../context/UserContext';
import { geocodeDestination, getRoute } from '../../api/routingClient';
import './RouteMap.css';
import { Marker, Popup } from 'react-leaflet';
import { useHazardEventSource } from '../../hooks/useHazardEventSource';
import { hazardMarkerIcon } from './Icons';
import HazardMarker from './HazardMarker';

interface NamedCoordinates {
  lat: number;
  lon: number;
  name: string;
}

type Destination = string | NamedCoordinates;

interface RouteMapProps {
  currentLocation: [number, number] | null;
  destination: Destination;
}

const isNamedCoordinates = (value: Destination): value is NamedCoordinates => {
  return (
    typeof value === 'object' &&
    value !== null &&
    typeof (value as any).lat === 'number' &&
    typeof (value as any).lon === 'number' &&
    typeof (value as any).name === 'string'
  );
};

const RouteMap: React.FC<RouteMapProps> = ({ currentLocation, destination }) => {
  const [route, setRoute] = useState<[number, number][]>([]);
  const [destinationCoords, setDestinationCoords] = useState<[number, number] | null>(null);
  const [destinationNameDisplay, setDestinationNameDisplay] = useState<string | null>(null);
  const [eta, setEta] = useState<string | null>(null);
  const [modalOpen, setModalOpen] = useState(false);
  const { userData, updateBookmark } = useUser();

  const destinationMarkerRef = useRef<LeafletMarker | null>(null);

  const hazards = useHazardEventSource();

  useEffect(() => {
    const resolveDestination = async () => {
      if (!destination) return;

      if (isNamedCoordinates(destination)) {
        setDestinationCoords([destination.lat, destination.lon]);
        setDestinationNameDisplay(destination.name);
        return;
      }

      try {
        const geocodeData = await geocodeDestination(destination);

        if (!geocodeData.features || geocodeData.features.length === 0) {
          console.error('No geocoding results found.');
          return;
        }

        const [lon, lat] = geocodeData.features[0].geometry.coordinates;
        const name = geocodeData.features[0].properties.name;

        setDestinationCoords([lat, lon]);
        setDestinationNameDisplay(name);
      } catch (error) {
        console.error('Error resolving destination:', error);
      }
    };

    resolveDestination();
  }, [destination]);

  useEffect(() => {
    const fetchRoute = async () => {
      if (!currentLocation || !destinationCoords) return;

      try {
        const routeData = await getRoute(
          [currentLocation[1], currentLocation[0]],
          [destinationCoords[1], destinationCoords[0]]
        );

        if (!routeData.features || routeData.features.length === 0) {
          console.error('No route data found.');
          return;
        }

        const coords = routeData.features[0].geometry.coordinates.map(
          (c: number[]) => [c[1], c[0]]
        );
        setRoute(coords);

        const durationSeconds = routeData.features[0].properties.summary.duration;
        const durationMinutes = Math.round(durationSeconds / 60);
        const arrivalTime = new Date(Date.now() + durationSeconds * 1000);
        const hours = arrivalTime.getHours().toString().padStart(2, '0');
        const minutes = arrivalTime.getMinutes().toString().padStart(2, '0');
        setEta(`${hours}:${minutes} (${durationMinutes} min)`);
      } catch (error) {
        console.error('Error fetching route:', error);
      }
    };

    fetchRoute();
  }, [currentLocation, destinationCoords]);

  const handleBookmarkSave = async (name: string) => {
    if (!destinationCoords || !userData) return;

    const bookmarkValue = {
      lat: destinationCoords[0],
      lon: destinationCoords[1],
      name: name || destinationNameDisplay || 'No Name',
    };

    try {
      await updateBookmark(name, bookmarkValue);
      console.log(`Saved bookmark '${name}' -> ${JSON.stringify(bookmarkValue)} for user ${userData.email}`);
    } catch (error) {
      console.error('Error saving bookmark:', error);
    }
  };

  return (
    <>
      <MapContainer
        center={currentLocation || [38.7169, -9.1399]}
        zoom={13}
        className="map-container"
        zoomAnimation
        fadeAnimation={false}
        zoomSnap={0}
        wheelPxPerZoomLevel={60}
      >
        <TileLayer
          attribution="&copy; OpenStreetMap contributors | Icons by <a href='https://icons8.com' target='_BLANK'>icons8</a>"
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />

        {route.length > 0 && (
          <>
            <Polyline positions={route} color="blue" />
            <ZoomToRoute route={route} />
          </>
        )}

        {hazards.map((hazard, index) => (
          <HazardMarker key={index} lat={hazard.lat} lon={hazard.lon} name={hazard.name} />
        ))}

        {destinationCoords && destinationNameDisplay && (
          <DestinationMarker
            coords={destinationCoords}
            name={destinationNameDisplay}
            eta={eta}
            onBookmarkClick={() => setModalOpen(true)}
            markerRef={destinationMarkerRef}
          />
        )}

        {currentLocation && <UserLocation currentLocation={currentLocation} />}
      </MapContainer>

      <BookmarkModal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        onSave={handleBookmarkSave}
        destination={destinationCoords}
        destinationName={destinationNameDisplay}
      />
    </>
  );
};

export default RouteMap;