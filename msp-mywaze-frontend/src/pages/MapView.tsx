import React, { useState } from 'react';
import 'leaflet/dist/leaflet.css';
import './mapView.css';

import SearchBar from '../components/Input/SearchBar';
import RouteMap from '../components/Map/RouteMap';
import UserMenu from '../components/Menu/UserMenu';
import BookmarkList from '../components/BookmarkList/BookmarkList';
import SpeedDisplay from '../components/SpeedDisplay/SpeedDisplay';

import { useLiveLocation } from '../hooks/useLiveLocation';
import { useUser } from '../context/UserContext';

import random from 'random'; // Debugging tool

interface NamedCoordinates {
  lat: number;
  lon: number;
  name: string;
}

type Destination = string | NamedCoordinates;

const MapView: React.FC = () => {
  const { location: currentLocation, speed, speedLimit, setSpeed } = useLiveLocation();
  const { userData } = useUser(); // Get unit preference from context
  const [destination, setDestination] = useState('');
  const [overrideSpeed, setOverrideSpeed] = useState<number | null>(null);
  const [submittedDestination, setSubmittedDestination] = useState<Destination>('');

  const unit: 'km/h' | 'mph' =
    userData?.preferences?.unit_type === 'mph' ? 'mph' : 'km/h';

  const handleSearch = () => {
    if (!currentLocation) {
      alert('Location access is required for routing.');
      return;
    }
    setSubmittedDestination(destination);
  };

  const handleBookmarkSelect = (destinationObj: NamedCoordinates) => {
    setSubmittedDestination(destinationObj);
  };

  const rawSpeed = overrideSpeed !== null ? overrideSpeed : speed;

  const convertedSpeed = rawSpeed !== null
    ? unit === 'km/h'
      ? rawSpeed * 3.6
      : rawSpeed * 2.23694
    : null;

  return (
    <div className="map-view">
      <SearchBar
        onSearch={handleSearch}
        setDestination={setDestination}
        destination={destination}
      />

      <BookmarkList onSelect={handleBookmarkSelect} />

      <UserMenu />

      <RouteMap
        currentLocation={currentLocation}
        destination={submittedDestination}
      />

      {convertedSpeed !== null && (
        <SpeedDisplay
          speed={convertedSpeed}
          speedLimit={speedLimit ?? undefined}
          unit={unit}
          onClick={() => setOverrideSpeed(random.normal(14, 5)())}
        />
      )}
    </div>
  );
};

export default MapView;
