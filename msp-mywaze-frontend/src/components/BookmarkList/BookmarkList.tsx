import React from 'react';
import { useUser } from '../../context/UserContext';
import './BookmarkList.css';

interface NamedCoordinates {
  lat: number;
  lon: number;
  name: string;
}

interface BookmarkListProps {
  onSelect: (destination: NamedCoordinates) => void;
}

const BookmarkList: React.FC<BookmarkListProps> = ({ onSelect }) => {
  const { userData } = useUser();
  const bookmarks = userData?.bookmarks ? Object.entries(userData.bookmarks) : [];

  if (bookmarks.length === 0) return null;

  const handleSelect = (label: string, value: { lat: number; lon: number; name: string }) => {
    try {
      const parsed = value;
      if (
        parsed &&
        typeof parsed.lat === 'number' &&
        typeof parsed.lon === 'number'
      ) {
        const destination: NamedCoordinates = {
          lat: parsed.lat,
          lon: parsed.lon,
          name: parsed.name || label,
        };
        onSelect(destination);
      } else {
        console.warn('Invalid bookmark format:', value);
      }
    } catch (err) {
      console.error('Failed to parse bookmark value:', err);
    }
  };

  const renderIcon = (label: string) => {
    if (label === 'Home') return <img src="/home.png" alt="Home" className="bookmark-icon" />;
    if (label === 'Work') return <img src="/work.png" alt="Work" className="bookmark-icon" />;
    return null;
  };

  return (
    <div className="bookmarks-container">
      {bookmarks.map(([label, value]) => (
        <div
          key={label}
          className="bookmark-bubble"
          onClick={() => handleSelect(label, value)}
        >
          {renderIcon(label)}
          {label}
        </div>
      ))}
      <div className="bookmark-placeholder"></div>
    </div>
  );
};

export default BookmarkList;