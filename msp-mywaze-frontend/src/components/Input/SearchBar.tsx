import React from 'react';
import './SearchBar.css';

interface SearchBarProps {
  destination: string;
  setDestination: (dest: string) => void;
  onSearch: () => void;
}

const SearchBar: React.FC<SearchBarProps> = ({ destination, setDestination, onSearch }) => {
  return (
    <div className="search-bar-container">
      <input
        type="text"
        placeholder="Enter destination"
        value={destination}
        onChange={(e) => setDestination(e.target.value)}
        onKeyDown={(e) => e.key === 'Enter' && onSearch()}
        className="search-bar-input"
      />
      <button
        onClick={onSearch}
        className="search-bar-button"
      >
        Go
      </button>
    </div>
  );
};

export default SearchBar;