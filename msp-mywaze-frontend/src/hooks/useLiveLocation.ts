import { useEffect, useRef, useState } from 'react';
import { getSpeedLimit } from '../api/speedlimitClient';

export function useLiveLocation() {
  const [location, setLocation] = useState<[number, number] | null>(null);
  const [speed, setSpeed] = useState<number | null>(null);
  const [speedLimit, setSpeedLimit] = useState<number | null>(null);

  const lastUpdateTimeRef = useRef<number>(0);

  useEffect(() => {
    if (!navigator.geolocation) {
      console.error('Geolocation is not supported by your browser');
      return;
    }

    const watchId = navigator.geolocation.watchPosition(
      async (pos) => {
        const now = Date.now();
        if (now - lastUpdateTimeRef.current < 5000) {
          return; // Skip update if less than 5s since last
        }
        lastUpdateTimeRef.current = now;

        const coords: [number, number] = [pos.coords.latitude, pos.coords.longitude];
        setLocation(coords);
        setSpeed(pos.coords.speed !== null ? pos.coords.speed : 13);

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

  return { location, speed, speedLimit, setSpeed };
}