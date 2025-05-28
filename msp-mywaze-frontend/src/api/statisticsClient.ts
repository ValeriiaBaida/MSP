const API_BASE = 'http://localhost:3000/api/statistics';
export interface UserStatistics {
    avg_speed: number;
    active_days: number;
    last_active_date: string;
}

export async function setAverageSpeed(email: string, avgSpeed: number): Promise<void> {
    const response = await fetch(`${API_BASE}/set`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, avgSpeed }),
    });

    if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || 'Failed to update average speed');
    }
}

export async function markActiveDay(email: string): Promise<void> {
    const response = await fetch(`${API_BASE}/mark-active`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
    });

    if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || 'Failed to mark active day');
    }
}
