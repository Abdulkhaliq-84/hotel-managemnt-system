import React from 'react';
import { useTranslation } from 'react-i18next';
import CurrencyDisplay from './CurrencyDisplay';
import './PaymentStatusModal.css';

interface PaymentStatusModalProps {
  isOpen: boolean;
  onClose: () => void;
  onUpdate: (paymentStatus: string) => void;
  currentStatus: string;
  reservationId: number;
  totalPrice: number;
}

const PaymentStatusModal: React.FC<PaymentStatusModalProps> = ({
  isOpen,
  onClose,
  onUpdate,
  currentStatus,
  reservationId,
  totalPrice
}) => {
  const { t } = useTranslation();
  
  if (!isOpen) return null;

  const getAvailableStatuses = (currentStatus: string): string[] => {
    switch (currentStatus) {
      case 'Pending':
        return ['Paid', 'Failed'];
      case 'Paid':
        return ['Refunded'];
      case 'Failed':
        return ['Pending', 'Paid'];
      case 'Refunded':
        return []; // Cannot change from refunded
      default:
        return ['Paid', 'Failed'];
    }
  };

  const getStatusColor = (status: string): string => {
    switch (status) {
      case 'Pending': return '#f59e0b'; // amber
      case 'Paid': return '#10b981'; // emerald
      case 'Failed': return '#ef4444'; // red
      case 'Refunded': return '#6b7280'; // gray
      default: return '#6b7280';
    }
  };

  const getStatusIcon = (status: string): string => {
    switch (status) {
      case 'Pending': return '⏳';
      case 'Paid': return '✅';
      case 'Failed': return '❌';
      case 'Refunded': return '↩️';
      default: return '❓';
    }
  };
  
  const getStatusLabel = (status: string): string => {
    switch (status) {
      case 'Pending': return t('reservations.pending');
      case 'Paid': return t('reservations.paid');
      case 'Failed': return t('payment.failed');
      case 'Refunded': return t('reservations.refunded');
      default: return status;
    }
  };
  
  const getStatusDescription = (status: string): string => {
    switch (status) {
      case 'Pending': return t('payment.statusDescriptions.pending');
      case 'Paid': return t('payment.statusDescriptions.paid');
      case 'Failed': return t('payment.statusDescriptions.failed');
      case 'Refunded': return t('payment.statusDescriptions.refunded');
      default: return t('payment.statusDescriptions.unknown');
    }
  };

  const availableStatuses = getAvailableStatuses(currentStatus);

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="payment-modal" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h2>💳 {t('payment.updateStatus')}</h2>
          <button className="close-button" onClick={onClose}>×</button>
        </div>

        <div className="modal-content">
          <div className="payment-info">
            <p><strong>{t('reservations.reservationId')}:</strong> #{reservationId}</p>
            <p><strong>{t('reservations.totalAmount')}:</strong> <CurrencyDisplay amount={totalPrice} /></p>
            <div className="current-status">
              <span className="status-label">{t('payment.currentStatus')}:</span>
              <span 
                className="status-badge"
                style={{ backgroundColor: getStatusColor(currentStatus) }}
              >
                {getStatusIcon(currentStatus)} {getStatusLabel(currentStatus)}
              </span>
            </div>
          </div>

          {availableStatuses.length > 0 ? (
            <div className="status-options">
              <h3>{t('payment.selectNewStatus')}:</h3>
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
              <p>⚠️ {t('payment.noStatusChanges', { status: getStatusLabel(currentStatus) })}</p>
              <p>{t('payment.cannotModifyRefunded')}</p>
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

export default PaymentStatusModal;
