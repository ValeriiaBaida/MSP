import React from "react";
import { useUser } from "../../context/UserContext";
import "./RecentDestinationList.css";

interface NamedCoordinates {
  lat: number;
  lon: number;
  name: string;
}

interface RecentDestinationListProps {
  onSelect: (destination: NamedCoordinates) => void;
}

const RecentDestinationList: React.FC<RecentDestinationListProps> = ({
  onSelect,
}) => {
  const { userData } = useUser();
  const recentDestinations = userData?.recentDestinations
    ? Object.entries(userData.recentDestinations)
    : [];

  if (recentDestinations.length === 0) return null;

  const handleSelect = (
    label: string,
    value: { lat: number; lon: number; name: string }
  ) => {
    try {
      const parsed = value;
      if (
        parsed &&
        typeof parsed.lat === "number" &&
        typeof parsed.lon === "number"
      ) {
        const destination: NamedCoordinates = {
          lat: parsed.lat,
          lon: parsed.lon,
          name: parsed.name || label,
        };
        onSelect(destination);
      } else {
        console.warn("Invalid recent destination format:", value);
      }
    } catch (err) {
      console.error("Failed to parse recent destination value:", err);
    }
  };

  return (
    <ul className="recent-destination-list">
      {recentDestinations.map(([label, value]) => (
        <li
          key={label}
          className="recent-destination-item"
          onMouseDown={() => handleSelect(label, value)}
        >
          <img
            src="/time-machine.png"
            alt="Time-Machine"
            className="recent-destination-icon"
          />
          {label}
        </li>
      ))}
    </ul>
  );
};

export default RecentDestinationList;
