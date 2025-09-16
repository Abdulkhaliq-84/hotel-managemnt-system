import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import {
  ReservationStats,
  SearchFilters,
  ReservationTable,
  ReservationForm,
  RoomAvailability
} from '../index';
import type { ReservationSummary, SearchFilters as Filters, ReservationStats as Stats } from '../types/reservation.types';
import { apiService } from '../../../services/api';
import { useToast } from '../../../hooks/useToast';
import ToastContainer from '../../../components/ToastContainer';
import './ReservationPage.css';

const ReservationPage: React.FC = () => {
  const { t } = useTranslation();
  const [reservations, setReservations] = useState<ReservationSummary[]>([]);
  const [filteredReservations, setFilteredReservations] = useState<ReservationSummary[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [editingReservation, setEditingReservation] = useState<ReservationSummary | undefined>();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { toasts, removeToast, success, error: showError } = useToast();

  // Load reservations from API
  useEffect(() => {
    const loadReservations = async () => {
      try {
        setLoading(true);
        setError(null);
        
        const data = await apiService.getReservations();
        setReservations(data);
        setFilteredReservations(data);
      } catch (err) {
        const errorMessage = err instanceof Error ? err.message : 'Failed to load reservations';
        setError(errorMessage);
        console.error('Error loading reservations:', err);
      } finally {
        setLoading(false);
      }
    };

    loadReservations();
  }, []);

  // Calculate stats
  const stats: Stats = {
    total: reservations.length,
    pending: reservations.filter(r => r.status === 'Pending').length,
    confirmed: reservations.filter(r => r.status === 'Confirmed').length,
    checkedIn: reservations.filter(r => r.status === 'CheckedIn').length,
    checkedOut: reservations.filter(r => r.status === 'CheckedOut').length,
    cancelled: reservations.filter(r => r.status === 'Cancelled').length
  };

  const handleFiltersChange = (filters: Filters) => {
    let filtered = [...reservations];

    if (filters.guestName) {
      filtered = filtered.filter(r => 
        r.guestName.toLowerCase().includes(filters.guestName.toLowerCase())
      );
    }

    if (filters.roomType) {
      filtered = filtered.filter(r => r.roomType === filters.roomType);
    }

    if (filters.status) {
      filtered = filtered.filter(r => r.status === filters.status);
    }

    if (filters.dateRange.start) {
      filtered = filtered.filter(r => r.checkInDate >= filters.dateRange.start);
    }

    if (filters.dateRange.end) {
      filtered = filtered.filter(r => r.checkOutDate <= filters.dateRange.end);
    }

    setFilteredReservations(filtered);
  };

  const handleEdit = (reservation: ReservationSummary) => {
    setEditingReservation(reservation);
    setShowForm(true);
  };

  const handleDelete = async (id: number) => {
    try {
      await apiService.deleteReservation(id);
      setReservations(prev => prev.filter(r => r.id !== id));
      setFilteredReservations(prev => prev.filter(r => r.id !== id));
      success(t('reservations.title'), t('messages.deleteSuccess'));
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to delete reservation';
      showError('Delete Failed', errorMessage);
      console.error('Error deleting reservation:', err);
    }
  };

  const handleStatusChange = async (id: number, status: ReservationSummary['status']) => {
    try {
      // Get the current reservation to update
      const reservation = await apiService.getReservation(id);
      await apiService.updateReservation(id, {
        guestId: reservation.guestId,
        roomId: reservation.roomId,
        checkInDate: reservation.checkInDate,
        checkOutDate: reservation.checkOutDate,
        numberOfGuests: reservation.numberOfGuests,
        specialRequests: reservation.specialRequests,
        status,
        paymentStatus: reservation.paymentStatus
      });
      
      // Update local state
      const updatedReservations = reservations.map(r => 
        r.id === id ? { ...r, status } : r
      );
      setReservations(updatedReservations);
      setFilteredReservations(updatedReservations);
      
      success(t('common.success'), t('messages.updateSuccess'));
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to update reservation status';
      showError('Update Failed', errorMessage);
      console.error('Error updating reservation status:', err);
    }
  };

  const handlePaymentStatusChange = async (id: number, paymentStatus: string) => {
    try {
      await apiService.updatePaymentStatus(id, paymentStatus);
      
      // Update local state
      const updatedReservations = reservations.map(r => 
        r.id === id ? { ...r, paymentStatus: paymentStatus as ReservationSummary['paymentStatus'] } : r
      );
      setReservations(updatedReservations);
      setFilteredReservations(updatedReservations);
      
      success(t('common.success'), t('messages.updateSuccess'));
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to update payment status';
      showError('Payment Update Failed', errorMessage);
      console.error('Error updating payment status:', err);
    }
  };

  const handleSave = async (reservationData: any) => {
    try {
      if (editingReservation) {
        // Update existing reservation
        await apiService.updateReservation(editingReservation.id, reservationData);
        
        // Reload reservations to get updated data
        const updatedData = await apiService.getReservations();
        setReservations(updatedData);
        setFilteredReservations(updatedData);
        
        success(t('reservations.title'), t('messages.updateSuccess'));
      } else {
        // Create new reservation
        await apiService.createReservation(reservationData);
        
        // Reload reservations to get updated data
        const updatedData = await apiService.getReservations();
        setReservations(updatedData);
        setFilteredReservations(updatedData);
        
        success(t('reservations.newReservation'), t('messages.addSuccess'));
      }
      
      setShowForm(false);
      setEditingReservation(undefined);
    } catch (err) {
      let errorMessage = 'Failed to save reservation';
      let errorTitle = 'Save Failed';
      
      if (err instanceof Error) {
        errorMessage = err.message;
        
        // Provide more specific error messages based on the actual error
        if (errorMessage.includes('Room is not available for the selected dates')) {
          errorTitle = '🚫 Room Conflict';
          errorMessage = 'The selected room is already booked for the chosen dates. Please select different dates or choose another room.';
        } else if (errorMessage.includes('Room is not available')) {
          errorTitle = '🚫 Room Unavailable';
          errorMessage = 'The selected room is currently unavailable. Please choose a different room.';
        } else if (errorMessage.includes('Guest not found')) {
          errorTitle = '👤 Guest Error';
          errorMessage = 'The selected guest could not be found. Please try selecting the guest again.';
        } else if (errorMessage.includes('HTTP error! status: 400')) {
          errorTitle = '⚠️ Validation Error';
          errorMessage = 'Please check all the form fields and try again. Make sure all required information is provided correctly.';
        } else if (errorMessage.includes('HTTP error! status: 500')) {
          errorTitle = '🔧 Server Error';
          errorMessage = 'There was a problem with the server. Please try again in a few moments.';
        } else if (errorMessage.includes('Failed to fetch')) {
          errorTitle = '🌐 Connection Error';
          errorMessage = 'Unable to connect to the server. Please check your internet connection and try again.';
        }
      }
      
      showError(errorTitle, errorMessage);
      console.error('Error saving reservation:', err);
    }
  };

  const handleCancel = () => {
    setShowForm(false);
    setEditingReservation(undefined);
  };

  const handleNewReservation = () => {
    setEditingReservation(undefined);
    setShowForm(true);
  };

  const handleRetryConnection = async () => {
    setError(null);
    setLoading(true);
    
    try {
      const data = await apiService.getReservations();
      setReservations(data);
      setFilteredReservations(data);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to load reservations';
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="reservation-page">
        <div className="loading-container">
          <div className="loading-spinner"></div>
          <p>{t('common.loading')}</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="reservation-page">
        <div className="error-container">
          <h2>{t('common.error')}</h2>
          <p>{error}</p>
          <div className="error-actions">
            <button onClick={handleRetryConnection} className="retry-btn">
              {t('messages.pleaseTryAgain')}
            </button>
            <button onClick={() => window.location.reload()} className="retry-btn secondary">
              {t('common.reset')}
            </button>
          </div>
          <div className="error-help">
            <p><strong>Make sure:</strong></p>
            <ul>
              <li>Backend server is running on <code>http://localhost:5159</code></li>
              <li>Swagger UI is accessible at <code>http://localhost:5159/swagger/index.html</code></li>
              <li>CORS is properly configured in the backend</li>
            </ul>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="reservation-page">
      <ToastContainer toasts={toasts} onRemoveToast={removeToast} />
      
      <div className="page-header">
        <div className="header-left">
          <h1 className="page-title">{t('reservations.title')}</h1>
        </div>
        <button onClick={handleNewReservation} className="new-reservation-btn">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M12 5V19" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            <path d="M5 12H19" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
          {t('reservations.newReservation')}
        </button>
      </div>

      <ReservationStats stats={stats} />

      <SearchFilters onFiltersChange={handleFiltersChange} />

      <div className="full-width-table-section">
        <ReservationTable
          reservations={filteredReservations}
          onEdit={handleEdit}
          onDelete={handleDelete}
          onStatusChange={handleStatusChange}
          onPaymentStatusChange={handlePaymentStatusChange}
        />
      </div>

      <div className="content-grid">
        <div className="sidebar">
          <RoomAvailability reservations={reservations} />
        </div>
      </div>

      {showForm && (
        <ReservationForm
          reservation={editingReservation}
          onSave={handleSave}
          onCancel={handleCancel}
        />
      )}
    </div>
  );
};

export default ReservationPage;
