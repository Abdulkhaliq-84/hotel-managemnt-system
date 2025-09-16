import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import type { ReservationSummary } from '../types/reservation.types';
import ConfirmDialog from '../../../components/ConfirmDialog';
import PaymentStatusModal from '../../../components/PaymentStatusModal';
import ReservationStatusModal from '../../../components/ReservationStatusModal';
import { CurrencyDisplay } from '../../../utils/currency';
import { formatShortDate } from '../../../utils/dateUtils';
import './ReservationTable.css';

interface ReservationTableProps {
  reservations: ReservationSummary[];
  onEdit: (reservation: ReservationSummary) => void;
  onDelete: (id: number) => void;
  onStatusChange: (id: number, status: ReservationSummary['status']) => void;
  onPaymentStatusChange: (id: number, paymentStatus: string) => void;
  className?: string;
}

const ReservationTable: React.FC<ReservationTableProps> = ({
  reservations,
  onEdit,
  onDelete,
  onStatusChange,
  onPaymentStatusChange,
  className = ''
}) => {
  const { t, i18n } = useTranslation();
  const [showConfirmDialog, setShowConfirmDialog] = useState(false);
  const [reservationToDelete, setReservationToDelete] = useState<ReservationSummary | null>(null);
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [selectedReservation, setSelectedReservation] = useState<ReservationSummary | null>(null);
  const [showStatusModal, setShowStatusModal] = useState(false);
  const [selectedStatusReservation, setSelectedStatusReservation] = useState<ReservationSummary | null>(null);

  const getStatusBadge = (status: ReservationSummary['status']) => {
    const statusConfig = {
      'Pending': { label: t('reservations.pending'), className: 'reservation-pending', icon: '⏳' },
      'Confirmed': { label: t('reservations.confirmed'), className: 'reservation-confirmed', icon: '✅' },
      'CheckedIn': { label: t('dashboard.checkIn'), className: 'reservation-checked-in', icon: '🏨' },
      'CheckedOut': { label: t('dashboard.checkOut'), className: 'reservation-checked-out', icon: '🚪' },
      'Cancelled': { label: t('reservations.cancelled'), className: 'reservation-cancelled', icon: '❌' }
    };
    const config = statusConfig[status] || { 
      label: status, 
      className: 'reservation-unknown', 
      icon: '❓' 
    };
    return (
      <span className={`reservation-badge ${config.className}`}>
        <span className="reservation-icon">{config.icon}</span>
        {config.label}
      </span>
    );
  };

  const getPaymentStatusBadge = (paymentStatus: string) => {
    const paymentConfig = {
      'Pending': { label: t('reservations.pending'), className: 'payment-pending', icon: '⏳' },
      'Paid': { label: t('reservations.paid'), className: 'payment-paid', icon: '✅' },
      'Failed': { label: t('common.error'), className: 'payment-failed', icon: '❌' },
      'Refunded': { label: t('reservations.refunded') || 'Refunded', className: 'payment-refunded', icon: '↩️' }
    };
    const config = paymentConfig[paymentStatus as keyof typeof paymentConfig] || { 
      label: paymentStatus, 
      className: 'payment-unknown', 
      icon: '❓' 
    };
    return (
      <span className={`payment-badge ${config.className}`}>
        <span className="payment-icon">{config.icon}</span>
        {config.label}
      </span>
    );
  };

  const handlePaymentStatusClick = (reservation: ReservationSummary) => {
    setSelectedReservation(reservation);
    setShowPaymentModal(true);
  };

  const handlePaymentStatusUpdate = (paymentStatus: string) => {
    if (selectedReservation) {
      onPaymentStatusChange(selectedReservation.id, paymentStatus);
      setShowPaymentModal(false);
      setSelectedReservation(null);
    }
  };

  const handlePaymentModalClose = () => {
    setShowPaymentModal(false);
    setSelectedReservation(null);
  };

  const handleStatusClick = (reservation: ReservationSummary) => {
    setSelectedStatusReservation(reservation);
    setShowStatusModal(true);
  };

  const handleStatusUpdate = (status: string) => {
    if (selectedStatusReservation) {
      onStatusChange(selectedStatusReservation.id, status as ReservationSummary['status']);
      setShowStatusModal(false);
      setSelectedStatusReservation(null);
    }
  };

  const handleStatusModalClose = () => {
    setShowStatusModal(false);
    setSelectedStatusReservation(null);
  };

  const formatDate = (dateString: string) => {
    return formatShortDate(dateString, i18n.language);
  };

  // Price formatting is now handled by CurrencyDisplay component

  const handleDelete = (reservation: ReservationSummary) => {
    setReservationToDelete(reservation);
    setShowConfirmDialog(true);
  };

  const confirmDelete = () => {
    if (reservationToDelete) {
      onDelete(reservationToDelete.id);
      setShowConfirmDialog(false);
      setReservationToDelete(null);
    }
  };

  const cancelDelete = () => {
    setShowConfirmDialog(false);
    setReservationToDelete(null);
  };

  return (
    <div className={`reservation-table-container ${className}`}>
      <ConfirmDialog
        isOpen={showConfirmDialog}
        title={t('common.delete')}
        message={t('messages.confirmDelete')}
        confirmText={t('common.delete')}
        cancelText={t('common.cancel')}
        type="danger"
        onConfirm={confirmDelete}
        onCancel={cancelDelete}
      />

      {showPaymentModal && selectedReservation && (
        <PaymentStatusModal
          isOpen={showPaymentModal}
          onClose={handlePaymentModalClose}
          onUpdate={handlePaymentStatusUpdate}
          currentStatus={selectedReservation.paymentStatus}
          reservationId={selectedReservation.id}
          totalPrice={selectedReservation.totalPrice}
        />
      )}

      {showStatusModal && selectedStatusReservation && (
        <ReservationStatusModal
          isOpen={showStatusModal}
          onClose={handleStatusModalClose}
          onUpdate={handleStatusUpdate}
          currentStatus={selectedStatusReservation.status}
          reservationId={selectedStatusReservation.id}
          guestName={selectedStatusReservation.guestName}
        />
      )}
      
      <div className="table-wrapper">
        <table className="reservation-table">
          <thead>
            <tr>
              <th>{t('reservations.guestName')}</th>
              <th>{t('reservations.checkInDate')}</th>
              <th>{t('reservations.checkOutDate')}</th>
              <th>{t('rooms.roomType')}</th>
              <th>{t('reservations.roomNumber')}</th>
              <th>{t('guests.title')}</th>
              <th>{t('common.status')}</th>
              <th>{t('reservations.paymentStatus')}</th>
              <th>{t('reservations.totalAmount')}</th>
              <th>{t('common.actions')}</th>
            </tr>
          </thead>
          <tbody>
            {reservations.map((reservation) => (
              <tr key={reservation.id}>
                <td className="guest-name">{reservation.guestName}</td>
                <td className="check-in">{formatDate(reservation.checkInDate)}</td>
                <td className="check-out">{formatDate(reservation.checkOutDate)}</td>
                <td className="room-type">{reservation.roomType}</td>
                <td className="room-number">{reservation.roomNumber || '-'}</td>
                <td className="number-of-guests">{reservation.numberOfGuests}</td>
                <td className="status-cell">
                  <button 
                    className="reservation-status-button"
                    onClick={() => handleStatusClick(reservation)}
                    title="Click to update reservation status"
                  >
                    {getStatusBadge(reservation.status)}
                  </button>
                </td>
                <td className="payment-cell">
                  <button 
                    className="payment-status-button"
                    onClick={() => handlePaymentStatusClick(reservation)}
                    title="Click to update payment status"
                  >
                    {getPaymentStatusBadge(reservation.paymentStatus)}
                  </button>
                </td>
                <td className="total-price">
                  <CurrencyDisplay amount={reservation.totalPrice} size="medium" />
                </td>
                <td className="actions-cell">
                  <div className="action-buttons">
                    <button
                      onClick={() => onEdit(reservation)}
                      className="action-btn edit-btn"
                      title="Edit"
                    >
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M11 4H4C3.46957 4 2.96086 4.21071 2.58579 4.58579C2.21071 4.96086 2 5.46957 2 6V20C2 20.5304 2.21071 21.0391 2.58579 21.4142C2.96086 21.7893 3.46957 22 4 22H18C18.5304 22 19.0391 21.7893 19.4142 21.4142C19.7893 21.0391 20 20.5304 20 20V13" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                        <path d="M18.5 2.5C18.8978 2.10217 19.4374 1.87868 20 1.87868C20.5626 1.87868 21.1022 2.10217 21.5 2.5C21.8978 2.89782 22.1213 3.43739 22.1213 4C22.1213 4.56261 21.8978 5.10217 21.5 5.5L12 15L8 16L9 12L18.5 2.5Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                      </svg>
                    </button>
                    <button
                      onClick={() => handleDelete(reservation)}
                      className="action-btn delete-btn"
                      title="Delete"
                    >
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M3 6H5H21" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                        <path d="M8 6V4C8 3.46957 8.21071 2.96086 8.58579 2.58579C8.96086 2.21071 9.46957 2 10 2H14C14.5304 2 15.0391 2.21071 15.4142 2.58579C15.7893 2.96086 16 3.46957 16 4V6M19 6V20C19 20.5304 18.7893 21.0391 18.4142 21.4142C18.0391 21.7893 17.5304 22 17 22H7C6.46957 22 5.96086 21.7893 5.58579 21.4142C5.21071 21.0391 5 20.5304 5 20V6H19Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                      </svg>
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default ReservationTable;
