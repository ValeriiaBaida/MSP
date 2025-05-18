import React, { createContext, useContext, useState, ReactNode } from 'react';

interface User {
  email: string;
  password: string;
  preferences: Record<string, string>;
  bookmarks: Record<string, string>;
}

interface UserContextType {
  isLoggedIn: boolean;
  userData: User | null;
  login: (email: string, password: string) => Promise<void>;
  register: (email: string, password: string) => Promise<void>;
  logout: () => void;
  updatePreference: (setting: string, value: string) => void;
  updateBookmark: (bookmarkName: string, bookmarkValue: string) => void;
}

const UserContext = createContext<UserContextType | undefined>(undefined);

export const UserProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userData, setUserData] = useState<User | null>(null);

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

      setUserData({
        email,
        password,
        preferences: data.user.preferences || {},
        bookmarks: data.user.bookmarks || {},
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

      setUserData({
        email,
        password,
        preferences: data.user.preferences || {},
        bookmarks: data.user.bookmarks || {},
      });
      setIsLoggedIn(true);
    } catch (error) {
      console.error('Registration failed:', error);
      throw error;
    }
  };

  const updatePreference = (setting: string, value: string) => {
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
  };

  const updateBookmark = (bookmarkName: string, bookmarkValue: string) => {
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
  };

  const logout = () => {
    setIsLoggedIn(false);
    setUserData(null);
  };

  return (
    <UserContext.Provider value={{ isLoggedIn, userData: userData, login, register, logout, updatePreference, updateBookmark }}>
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