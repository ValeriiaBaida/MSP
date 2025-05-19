// UserProvider.tsx

import React, { createContext, useContext, useState, ReactNode } from 'react';
import * as authClient from '../api/authClient';
import * as preferencesClient from '../api/preferencesClient';
import * as bookmarksClient from '../api/bookmarksClient';

interface User {
  email: string;
  password: string;
  preferences: Record<string, string>;
  bookmarks: Record<string, { lat: number; lon: number; name: string }>;
}

interface UserContextType {
  isLoggedIn: boolean;
  userData: User | null;
  login: (email: string, password: string) => Promise<void>;
  register: (email: string, password: string) => Promise<void>;
  logout: () => void;
  updatePreference: (setting: string, value: string) => void;
  updateBookmark: (bookmarkName: string, bookmarkValue: { lat: number; lon: number; name: string }) => void;
}

const UserContext = createContext<UserContextType | undefined>(undefined);

export const UserProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userData, setUserData] = useState<User | null>(null);

  const login = async (email: string, password: string) => {
  try {
    const user = await authClient.login(email, password);
    const parsedBookmarks = user.bookmarks
      ? Object.fromEntries(
          Object.entries(user.bookmarks).map(([key, value]) => [key, JSON.parse(value)])
        )
      : {};

    setUserData({
      email,
      password,
      preferences: user.preferences || {},
      bookmarks: parsedBookmarks,
    });
    setIsLoggedIn(true);
  } catch (error) {
    console.error('Login failed:', error);
    throw error;
  }
};

  const register = async (email: string, password: string) => {
  try {
    const user = await authClient.register(email, password);
    const parsedBookmarks = user.bookmarks
    ? Object.fromEntries(
        Object.entries(user.bookmarks).map(([key, value]) => [
          key,
          typeof value === 'string' ? JSON.parse(value) : value,
        ])
      )
    : {};

    setUserData({
      email,
      password,
      preferences: user.preferences || {},
      bookmarks: parsedBookmarks,
    });
    setIsLoggedIn(true);
  } catch (error) {
    console.error('Registration failed:', error);
    throw error;
  }
};

  const updatePreference = async (setting: string, value: string) => {
    if (!userData) return;
    try {
      await preferencesClient.savePreference(userData.email, setting, value);
      setUserData((prev) => {
        if (!prev) return null;
        return {
          ...prev,
          preferences: {
            ...prev.preferences,
            [setting]: value,
          },
        };
      });
    } catch (err) {
      console.error('Failed to update preference:', err);
    }
  };

  const updateBookmark = async (bookmarkName: string, bookmarkValue: { lat: number; lon: number; name: string }) => {
    if (!userData) return;
    try {
      await bookmarksClient.saveBookmark(userData.email, bookmarkName, bookmarkValue);
      setUserData((prev) => {
        if (!prev) return null;
        return {
          ...prev,
          bookmarks: {
            ...prev.bookmarks,
            [bookmarkName]: bookmarkValue,
          },
        };
      });
    } catch (err) {
      console.error('Failed to update bookmark:', err);
    }
  };

  const logout = () => {
    setIsLoggedIn(false);
    setUserData(null);
  };

  return (
    <UserContext.Provider
      value={{
        isLoggedIn,
        userData,
        login,
        register,
        logout,
        updatePreference,
        updateBookmark,
      }}
    >
      {children}
    </UserContext.Provider>
  );
};

export const useUser = (): UserContextType => {
  const context = useContext(UserContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};