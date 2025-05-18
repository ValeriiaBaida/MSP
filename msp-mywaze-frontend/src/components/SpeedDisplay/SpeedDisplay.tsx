import React, { useEffect, useRef } from 'react';
import './SpeedDisplay.css';

interface SpeedDisplayProps {
  speed: number;
  speedLimit?: number;
  onClick?: () => void;
}

const SpeedDisplay: React.FC<SpeedDisplayProps> = ({ speed, speedLimit, onClick }) => {
  const kmh = Math.ceil(speed * 3.6);
  const limit = speedLimit ? Math.ceil(speedLimit) : null;
  const isOverLimit = limit !== null && kmh > limit;

  const wasOverLimitRef = useRef(false);

  useEffect(() => {
    if (isOverLimit && !wasOverLimitRef.current) {
      const audio = new Audio('/sfx/warning.mp3');
      audio.play().catch((err) => {
        console.error('Failed to play warning sound:', err);
      });
    }
    wasOverLimitRef.current = isOverLimit;
  }, [isOverLimit]);

  return (
    <div className="speed-container">
      {limit !== null && (
        <div className="speed-limit-circle">
          <div className="limit-value">{limit}</div>
          <div className="limit-unit">km/h</div>
        </div>
      )}
      <div
        className={`speed-display${isOverLimit ? ' over-limit' : ''}`}
        onClick={onClick}
      >
        <div className="speed-value">{kmh}</div>
        <div className="speed-unit">km/h</div>
      </div>
    </div>
  );
};

export default SpeedDisplay;