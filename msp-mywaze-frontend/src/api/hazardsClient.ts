const API_BASE = 'http://localhost:3000/api/hazards';

export type HazardEventHandler = (event: MessageEvent) => void;

interface NamedCoordinates {
  lat: number;
  lon: number;
  name: string;
}

export interface HazardEventOptions {
  onMessage?: HazardEventHandler;
  eventHandlers?: Record<string, HazardEventHandler>;
  onError?: (err: Event) => void;
}

export function subscribeToHazardEvents(options: HazardEventOptions = {}): EventSource {
  const source = new EventSource(API_BASE + "/events");

  if (options.onMessage) {
    source.onmessage = options.onMessage;
  }

  if (options.eventHandlers) {
    for (const [eventName, handler] of Object.entries(options.eventHandlers)) {
      source.addEventListener(eventName, handler);
    }
  }

  source.onerror = options.onError || ((err) => {
    console.error('Hazard SSE error:', err);
  });

  return source;
}

export async function broadcastHazard(hazard: NamedCoordinates): Promise<void> {
  const response = await fetch(`${API_BASE}/broadcast`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({ hazard })
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.error || 'Failed to broadcast hazard');
  }
}