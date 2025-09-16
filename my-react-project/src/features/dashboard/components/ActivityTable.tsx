import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import './ActivityTable.css';
import { apiService } from '../../../services/api';

interface Activity {
  id: number;
  roomNumber: string;
  guestName: string;
  checkIn: string;
  checkOut: string;
  status: 'checked-in' | 'checked-out' | 'pending' | 'maintenance';
}

interface ActivityTableProps {
  className?: string;
}

const ActivityTable: React.FC<ActivityTableProps> = ({ className = '' }) => {
  const { t } = useTranslation();
  const [activities, setActivities] = useState<Activity[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadActivities = async () => {
      try {
        setLoading(true);
        const reservations = await apiService.getReservations();
        
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        const tomorrow = new Date(today);
        tomorrow.setDate(tomorrow.getDate() + 1);

        // Filter reservations for today's activities
        const todayActivities = reservations
          .filter(r => {
            const checkInDate = new Date(r.checkInDate);
            const checkOutDate = new Date(r.checkOutDate);
            return (checkInDate >= today && checkInDate < tomorrow) || 
                   (checkOutDate >= today && checkOutDate < tomorrow);
          })
          .map(r => {
            // Normalize status value
            let normalizedStatus: Activity['status'] = 'pending';
            if (r.status) {
              const statusLower = r.status.toLowerCase();
              if (statusLower.includes('checkedin') || statusLower.includes('checked-in')) {
                normalizedStatus = 'checked-in';
              } else if (statusLower.includes('checkedout') || statusLower.includes('checked-out')) {
                normalizedStatus = 'checked-out';
              } else if (statusLower.includes('maintenance')) {
                normalizedStatus = 'maintenance';
              } else if (statusLower.includes('pending')) {
                normalizedStatus = 'pending';
              }
            }
            
            return {
              id: r.id,
              roomNumber: r.roomNumber || 'N/A',
              guestName: r.guestName || 'Unknown Guest',
              checkIn: new Date(r.checkInDate).toLocaleTimeString('en-US', { 
                hour: 'numeric', 
                minute: '2-digit',
                hour12: true 
              }),
              checkOut: new Date(r.checkOutDate).toLocaleTimeString('en-US', { 
                hour: 'numeric', 
                minute: '2-digit',
                hour12: true 
              }),
              status: normalizedStatus
            };
          });

        setActivities(todayActivities);
      } catch (error) {
        console.error('Error loading activities:', error);
        setActivities([]);
      } finally {
        setLoading(false);
      }
    };

    loadActivities();
  }, []);

  const getStatusBadge = (status: Activity['status']) => {
    // Ensure status is valid
    if (!status) {
      return (
        <span className="status-badge status-default">
          {t('common.unknown')}
        </span>
      );
    }

    const statusConfig: Record<Activity['status'], { label: string; className: string }> = {
      'checked-in': { label: t('dashboard.checkIn'), className: 'status-checked-in' },
      'checked-out': { label: t('dashboard.checkOut'), className: 'status-checked-out' },
      'pending': { label: t('reservations.pending'), className: 'status-pending' },
      'maintenance': { label: t('rooms.maintenance'), className: 'status-maintenance' }
    };

    const config = statusConfig[status] || { label: status, className: 'status-default' };
    return (
      <span className={`status-badge ${config.className}`}>
        {config.label}
      </span>
    );
  };

  if (loading) {
    return (
      <div className={`activity-table-container ${className}`}>
        <h2 className="table-title">{t('dashboard.recentReservations')}</h2>
        <div className="loading-container">
          <div className="loading-spinner"></div>
          <p>{t('common.loading')}</p>
        </div>
      </div>
    );
  }

  return (
    <div className={`activity-table-container ${className}`}>
      <h2 className="table-title">{t('dashboard.recentReservations')}</h2>
      <div className="table-wrapper">
        <table className="activity-table">
          <thead>
            <tr>
              <th>{t('reservations.roomNumber')}</th>
              <th>{t('reservations.guestName')}</th>
              <th>{t('reservations.checkInDate')}</th>
              <th>{t('reservations.checkOutDate')}</th>
              <th>{t('common.status')}</th>
            </tr>
          </thead>
          <tbody>
            {activities.length > 0 ? (
              activities.map((activity) => (
                <tr key={activity.id}>
                  <td className="room-number">{activity.roomNumber}</td>
                  <td className="guest-name">{activity.guestName}</td>
                  <td className="check-in">{activity.checkIn}</td>
                  <td className="check-out">{activity.checkOut}</td>
                  <td className="status-cell">
                    {getStatusBadge(activity.status)}
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={5} className="empty-state">
                  <div className="empty-message">
                    <p>{t('messages.noDataFound')}</p>
                  </div>
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default ActivityTable;
