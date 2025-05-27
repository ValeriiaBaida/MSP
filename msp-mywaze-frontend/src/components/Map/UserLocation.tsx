import React, { useEffect, useRef } from 'react';
import { Marker, useMap } from 'react-leaflet';
import { LatLngExpression, divIcon } from 'leaflet';
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

  // Create a custom icon that looks like a circle
  const userLocationIcon = divIcon({
    className: 'user-location-icon',
    html: '<div class="user-location-circle"></div>',
    iconSize: [20, 20],
    iconAnchor: [10, 10],
  });

  return (
    <Marker
      position={currentLocation}
      icon={userLocationIcon}
      zIndexOffset={1000} // This works with regular Markers
    />
  );
};

export default UserLocation;