import React, { useState, useEffect } from 'react';
import 'leaflet/dist/leaflet.css';
import SearchBar from '../components/Input/SearchBar';
import RouteMap from '../components/Map/RouteMap';
import UserMenu from '../components/Menu/UserMenu';

import random from 'random';

const MapView: React.FC = () => {
  const [currentLocation, setCurrentLocation] = useState<[number, number] | null>(null);
  const [speed, setSpeed] = useState<number | null>(null); // Track speed here
  const [destination, setDestination] = useState('');
  const [submittedDestination, setSubmittedDestination] = useState('');

  const handleSearch = () => {
    if (!currentLocation) {
      alert('Location access is required for routing.');
      return;
    }
    setSubmittedDestination(destination);
  };

  useEffect(() => {
    if (!navigator.geolocation) {
      console.error('Geolocation is not supported by your browser');
      return;
    }

    const watchId = navigator.geolocation.watchPosition(
      (pos) => {
        const coords: [number, number] = [pos.coords.latitude, pos.coords.longitude];
        setCurrentLocation(coords);

        if (pos.coords.speed !== null) {
          setSpeed(pos.coords.speed);
        } else {
          setSpeed(13); // To test on desktop, set speed to just over 50 (m/s)
        }
      },
      (err) => {
        if (err.code !== 2) { // Ignore POSITION_UNAVAILABLE errors
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

      <div style={{ position: 'absolute', top: 10, right: 10, zIndex: 1000 }}>
        <UserMenu />
      </div>

      <RouteMap
        currentLocation={currentLocation}
        destination={submittedDestination}
      />

      {/* Speed display */}
      {speed !== null && (
        <div style={{
          position: 'absolute',
          bottom: 20,
          right: 20,
          backgroundColor: 'white',
          padding: '8px 12px',
          borderRadius: '8px',
          boxShadow: '0 2px 6px rgba(0,0,0,0.3)',
          fontSize: '14px',
          color: speed*3.6 > 50 ? 'red' : '#333',
          zIndex: 1000
        }}
        onClick={() => setSpeed(random.normal(14, 5)())} 
        >
          Speed: {(speed * 3.6).toFixed(1)} km/h
        </div>
      )}
    </div>
  );
};

export default MapView;