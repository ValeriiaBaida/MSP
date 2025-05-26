const API_BASE = 'http://localhost:3000/api/recentDestinations'; // Adjust path if needed

export async function saveRecentDestiantion(email: string, destinationName: string, destinationValue: any): Promise<void> {
  const response = await fetch(`${API_BASE}/set`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      email,
      destination_name: destinationName,
      destination_value: destinationValue,
    }),
  });

  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.error || 'Failed to save recent destination');
  }
}