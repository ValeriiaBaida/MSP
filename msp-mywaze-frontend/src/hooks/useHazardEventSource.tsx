import { useEffect, useState, useRef } from 'react';
import { subscribeToHazardEvents, HazardEventOptions } from '../api/hazardsClient';

interface NamedCoordinates {
  lat: number;
  lon: number;
  name: string;
}

export function useHazardEventSource(options: Omit<HazardEventOptions, 'onMessage'> = {}) {
  const [messages, setMessages] = useState<NamedCoordinates[]>([]);
  const sourceRef = useRef<EventSource | null>(null);

  useEffect(() => {
    const source = subscribeToHazardEvents({
      ...options,
      onMessage: (event) => {
        try {
          const data = JSON.parse(event.data) as NamedCoordinates;
          setMessages((prev) => [...prev, data]);
        } catch (e) {
          console.error('Invalid hazard event data:', e);
        }
      }
    });

    sourceRef.current = source;

    return () => {
      source.close();
      sourceRef.current = null;
    };
  }, [options]);

  return messages;
}