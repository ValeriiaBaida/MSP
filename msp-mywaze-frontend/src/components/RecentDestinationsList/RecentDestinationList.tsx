import React from "react";
import "./RecentDestinationList.css";

interface RecentDestinationListProps {
  onSelect: (destination: string) => void;
}

const recentDestinations = [
  "Home",
  "Work",
  "Supermarket",
  "Airport",
  "Train Station",
];

const RecentDestinationList: React.FC<RecentDestinationListProps> = ({
  onSelect,
}) => {
  return (
    <ul className="recent-destination-list">
      {recentDestinations.map((dest, index) => (
        <li
          key={index}
          onMouseDown={() => onSelect(dest)}
          className="recent-destination-item"
        >
          {dest}
        </li>
      ))}
    </ul>
  );
};

export default RecentDestinationList;
