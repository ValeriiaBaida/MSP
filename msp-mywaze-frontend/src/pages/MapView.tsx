import React, { useState, useEffect } from 'react';
import 'leaflet/dist/leaflet.css';
import SearchBar from '../components/Input/SearchBar';
import RouteMap from '../components/Map/RouteMap';
import UserMenu from '../components/Menu/UserMenu';
import BookmarkList from '../components/BookmarkList/BookmarkList';
import SpeedDisplay from '../components/SpeedDisplay/SpeedDisplay';

import random from 'random';

interface NamedCoordinates {
  lat: number;
  lon: number;
  name: string;
}

type Destination = string | NamedCoordinates;

const MapView: React.FC = () => {
  const [currentLocation, setCurrentLocation] = useState<[number, number] | null>(null);
  const [speed, setSpeed] = useState<number | null>(null);
  const [speedLimit, setSpeedLimit] = useState<number | null>(null);
  const [destination, setDestination] = useState('');
  const [submittedDestination, setSubmittedDestination] = useState<Destination>('');

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

  useEffect(() => {
    if (!navigator.geolocation) {
      console.error('Geolocation is not supported by your browser');
      return;
    }

    const watchId = navigator.geolocation.watchPosition(
      async (pos) => {
        const coords: [number, number] = [pos.coords.latitude, pos.coords.longitude];
        setCurrentLocation(coords);

        setSpeed(pos.coords.speed !== null ? pos.coords.speed : 13);

        try {
          const response = await fetch(
            `http://localhost:3000/api/speedlimit/get?lat=${coords[0]}&lon=${coords[1]}`,
            {
              method: 'GET',
              headers: {
                'Content-Type': 'application/json',
              },
            }
          );

          if (!response.ok) {
            throw new Error('Failed to fetch speed limit');
          }

          const data = await response.json();
          setSpeedLimit(parseInt(data.speedLimit) ?? null);
        } catch (error) {
          console.error('Error retrieving speed limit:', error);
          setSpeedLimit(null);
        }
      },
      (err) => {
        if (err.code !== 2) {
          console.error('Error watching location:', err);
        }
      },
      {
        enableHighAccuracy: true,
        maximumAge: 5000,
        timeout: 10000,
      }
    );

    return () => {
      navigator.geolocation.clearWatch(watchId);
    };
  }, []);


  return (
    <div style={{ height: '100vh', width: '100vw', position: 'relative' }}>
      <SearchBar
        onSearch={handleSearch}
        setDestination={setDestination}
        destination={destination}
      />

      <BookmarkList onSelect={handleBookmarkSelect} />

      <div style={{ position: 'absolute', top: 10, right: 10, zIndex: 1000 }}>
        <UserMenu />
      </div>

      <RouteMap
        currentLocation={currentLocation}
        destination={submittedDestination}
      />

      {speed !== null && (
        <SpeedDisplay speed={speed} speedLimit={speedLimit ?? undefined} onClick={() => setSpeed(random.normal(14, 5)())} />
      )}
    </div>
  );
};

export default MapView;