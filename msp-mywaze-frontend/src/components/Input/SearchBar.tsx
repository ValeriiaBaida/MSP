import React, { useState } from "react";
import "./SearchBar.css";
import RecentDestinationList from "../RecentDestinationsList/RecentDestinationList";

interface NamedCoordinates {
  lat: number;
  lon: number;
  name: string;
}

interface SearchBarProps {
  destination: string;
  setDestination: (dest: string) => void;
  onSearch: () => void;
  onRecentDestinationSelect: (destination: NamedCoordinates) => void;
}

const SearchBar: React.FC<SearchBarProps> = ({
  destination,
  setDestination,
  onSearch,
  onRecentDestinationSelect,
}) => {
  const [showRecentDestinations, setShowRecentDestinations] = useState(false);

  return (
    <div className="search-bar-wrapper">
      <div className="search-bar-container">
        <input
          type="text"
          placeholder="Enter destination"
          value={destination}
          onFocus={() => setShowRecentDestinations(true)}
          onBlur={() => {
            setTimeout(() => setShowRecentDestinations(false), 10);
          }}
          onChange={(e) => setDestination(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              onSearch();
              setShowRecentDestinations(false);
            }
          }}
          className="search-bar-input"
        />
        <button
          onClick={() => {
            onSearch();
            setShowRecentDestinations(false);
          }}
          className="search-bar-button"
        >
          Go
        </button>
      </div>

      {showRecentDestinations && (
        <div className="dropdown-container">
          <RecentDestinationList onSelect={onRecentDestinationSelect} />
        </div>
      )}
    </div>
  );
};

export default SearchBar;
