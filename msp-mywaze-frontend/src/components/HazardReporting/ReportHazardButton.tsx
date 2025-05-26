import React from 'react';
import './ReportHazardButton.css';
import { broadcastHazard } from '../../api/hazardsClient';

interface ReportHazardButtonProps {
  location: [number, number] | null;
}

const ReportHazardButton: React.FC<ReportHazardButtonProps> = ({ location }) => {
  const handleClick = async () => {
    if (!location) {
      alert('Location not available');
      return;
    }

    try {
      await broadcastHazard({
        lat: location[0],
        lon: location[1],
        name: 'Hazard',
      });
      //alert('Hazard reported');
    } catch (err) {
      console.error('Failed to broadcast hazard:', err);
      alert('Failed to report hazard');
    }
  };

  return (
    <div className="hazard-button-container" onClick={handleClick}>
      <div className="hazard-button">
        <img src="/hazard.png" alt="Hazard" className="hazard-icon" />
        <span className="hazard-label">Report</span>
      </div>
    </div>
  );
};

export default ReportHazardButton;