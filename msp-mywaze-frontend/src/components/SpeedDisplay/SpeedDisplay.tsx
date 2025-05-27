import React, { useEffect, useRef } from 'react';
import './SpeedDisplay.css';

interface SpeedDisplayProps {
  speed: number; // Already converted to correct unit (e.g., km/h or mph)
  speedLimit?: number; // In m/s, will be converted internally
  unit: 'km/h' | 'mph';
  onClick?: () => void;
}

const SpeedDisplay: React.FC<SpeedDisplayProps> = ({ speed, speedLimit, unit, onClick }) => {
  const displaySpeed = Math.ceil(speed);

  const limit = speedLimit
    ? Math.ceil(unit === 'km/h' ? speedLimit : speedLimit * 0.62)
    : null;

  const isOverLimit = limit !== null && displaySpeed > limit;
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
          <div className="limit-unit">{unit}</div>
        </div>
      )}
      <div
        className={`speed-display${isOverLimit ? ' over-limit' : ''}`}
        onClick={onClick}
      >
        <div className="speed-value">{displaySpeed}</div>
        <div className="speed-unit">{unit}</div>
      </div>
    </div>
  );
};

export default SpeedDisplay;
