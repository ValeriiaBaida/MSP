import React, { useState, useEffect } from 'react';
import 'leaflet/dist/leaflet.css';
import SearchBar from '../components/Input/SearchBar';
import RouteMap from '../components/Map/RouteMap';

const MapView: React.FC = () => {
  const [currentLocation, setCurrentLocation] = useState<[number, number] | null>(null);
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
      },
      (err) => {
        console.error('Error watching location:', err);
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
      <RouteMap
        currentLocation={currentLocation}
        destination={submittedDestination}
      />
    </div>
  );
};

export default MapView;