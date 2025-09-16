import React from 'react';
import { useTranslation } from 'react-i18next';
import type { ReservationStats as Stats } from '../types/reservation.types';
import './ReservationStats.css';

interface ReservationStatsProps {
  stats: Stats;
  className?: string;
}

const ReservationStats: React.FC<ReservationStatsProps> = ({ stats, className = '' }) => {
  const { t } = useTranslation();
  return (
    <div className={`reservation-stats ${className}`}>
      <div className="stats-grid">
        {/* Total Reservations */}
        <div className="stat-card">
          <div className="stat-icon">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M8 2V5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              <path d="M16 2V5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              <path d="M3 10H21" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              <rect x="3" y="4" width="18" height="18" rx="2" stroke="currentColor" strokeWidth="2"/>
              <path d="M8 14H16" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              <path d="M8 18H12" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </div>
          <div className="stat-content">
            <h3 className="stat-title">{t('reports.totalBookings')}</h3>
            <p className="stat-number">{stats.total}</p>
            <p className="stat-description">{t('common.all')}</p>
          </div>
        </div>

        {/* Pending */}
        <div className="stat-card">
          <div className="stat-icon">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="2"/>
              <path d="M12 6V12L16 14" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </div>
          <div className="stat-content">
            <h3 className="stat-title">{t('reservations.pending')}</h3>
            <p className="stat-number">{stats.pending}</p>
            <p className="stat-description">{t('reservations.pending')}</p>
          </div>
        </div>

        {/* Confirmed */}
        <div className="stat-card">
          <div className="stat-icon">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M9 12L11 14L15 10" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              <path d="M21 12C21 16.9706 16.9706 21 12 21C7.02944 21 3 16.9706 3 12C3 7.02944 7.02944 3 12 3C16.9706 3 21 7.02944 21 12Z" stroke="currentColor" strokeWidth="2"/>
            </svg>
          </div>
          <div className="stat-content">
            <h3 className="stat-title">{t('reservations.confirmed')}</h3>
            <p className="stat-number">{stats.confirmed}</p>
            <p className="stat-description">{t('reservations.confirmed')}</p>
          </div>
        </div>

        {/* Checked In */}
        <div className="stat-card">
          <div className="stat-icon">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M3 9L12 2L21 9V20C21 20.5304 20.7893 21.0391 20.4142 21.4142C20.0391 21.7893 19.5304 22 19 22H5C4.46957 22 3.96086 21.7893 3.58579 21.4142C3.21071 21.0391 3 20.5304 3 20V9Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              <path d="M9 22V12H15V22" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </div>
          <div className="stat-content">
            <h3 className="stat-title">{t('dashboard.checkIn')}</h3>
            <p className="stat-number">{stats.checkedIn}</p>
            <p className="stat-description">{t('dashboard.todayCheckIns')}</p>
          </div>
        </div>

        {/* Checked Out */}
        <div className="stat-card">
          <div className="stat-icon">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M15 18L9 12L15 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              <path d="M9 12H21" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </div>
          <div className="stat-content">
            <h3 className="stat-title">{t('dashboard.checkOut')}</h3>
            <p className="stat-number">{stats.checkedOut}</p>
            <p className="stat-description">{t('reservations.completed')}</p>
          </div>
        </div>

        {/* Cancelled */}
        <div className="stat-card">
          <div className="stat-icon">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M18 6L6 18" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              <path d="M6 6L18 18" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </div>
          <div className="stat-content">
            <h3 className="stat-title">{t('reservations.cancelled')}</h3>
            <p className="stat-number">{stats.cancelled}</p>
            <p className="stat-description">{t('reservations.cancelled')}</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ReservationStats;
