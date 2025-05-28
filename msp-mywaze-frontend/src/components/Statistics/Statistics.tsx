import React, { useState } from 'react';
import './Statistics.css';
import { useUser } from '../../context/UserContext';

const Statistics: React.FC = () => {
    const DISTANCE_PER_DAY = 2.4;
    const { userData } = useUser();
    const stats = userData?.statistics ?? null;
    const unit = userData?.preferences?.unit_type ?? 'km/h';

    const [showDrivingStats, setShowDrivingStats] = useState(false);
    const [showActivityStats, setShowActivityStats] = useState(false);

    return (
        <div className="statistics-buttons">
            <p className="menu-label">User Statistics</p>
            <div className="button-group">

                {/* Driving Metrics */}
                <div className={`stat-button wide driving ${showDrivingStats ? 'active' : ''}`}
                     onClick={() => setShowDrivingStats(!showDrivingStats)}>
                    <img src="/car-stat.png" alt="Car" className="stat-icon" />
                    Driving Metrics
                </div>

                {showDrivingStats && (
                    unit === 'km/h' && stats ? (
                        <div className="stat-box-group">
                            <div className="stat-box">
                                <span>Average Speed</span>
                                <strong>{stats.avg_speed.toFixed(1)} km/h</strong>
                            </div>
                            <div className="stat-box">
                                <span>Distance / Day</span>
                                <strong>{DISTANCE_PER_DAY.toFixed(1)} km</strong>
                            </div>
                        </div>
                    ) : (
                        <div className="stat-box">
                            <strong>Sorry, statistics are only available in km/h units </strong>
                        </div>
                    )
                )}

                {/* Activity Metrics */}
                <div className={`stat-button wide activity ${showActivityStats ? 'active' : ''}`}
                     onClick={() => setShowActivityStats(!showActivityStats)}>
                    <img src="/activity-stat.png" alt="Activity" className="stat-icon" />
                    Activity Metrics
                </div>

                {stats && showActivityStats && (
                    <div className="stat-box-group">
                        <div className="stat-box">
                            <span>Active Days</span>
                            <strong>{stats.active_days}</strong>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};


export default Statistics;


