import React from 'react';
import { useTranslation } from 'react-i18next';
import type { Guest } from '../types/guest.types';
import CurrencyDisplay from '../../../components/CurrencyDisplay';
import { formatDate } from '../../../utils/dateUtils';
import './GuestProfile.css';

interface GuestProfileProps {
  guest: Guest;
  onEdit: (guest: Guest) => void;
  onClose: () => void;
  className?: string;
}

interface RecentReservation {
  id: string;
  checkInDate: string;
  checkOutDate: string;
  roomType: string;
  roomNumber: string;
  status: string;
  totalPrice: number;
}

const GuestProfile: React.FC<GuestProfileProps> = ({
  guest,
  onEdit,
  onClose,
  className = ''
}) => {
  const { t, i18n } = useTranslation();
  // Mock recent reservations data - in real app this would come from API
  const recentReservations: RecentReservation[] = [
    {
      id: '1',
      checkInDate: '2024-01-15',
      checkOutDate: '2024-01-18',
      roomType: 'Deluxe',
      roomNumber: '205',
      status: 'Completed',
      totalPrice: 450
    },
    {
      id: '2',
      checkInDate: '2023-12-20',
      checkOutDate: '2023-12-23',
      roomType: 'Suite',
      roomNumber: '301',
      status: 'Completed',
      totalPrice: 600
    },
    {
      id: '3',
      checkInDate: '2023-11-10',
      checkOutDate: '2023-11-12',
      roomType: 'Double',
      roomNumber: '102',
      status: 'Completed',
      totalPrice: 300
    }
  ];

  const formatDateLocal = (dateString: string) => {
    return formatDate(dateString, i18n.language);
  };


  const getStatusBadge = (status: string) => {
    const statusConfig = {
      'Completed': { label: t('reservations.completed'), className: 'status-completed' },
      'Active': { label: t('guests.active'), className: 'status-active' },
      'Cancelled': { label: t('reservations.cancelled'), className: 'status-cancelled' }
    };

    const config = statusConfig[status as keyof typeof statusConfig] || { label: status, className: 'status-default' };
    return (
      <span className={`status-badge ${config.className}`}>
        {config.label}
      </span>
    );
  };

  const getPreferenceIcon = (type: string) => {
    const icons = {
      roomType: (
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M3 9L12 2L21 9V20C21 20.5304 20.7893 21.0391 20.4142 21.4142C20.0391 21.7893 19.5304 22 19 22H5C4.46957 22 3.96086 21.7893 3.58579 21.4142C3.21071 21.0391 3 20.5304 3 20V9Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          <path d="M9 22V12H15V22" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
      ),
      floor: (
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M12 2V6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          <path d="M12 18V22" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          <path d="M4.93 4.93L7.76 7.76" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          <path d="M16.24 16.24L19.07 19.07" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          <path d="M2 12H6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          <path d="M18 12H22" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
      ),
      smoking: (
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M18 8H19A2 2 0 0 1 21 10V12A2 2 0 0 1 19 14H18" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          <path d="M2 8H18V22H2V8Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          <path d="M6 1V8" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          <path d="M10 1V8" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          <path d="M14 1V8" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
      )
    };
    return icons[type as keyof typeof icons] || null;
  };

  return (
    <div className={`guest-profile-container ${className}`}>
      <div className="profile-wrapper">
        <div className="profile-header">
          <h2 className="profile-title">{t('guests.guestProfile')}</h2>
          <button onClick={onClose} className="close-btn">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M18 6L6 18" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              <path d="M6 6L18 18" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </button>
        </div>

        <div className="profile-content">
          {/* Basic Information */}
          <div className="profile-section">
            <h3 className="section-title">{t('guests.basicInfo')}</h3>
            <div className="info-grid">
              <div className="info-item">
                <label className="info-label">{t('guests.fullName')}</label>
                <p className="info-value">{guest.firstName} {guest.lastName}</p>
              </div>
              <div className="info-item">
                <label className="info-label">{t('guests.email')}</label>
                <p className="info-value">{guest.email}</p>
              </div>
              <div className="info-item">
                <label className="info-label">{t('guests.phone')}</label>
                <p className="info-value">{guest.phone}</p>
              </div>
              <div className="info-item">
                <label className="info-label">{t('guests.country')}</label>
                <p className="info-value">{guest.country}</p>
              </div>
              <div className="info-item">
                <label className="info-label">{t('guests.dateOfBirth')}</label>
                <p className="info-value">
                  {guest.dateOfBirth ? formatDateLocal(guest.dateOfBirth) : t('guests.notProvided')}
                </p>
              </div>
              <div className="info-item">
                <label className="info-label">{t('common.status')}</label>
                <div className="status-indicator">
                  <span className={`status-dot ${guest.isActive ? 'active' : 'inactive'}`}></span>
                  <span className="status-text">{guest.isActive ? t('guests.active') : t('guests.inactive')}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Statistics */}
          <div className="profile-section">
            <h3 className="section-title">{t('guests.statistics')}</h3>
            <div className="stats-grid">
              <div className="stat-item">
                <div className="stat-icon">
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M8 2V5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                    <path d="M16 2V5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                    <path d="M3 10H21" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                    <rect x="3" y="4" width="18" height="18" rx="2" stroke="currentColor" strokeWidth="2"/>
                  </svg>
                </div>
                <div className="stat-content">
                  <h4 className="stat-title">{t('guests.totalStays')}</h4>
                  <p className="stat-number">{guest.totalStays}</p>
                </div>
              </div>
              <div className="stat-item">
                <div className="stat-icon">
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M12 2V6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                    <path d="M12 18V22" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                    <path d="M4.93 4.93L7.76 7.76" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                    <path d="M16.24 16.24L19.07 19.07" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                    <path d="M2 12H6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                    <path d="M18 12H22" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                </div>
                <div className="stat-content">
                  <h4 className="stat-title">{t('guests.totalSpent')}</h4>
                  <p className="stat-number"><CurrencyDisplay amount={guest.totalSpent} /></p>
                </div>
              </div>
              <div className="stat-item">
                <div className="stat-icon">
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="2"/>
                    <path d="M12 6V12L16 14" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                </div>
                <div className="stat-content">
                  <h4 className="stat-title">{t('guests.lastVisit')}</h4>
                  <p className="stat-number">{formatDateLocal(guest.lastVisit)}</p>
                </div>
              </div>
            </div>
          </div>

          {/* Preferences */}
          <div className="profile-section">
            <h3 className="section-title">{t('guests.roomPreferences')}</h3>
            <div className="preferences-grid">
              <div className="preference-item">
                <div className="preference-icon">
                  {getPreferenceIcon('roomType')}
                </div>
                <div className="preference-content">
                  <h4 className="preference-title">{t('guests.preferredRoomType')}</h4>
                  <p className="preference-value">{guest.preferences.roomType.charAt(0).toUpperCase() + guest.preferences.roomType.slice(1)}</p>
                </div>
              </div>
              <div className="preference-item">
                <div className="preference-icon">
                  {getPreferenceIcon('floor')}
                </div>
                <div className="preference-content">
                  <h4 className="preference-title">{t('guests.floorPreference')}</h4>
                  <p className="preference-value">{guest.preferences.floor.charAt(0).toUpperCase() + guest.preferences.floor.slice(1)}</p>
                </div>
              </div>
              <div className="preference-item">
                <div className="preference-icon">
                  {getPreferenceIcon('smoking')}
                </div>
                <div className="preference-content">
                  <h4 className="preference-title">{t('guests.smokingPreference')}</h4>
                  <p className="preference-value">{guest.preferences.smoking ? t('guests.smokingRoom') : t('guests.nonSmokingRoom')}</p>
                </div>
              </div>
            </div>

            {guest.preferences.specialRequests.length > 0 && (
              <div className="special-requests-section">
                <h4 className="subsection-title">{t('guests.specialRequests')}</h4>
                <div className="requests-list">
                  {guest.preferences.specialRequests.map((request, index) => (
                    <div key={index} className="request-item">
                      <span className="request-text">{request}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Recent Reservations */}
          <div className="profile-section">
            <h3 className="section-title">{t('guests.recentReservations')}</h3>
            <div className="reservations-table">
              <table>
                <thead>
                  <tr>
                    <th>{t('reservations.checkIn')}</th>
                    <th>{t('reservations.checkOut')}</th>
                    <th>{t('guests.room')}</th>
                    <th>{t('common.status')}</th>
                    <th>{t('guests.total')}</th>
                  </tr>
                </thead>
                <tbody>
                  {recentReservations.map((reservation) => (
                    <tr key={reservation.id}>
                      <td>{formatDateLocal(reservation.checkInDate)}</td>
                      <td>{formatDateLocal(reservation.checkOutDate)}</td>
                      <td>{reservation.roomType} - {reservation.roomNumber}</td>
                      <td>{getStatusBadge(reservation.status)}</td>
                      <td><CurrencyDisplay amount={reservation.totalPrice} /></td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        <div className="profile-actions">
          <button onClick={onClose} className="back-btn">
            {t('guests.backToList')}
          </button>
          <button onClick={() => onEdit(guest)} className="edit-btn">
            {t('guests.editGuest')}
          </button>
        </div>
      </div>
    </div>
  );
};

export default GuestProfile;
