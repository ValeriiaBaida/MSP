import React, { useState, useRef, useEffect } from 'react';
import './ReportHazardButton.css';
import { broadcastHazard } from '../../api/hazardsClient';

interface ReportHazardButtonProps {
  location: [number, number] | null;
}

const hazardTypes: { label: string; type: string; icon: string }[] = [
  { label: 'Accident', type: 'Accident', icon: '/hazards/accident.png' },
  { label: 'Construction', type: 'Construction', icon: '/hazards/construction.png' },
  { label: 'Police', type: 'Police', icon: '/hazards/police.png' },
];

const ReportHazardButton: React.FC<ReportHazardButtonProps> = ({ location }) => {
  const [menuOpen, setMenuOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  const handleReportClick = () => {
    if (!location) {
      alert('Location not available');
      return;
    }
    setMenuOpen(prev => !prev);
  };

  const handleHazardSelect = async (type: string) => {
    if (!location) return;
    try {
      await broadcastHazard({
        lat: location[0],
        lon: location[1],
        name: type,
      });
    } catch (err) {
      console.error('Failed to broadcast hazard:', err);
      alert('Failed to report hazard');
    } finally {
      setMenuOpen(false);
    }
  };

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setMenuOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  return (
    <div className="hazard-button-wrapper" ref={menuRef}>
      <div className="hazard-button-container" onClick={handleReportClick}>
        <div className="hazard-button">
          <img src="/hazards/generic.png" alt="Hazard" className="hazard-icon" />
          <span className="hazard-label">Report</span>
        </div>
      </div>

      {menuOpen && (
        <div className="hazard-selection-menu">
          {hazardTypes.map(({ label, type, icon }) => (
            <button
              key={type}
              className="hazard-option-button"
              onClick={() => handleHazardSelect(type)}
            >
              <img src={icon} alt={label} className="hazard-option-icon" />
              <span className="hazard-option-label">{label}</span>
            </button>
          ))}
        </div>
      )}
    </div>
  );
};

export default ReportHazardButton;