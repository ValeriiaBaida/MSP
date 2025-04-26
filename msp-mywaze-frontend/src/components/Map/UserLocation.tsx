import React, { useEffect, useRef } from 'react';
import { CircleMarker, useMap } from 'react-leaflet';
import { LatLngExpression } from 'leaflet';
import './UserLocation.css';

interface UserLocationProps {
  currentLocation: LatLngExpression;
}

const UserLocation: React.FC<UserLocationProps> = ({ currentLocation }) => {
  const map = useMap();
  const hasCenteredRef = useRef(false); // track initial centering

  useEffect(() => {
    if (!hasCenteredRef.current) {
      map.setView(currentLocation, 15, { animate: true, duration: 0.5 });
      hasCenteredRef.current = true;
    }
  }, [currentLocation, map]);

  return (
    <CircleMarker
      center={currentLocation}
      radius={10}
      className="user-location"
    />
  );
};

export default UserLocation;