import { useEffect, useState, useRef } from 'react';
import { setAverageSpeed } from '../api/statisticsClient';
import { useUser } from '../context/UserContext';

export function useAverageSpeed(speed: number | null) {
    const { userData, updateStatistics } = useUser();
    const email = userData?.email;
    const unitType = userData?.preferences?.unit_type;

    const [averageSpeed, setAverageSpeedState] = useState<number>(userData?.statistics?.avg_speed ?? 0);
    const speedHistoryRef = useRef<number[]>([]); // Buffer for recent speed values
    const initializedRef = useRef<boolean>(false);
    const previousUnitTypeRef = useRef<string | undefined>(unitType); // Tracks previous unit type to reset if unit changes

    useEffect(() => {
        if (unitType === 'mph') return;

        // If the unit type changed, reset speed history and flags
        if (previousUnitTypeRef.current !== unitType) {
            speedHistoryRef.current = [];
            initializedRef.current = false;
            previousUnitTypeRef.current = unitType;
        }

        if (speed !== null && speed > 0 && email) {
            const kmh = Math.ceil(speed * 3.6);

            if (!initializedRef.current) {
                initializedRef.current = true;
                speedHistoryRef.current = [kmh];
                setAverageSpeedState(kmh);
                return;
            }

            speedHistoryRef.current.push(kmh);
            const trimmed = speedHistoryRef.current.slice(-2);
            speedHistoryRef.current = trimmed;

            if (trimmed.length >= 2) {
                const avg = trimmed.reduce((a, b) => a + b, 0) / trimmed.length;
                const roundedAvg = parseFloat(avg.toFixed(1));
                setAverageSpeedState(roundedAvg);

                console.log('Saving avgSpeed:', roundedAvg);
                setAverageSpeed(email, roundedAvg).catch(err =>
                    console.error('Failed to save avgSpeed:', err)
                );
                updateStatistics({ avg_speed: roundedAvg });
            }
        }
    }, [speed, unitType]);

    return averageSpeed;
}