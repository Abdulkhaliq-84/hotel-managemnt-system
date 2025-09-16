import React from 'react';
import { useTranslation } from 'react-i18next';
import './ReservationStatusModal.css';

interface ReservationStatusModalProps {
  isOpen: boolean;
  onClose: () => void;
  onUpdate: (status: string) => void;
  currentStatus: string;
  reservationId: number;
  guestName: string;
}

const ReservationStatusModal: React.FC<ReservationStatusModalProps> = ({
  isOpen,
  onClose,
  onUpdate,
  currentStatus,
  reservationId,
  guestName
}) => {
  const { t } = useTranslation();
  
  if (!isOpen) return null;

  const getAvailableStatuses = (currentStatus: string): string[] => {
    switch (currentStatus) {
      case 'Pending':
        return ['Confirmed', 'Cancelled'];
      case 'Confirmed':
        return ['CheckedIn', 'Cancelled'];
      case 'CheckedIn':
        return ['CheckedOut'];
      case 'CheckedOut':
        return []; // Cannot change from checked out
      case 'Cancelled':
        return ['Pending', 'Confirmed']; // Can reactivate cancelled reservations
      default:
        return ['Confirmed', 'Cancelled'];
    }
  };

  const getStatusColor = (status: string): string => {
    switch (status) {
      case 'Pending': return '#f59e0b'; // amber
      case 'Confirmed': return '#3b82f6'; // blue
      case 'CheckedIn': return '#10b981'; // emerald
      case 'CheckedOut': return '#6b7280'; // gray
      case 'Cancelled': return '#ef4444'; // red
      default: return '#6b7280';
    }
  };

  const getStatusIcon = (status: string): string => {
    switch (status) {
      case 'Pending': return '⏳';
      case 'Confirmed': return '✅';
      case 'CheckedIn': return '🏨';
      case 'CheckedOut': return '🚪';
      case 'Cancelled': return '❌';
      default: return '❓';
    }
  };
  
  const getStatusLabel = (status: string): string => {
    switch (status) {
      case 'Pending': return t('reservations.pending');
      case 'Confirmed': return t('reservations.confirmed');
      case 'CheckedIn': return t('reservations.checkedIn');
      case 'CheckedOut': return t('reservations.checkedOut');
      case 'Cancelled': return t('reservations.cancelled');
      default: return status;
    }
  };

  const getStatusDescription = (status: string): string => {
    switch (status) {
      case 'Pending': return t('reservations.statusDescriptions.pending');
      case 'Confirmed': return t('reservations.statusDescriptions.confirmed');
      case 'CheckedIn': return t('reservations.statusDescriptions.checkedIn');
      case 'CheckedOut': return t('reservations.statusDescriptions.checkedOut');
      case 'Cancelled': return t('reservations.statusDescriptions.cancelled');
      default: return t('reservations.statusDescriptions.unknown');
    }
  };

  const availableStatuses = getAvailableStatuses(currentStatus);

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="reservation-status-modal" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h2>🏨 {t('reservations.updateStatus')}</h2>
          <button className="close-button" onClick={onClose}>×</button>
        </div>

        <div className="modal-content">
          <div className="reservation-info">
            <p><strong>{t('reservations.reservationId')}:</strong> #{reservationId}</p>
            <p><strong>{t('reservations.guest')}:</strong> {guestName}</p>
            <div className="current-status">
              <span className="status-label">{t('reservations.currentStatus')}:</span>
              <span 
                className="status-badge"
                style={{ backgroundColor: getStatusColor(currentStatus) }}
              >
                {getStatusIcon(currentStatus)} {getStatusLabel(currentStatus)}
              </span>
            </div>
            <p className="status-description">{getStatusDescription(currentStatus)}</p>
          </div>

          {availableStatuses.length > 0 ? (
            <div className="status-options">
              <h3>{t('reservations.selectNewStatus')}:</h3>
              <div className="status-buttons">
                {availableStatuses.map((status) => (
                  <button
                    key={status}
                    className="status-button"
                    onClick={() => onUpdate(status)}
                    style={{ borderColor: getStatusColor(status) }}
                  >
                    <span className="status-icon">{getStatusIcon(status)}</span>
                    <span className="status-text">{getStatusLabel(status)}</span>
                    <span className="status-desc">{getStatusDescription(status)}</span>
                  </button>
                ))}
              </div>
            </div>
          ) : (
            <div className="no-options">
              <p>✅ {t('reservations.reservationCompleted')}</p>
              <p>{t('reservations.cannotModifyCheckedOut')}</p>
            </div>
          )}

          <div className="modal-footer">
            <button className="cancel-button" onClick={onClose}>
              {t('common.cancel')}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ReservationStatusModal;
