import { useEffect } from 'react';
import { markActiveDay } from '../api/statisticsClient';
import { useUser } from '../context/UserContext';

export function useMarkActiveDay(email: string | null): void {
    const { updateStatistics, userData } = useUser();

    useEffect(() => {
        if (!email) return;

        const today = new Date().toISOString().split('T')[0];
        const lastActiveKey = `last_active_day_${email}`;
        const lastActive = localStorage.getItem(lastActiveKey);

        if (lastActive === today) {
            return;
        }

        markActiveDay(email)
            .then(() => {
                localStorage.setItem(lastActiveKey, today);
                const prevDays = userData?.statistics?.active_days ?? 0;

                updateStatistics({
                    active_days: prevDays + 1,
                    last_active_date: today
                });
            })
            .catch(err => {
                console.error('Failed to mark active day:', err);
            });
    }, [email]);
}
