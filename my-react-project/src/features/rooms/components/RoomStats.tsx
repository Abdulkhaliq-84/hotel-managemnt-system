import React from 'react';
import { useTranslation } from 'react-i18next';
import type { RoomStats as Stats } from '../types/room.types';
import CurrencyDisplay from '../../../components/CurrencyDisplay';
import './RoomStats.css';

interface RoomStatsProps {
  stats: Stats;
}

const RoomStats: React.FC<RoomStatsProps> = ({ stats }) => {
  const { t } = useTranslation();
  return (
    <div className="room-stats">
      <div className="room-stats-grid">
        <div className="room-stat-card">
          <div className="room-stat-icon">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M3 9L12 2L21 9V20C21 20.5304 20.7893 21.0391 20.4142 21.4142C20.0391 21.7893 19.5304 22 19 22H5C4.46957 22 3.96086 21.7893 3.58579 21.4142C3.21071 21.0391 3 20.5304 3 20V9Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              <path d="M9 22V12H15V22" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </div>
          <div className="room-stat-content">
            <div className="room-stat-title">{t('rooms.stats.totalRooms')}</div>
            <div className="room-stat-number stat-number">{stats.total}</div>
            <div className="room-stat-description">{t('rooms.stats.allRegistered')}</div>
          </div>
        </div>

        <div className="room-stat-card">
          <div className="room-stat-icon">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M9 12L11 14L15 10" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              <path d="M21 12C21 16.9706 16.9706 21 12 21C7.02944 21 3 16.9706 3 12C3 7.02944 7.02944 3 12 3C16.9706 3 21 7.02944 21 12Z" stroke="currentColor" strokeWidth="2"/>
            </svg>
          </div>
          <div className="room-stat-content">
            <div className="room-stat-title">{t('rooms.stats.available')}</div>
            <div className="room-stat-number stat-number">{stats.available}</div>
            <div className="room-stat-description">{t('rooms.stats.readyForGuests')}</div>
          </div>
        </div>

        <div className="room-stat-card">
          <div className="room-stat-icon">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M17 21V19C17 17.9391 16.5786 16.9217 15.8284 16.1716C15.0783 15.4214 14.0609 15 13 15H5C3.93913 15 2.92172 15.4214 2.17157 16.1716C1.42143 16.9217 1 17.9391 1 19V21" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              <path d="M9 11C11.2091 11 13 9.20914 13 7C13 4.79086 11.2091 3 9 3C6.79086 3 5 4.79086 5 7C5 9.20914 6.79086 11 9 11Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              <path d="M23 21V19C23 18.1137 22.7315 17.2528 22.2312 16.5083C21.7309 15.7639 21.0219 15.1749 20.1899 14.8124C19.3579 14.4499 18.4351 14.3302 17.5287 14.4695C16.6223 14.6088 15.7657 15.0012 15.0394 15.6094C14.3132 16.2175 13.7438 17.0217 13.386 17.9429C13.0283 18.8641 12.8957 19.8702 13.0023 20.8613C13.1089 21.8524 13.4502 22.7981 13.9977 23.6213C14.5452 24.4446 15.2807 25.1185 16.1361 25.5853C16.9915 26.0521 17.9417 26.2976 18.91 26.2976C19.8783 26.2976 20.8285 26.0521 21.6839 25.5853C22.5393 25.1185 23.2748 24.4446 23.8223 23.6213C24.3698 22.7981 24.7111 21.8524 24.8177 20.8613C24.9243 19.8702 24.7917 18.8641 24.434 17.9429C24.0762 17.0217 23.5068 16.2175 22.7806 15.6094C22.0543 15.0012 21.1977 14.6088 20.2913 14.4695C19.3849 14.3302 18.4621 14.4499 17.6301 14.8124C16.7981 15.1749 16.0891 15.7639 15.5888 16.5083C15.0885 17.2528 14.82 18.1137 14.82 19V21" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </div>
          <div className="room-stat-content">
            <div className="room-stat-title">{t('rooms.stats.occupied')}</div>
            <div className="room-stat-number stat-number">{stats.occupied}</div>
            <div className="room-stat-description">{t('rooms.stats.currentlyOccupied')}</div>
          </div>
        </div>

        <div className="room-stat-card">
          <div className="room-stat-icon">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M12 22C17.5228 22 22 17.5228 22 12C22 6.47715 17.5228 2 12 2C6.47715 2 2 6.47715 2 12C2 17.5228 6.47715 22 12 22Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              <path d="M12 6V12L16 14" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </div>
          <div className="room-stat-content">
            <div className="room-stat-title">{t('rooms.stats.occupancyRate')}</div>
            <div className="room-stat-number stat-number">{stats.occupancyRate}%</div>
            <div className="room-stat-description">{t('rooms.stats.currentOccupancy')}</div>
          </div>
        </div>

        <div className="room-stat-card">
          <div className="room-stat-icon">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M12 1V23" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              <path d="M17 5H9.5C8.57174 5 7.6815 5.36875 7.02513 6.02513C6.36875 6.6815 6 7.57174 6 8.5C6 9.42826 6.36875 10.3185 7.02513 10.9749C7.6815 11.6313 8.57174 12 9.5 12H14.5C15.4283 12 16.3185 12.3687 16.9749 13.0251C17.6313 13.6815 18 14.5717 18 15.5C18 16.4283 17.6313 17.3185 16.9749 17.9749C16.3185 18.6313 15.4283 19 14.5 19H6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </div>
          <div className="room-stat-content">
            <div className="room-stat-title">{t('rooms.stats.averagePrice')}</div>
            <div className="room-stat-number stat-number">
              <CurrencyDisplay amount={stats.averagePrice} size="large" />
            </div>
            <div className="room-stat-description">{t('rooms.stats.perNight')}</div>
          </div>
        </div>

        <div className="room-stat-card">
          <div className="room-stat-icon">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M10.29 3.86L1.82 18A2 2 0 0 0 3.54 21H20.46A2 2 0 0 0 22.18 18L13.71 3.86A2 2 0 0 0 10.29 3.86Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              <path d="M12 9V13" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              <path d="M12 17H12.01" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </div>
          <div className="room-stat-content">
            <div className="room-stat-title">{t('rooms.stats.maintenance')}</div>
            <div className="room-stat-number stat-number">{stats.maintenance}</div>
            <div className="room-stat-description">{t('rooms.stats.underMaintenance')}</div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RoomStats;
