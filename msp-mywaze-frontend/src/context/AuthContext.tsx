import React, { createContext, useContext, useState, ReactNode } from 'react';

interface User {
  email: string;
  password: string;
  preferences: Record<string, string>;
}

interface AuthContextType {
  isLoggedIn: boolean;
  credentials: User | null;
  login: (email: string, password: string) => Promise<void>;
  register: (email: string, password: string) => Promise<void>;
  logout: () => void;
  updatePreference: (setting: string, value: string) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [credentials, setCredentials] = useState<User | null>(null);

  const login = async (email: string, password: string) => {
    try {
      const response = await fetch('http://localhost:3000/api/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: 'Basic ' + btoa(email + ':' + password),
        },
        body: JSON.stringify({ email, password }),
      });

      if (!response.ok) {
        throw new Error('Invalid login credentials');
      }

      const data = await response.json();

      setCredentials({
        email,
        password,
        preferences: data.user.preferences || {},
      });
      setIsLoggedIn(true);
    } catch (error) {
      console.error('Login failed:', error);
      throw error;
    }
  };

  const register = async (email: string, password: string) => {
    try {
      const response = await fetch('http://localhost:3000/api/auth/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
      });

      if (!response.ok) {
        throw new Error('Registration failed');
      }

      const data = await response.json();

      setCredentials({
        email,
        password,
        preferences: data.user.preferences || {},
      });
      setIsLoggedIn(true);
    } catch (error) {
      console.error('Registration failed:', error);
      throw error;
    }
  };

  const updatePreference = (setting: string, value: string) => {
    setCredentials((prev) => {
      if (!prev) return null;
      return {
        ...prev,
        preferences: {
          ...prev.preferences,
          [setting]: value,
        },
      };
    });
  };

  const logout = () => {
    setIsLoggedIn(false);
    setCredentials(null);
  };

  return (
    <AuthContext.Provider value={{ isLoggedIn, credentials, login, register, logout, updatePreference }}>
          {children}
    </AuthContext.Provider>
  );
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};