import React, { useEffect, useState } from 'react';
import './VehicleTypeSelector.css';
import { useUser } from '../../context/UserContext';
import { savePreference } from '../../api/preferencesClient';

type VehicleType = 'taxi' | 'car' | 'motorbike';

const VehicleTypeSelector: React.FC = () => {
  const { userData, updatePreference } = useUser();
  const [selected, setSelected] = useState<VehicleType>('car');

  useEffect(() => {
    const initial = (userData?.preferences?.vehicle_type || 'car') as VehicleType;
    setSelected(initial);
  }, [userData]);

  const handleSelect = async (type: VehicleType) => {
    if (!userData?.email) {
      console.error('No user email available');
      return;
    }

    setSelected(type);

    try {
      await savePreference(userData.email, 'vehicle_type', type);
      updatePreference('vehicle_type', type);
      console.log('Vehicle type preference updated to', type);
    } catch (error) {
      console.error('Failed to update vehicle type preference:', error);
    }
  };

  return (
    <>
      <div><b>Set Vehicle Type</b></div>
      <div className="vehicle-selector">
        <div
          className={`vehicle-option ${selected === 'taxi' ? 'selected' : ''}`}
          onClick={() => handleSelect('taxi')}
        >
          <img src="/vehicle_types/taxi.png" alt="Taxi" className="vehicle-icon" />
          <span className="vehicle-label">Taxi</span>
        </div>
        <div
          className={`vehicle-option ${selected === 'car' ? 'selected' : ''}`}
          onClick={() => handleSelect('car')}
        >
          <img src="/vehicle_types/car.png" alt="Car" className="vehicle-icon" />
          <span className="vehicle-label">Car</span>
        </div>
        <div
          className={`vehicle-option ${selected === 'motorbike' ? 'selected' : ''}`}
          onClick={() => handleSelect('motorbike')}
        >
          <img src="/vehicle_types/motorbike.png" alt="Motorbike" className="vehicle-icon" />
          <span className="vehicle-label">Motorbike</span>
        </div>
      </div>
    </>
  );
};

export default VehicleTypeSelector;