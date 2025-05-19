import { useEffect, useState } from 'react';
import { getSpeedLimit } from '../api/speedlimitClient';

// this hook provides the current location and speed of the user and fetches the speed limit from the backend
export function useLiveLocation() {
  const [location, setLocation] = useState<[number, number] | null>(null);
  const [speed, setSpeed] = useState<number | null>(null);
  const [speedLimit, setSpeedLimit] = useState<number | null>(null);

  useEffect(() => {
    if (!navigator.geolocation) {
      console.error('Geolocation is not supported by your browser');
      return;
    }

    const watchId = navigator.geolocation.watchPosition(
      async (pos) => {
        const coords: [number, number] = [pos.coords.latitude, pos.coords.longitude];
        setLocation(coords);
        setSpeed(pos.coords.speed !== null ? pos.coords.speed : 13); // Default speed 13 is only for the prototype

        try {
          const data = await getSpeedLimit(coords[0], coords[1]);
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

  return { location, speed, speedLimit, setSpeed }; // setSpeed is only exposed to allow for the random speed in the prototype (see MapView)
}