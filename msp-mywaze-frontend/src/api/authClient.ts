export interface User {
  email: string;
  preferences: Record<string, string>;
  bookmarks?: Record<string, string>;
  recentDestinations?: Record<string, string>;
}

export interface LoginResponse {
  user: User;
}

export interface RegisterResponse {
  user: User;
}

const API_BASE = 'http://localhost:3000/api/auth'; // Adjust this base path if needed

export async function login(email: string, password: string): Promise<User> {
  const response = await fetch(`${API_BASE}/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, password }),
  });

  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.error || 'Login failed');
  }

  const data: LoginResponse = await response.json();
  return data.user;
}

export async function register(email: string, password: string): Promise<User> {
  const response = await fetch(`${API_BASE}/register`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, password }),
  });

  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.error || 'Registration failed');
  }

  const data: RegisterResponse = await response.json();
  return data.user;
}