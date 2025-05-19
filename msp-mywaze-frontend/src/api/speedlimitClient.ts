const API_BASE = 'http://localhost:3000/api/speedlimit'; // Adjust if needed

export interface SpeedLimitResponse {
  speedLimit: string;
}

export async function getSpeedLimit(lat: number, lon: number): Promise<SpeedLimitResponse> {
  const url = new URL(`${API_BASE}/get`, window.location.origin);
  url.searchParams.append('lat', lat.toString());
  url.searchParams.append('lon', lon.toString());

  const response = await fetch(url.toString(), {
    method: 'GET',
  });

  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.error || 'Failed to retrieve speed limit');
  }

  return await response.json();
}