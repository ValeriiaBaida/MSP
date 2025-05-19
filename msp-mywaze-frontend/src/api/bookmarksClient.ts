const API_BASE = 'http://localhost:3000/api/bookmarks'; // Adjust path if needed

export async function saveBookmark(email: string, bookmarkName: string, bookmarkValue: any): Promise<void> {
  const response = await fetch(`${API_BASE}/set`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      email,
      bookmark_name: bookmarkName,
      bookmark_value: bookmarkValue,
    }),
  });

  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.error || 'Failed to save bookmark');
  }
}