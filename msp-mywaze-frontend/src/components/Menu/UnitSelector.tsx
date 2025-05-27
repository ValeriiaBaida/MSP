import React, { useEffect, useState } from 'react';
import './UserSelector.css';
import { useUser } from '../../context/UserContext';
import { savePreference } from '../../api/preferencesClient';

type UnitType = 'km/h' | 'mph';

const UnitSelector: React.FC = () => {
  const { userData, updatePreference } = useUser();
  const [selected, setSelected] = useState<UnitType>('km/h');

  useEffect(() => {
    const initial = (userData?.preferences?.unit_type || 'km/h') as UnitType;
    setSelected(initial);
  }, [userData]);

  const handleSelect = async (type: UnitType) => {
    if (!userData?.email) {
      console.error('No user email available');
      return;
    }

    setSelected(type);

    try {
      await savePreference(userData.email, 'unit_type', type);
      updatePreference('unit_type', type);
      console.log('Unit type preference updated to', type);
    } catch (error) {
      console.error('Failed to update unit type preference:', error);
    }
  };

  return (
    <>
      <div><b>Change Units</b></div>
      <div className="unit-selector">
        <div
          className={`unit-option ${selected === 'km/h' ? 'selected' : ''}`}
          onClick={() => handleSelect('km/h')}
        >
          <span className="unit-label">km/h</span>
        </div>
        <div
          className={`unit-option ${selected === 'mph' ? 'selected' : ''}`}
          onClick={() => handleSelect('mph')}
        >
          <span className="unit-label">mph</span>
        </div>
      </div>
    </>
  );
};

export default UnitSelector;