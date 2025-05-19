const API_BASE = 'http://localhost:3000/api/preferences'; // Adjust path if needed

export async function savePreference(email: string, setting: string, value: string): Promise<void> {
  const response = await fetch(`${API_BASE}/set`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      email,
      setting,
      value,
    }),
  });

  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.error || 'Failed to save preference');
  }
}