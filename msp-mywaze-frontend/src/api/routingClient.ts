export interface Coordinate {
  lon: number;
  lat: number;
}

export interface GeoJSONFeatureCollection {
  type: string;
  features: any[];
}

const API_BASE = 'http://localhost:3000/api/routing'; // Adjust as needed

export async function geocodeDestination(destination: string): Promise<any> {
  const url = new URL(`${API_BASE}/geocode`, window.location.origin);
  url.searchParams.append('destination', destination);

  const response = await fetch(url.toString(), {
    method: 'GET',
  });

  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.error || 'Geocoding failed');
  }

  return await response.json();
}

export async function getRoute(start: [number, number], end: [number, number]): Promise<GeoJSONFeatureCollection> {
  const response = await fetch(`${API_BASE}/route`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ start, end }),
  });

  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.error || 'Route calculation failed');
  }

  return await response.json();
}