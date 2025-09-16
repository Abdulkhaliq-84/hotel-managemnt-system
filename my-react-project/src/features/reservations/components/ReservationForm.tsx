import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import type { ReservationSummary, RoomType, Guest, CreateReservationDto, RoomAvailability } from '../types/reservation.types';
import { apiService } from '../../../services/api';
import { CurrencyDisplay } from '../../../utils/currency';
import './ReservationForm.css';

interface ReservationFormProps {
  reservation?: ReservationSummary;
  onSave: (reservation: CreateReservationDto) => void;
  onCancel: () => void;
  className?: string;
}

const ReservationForm: React.FC<ReservationFormProps> = ({
  reservation,
  onSave,
  onCancel,
  className = ''
}) => {
  const { t } = useTranslation();
  const [formData, setFormData] = useState({
    guestName: '',
    email: '',
    phone: '',
    checkInDate: '',
    checkOutDate: '',
    roomId: 0,
    numberOfGuests: 1,
    specialRequests: '',
    totalPrice: 0
  });

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [guests, setGuests] = useState<Guest[]>([]);
  const [rooms, setRooms] = useState<RoomType[]>([]);
  const [availableRooms, setAvailableRooms] = useState<RoomAvailability[]>([]);
  const [loading, setLoading] = useState(true);
  const [showGuestForm, setShowGuestForm] = useState(false);
  const [newGuest, setNewGuest] = useState({ name: '', email: '', phone: '' });

  // Load guests and rooms from API
  useEffect(() => {
    const loadData = async () => {
      try {
        setLoading(true);
        const [guestsData, roomsData] = await Promise.all([
          apiService.getGuests(),
          apiService.getAvailableRooms()
        ]);
        setGuests(guestsData);
        setRooms(roomsData);
      } catch (error) {
        console.error('Error loading data:', error);
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, []);

  // Check room availability when dates change
  const checkRoomAvailability = async (checkInDate: string, checkOutDate: string) => {
    if (!checkInDate || !checkOutDate) {
      setAvailableRooms([]);
      return;
    }

    try {
      const availability = await apiService.checkRoomAvailability(checkInDate, checkOutDate);
      setAvailableRooms(availability);
      
      // If currently selected room is not available, clear selection
      if (formData.roomId !== 0) {
        const selectedRoom = availability.find(r => r.roomId === formData.roomId);
        if (!selectedRoom || !selectedRoom.isAvailable) {
          setFormData(prev => ({ ...prev, roomId: 0 }));
        }
      }
    } catch (error) {
      console.error('Error checking room availability:', error);
      setAvailableRooms([]);
    }
  };

  useEffect(() => {
    if (reservation) {
      // Find guest and room by name/number for editing
      const guest = guests.find(g => g.name === reservation.guestName);
      const room = rooms.find(r => r.roomNumber === reservation.roomNumber);
      
      // Convert ISO date strings to YYYY-MM-DD format for date inputs
      const checkInDate = new Date(reservation.checkInDate).toISOString().split('T')[0];
      const checkOutDate = new Date(reservation.checkOutDate).toISOString().split('T')[0];
      
      setFormData({
        guestName: reservation.guestName,
        email: guest?.email || '',
        phone: guest?.phone || '',
        checkInDate: checkInDate,
        checkOutDate: checkOutDate,
        roomId: room?.id || 0,
        numberOfGuests: reservation.numberOfGuests,
        specialRequests: '',
        totalPrice: reservation.totalPrice
      });
    }
  }, [reservation, guests, rooms]);

  useEffect(() => {
    // Calculate total price based on selected room and number of nights
    const selectedRoom = rooms.find(r => r.id === formData.roomId);
    if (selectedRoom && formData.checkInDate && formData.checkOutDate) {
      const checkIn = new Date(formData.checkInDate);
      const checkOut = new Date(formData.checkOutDate);
      const nights = Math.ceil((checkOut.getTime() - checkIn.getTime()) / (1000 * 60 * 60 * 24));
      const totalPrice = selectedRoom.pricePerNight * nights;
      setFormData(prev => ({ ...prev, totalPrice }));
    }
  }, [formData.roomId, formData.checkInDate, formData.checkOutDate, rooms]);

  // Check room availability when dates change
  useEffect(() => {
    if (formData.checkInDate && formData.checkOutDate) {
      checkRoomAvailability(formData.checkInDate, formData.checkOutDate);
    }
  }, [formData.checkInDate, formData.checkOutDate]);

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};

    console.log('Validating form data:', formData);

    if (!formData.guestName.trim()) {
      newErrors.guestName = t('validation.required');
    }

    if (!formData.email.trim()) {
      newErrors.email = t('validation.required');
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = t('validation.invalidEmail');
    }

    if (!formData.phone.trim()) {
      newErrors.phone = t('validation.required');
    }

    if (!formData.checkInDate) {
      newErrors.checkInDate = t('validation.required');
    }

    if (!formData.checkOutDate) {
      newErrors.checkOutDate = t('validation.required');
    } else if (formData.checkInDate && new Date(formData.checkOutDate) <= new Date(formData.checkInDate)) {
      newErrors.checkOutDate = t('validation.invalidDate');
    }

    if (formData.numberOfGuests < 1) {
      newErrors.numberOfGuests = t('validation.required');
    }

    if (formData.roomId === 0) {
      newErrors.roomId = t('validation.required');
    } else {
      // Check if selected room is available
      if (availableRooms.length > 0) {
        const selectedRoom = availableRooms.find(r => r.roomId === formData.roomId);
        if (!selectedRoom || !selectedRoom.isAvailable) {
          newErrors.roomId = t('messages.noDataFound');
        }
      } else {
        const selectedRoom = rooms.find(r => r.id === formData.roomId);
        if (selectedRoom && !selectedRoom.isAvailable) {
          newErrors.roomId = t('messages.noDataFound');
        }
      }
    }

    console.log('Validation errors:', newErrors);
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleCreateGuest = async () => {
    try {
      const guest = await apiService.createGuest(newGuest);
      setGuests(prev => [...prev, guest]);
      setFormData(prev => ({ 
        ...prev, 
        guestName: guest.name,
        email: guest.email,
        phone: guest.phone
      }));
      setShowGuestForm(false);
      setNewGuest({ name: '', email: '', phone: '' });
    } catch (error) {
      console.error('Error creating guest:', error);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      console.log('Form validation failed, not submitting');
      return;
    }

    setIsSubmitting(true);

    try {
      console.log('Form data before processing:', formData);
      
      // Find or create guest
      let guestId = guests.find(g => g.name === formData.guestName)?.id;
      console.log('Found guest ID:', guestId);
      
      if (!guestId) {
        console.log('Creating new guest:', { name: formData.guestName, email: formData.email, phone: formData.phone });
        // Create new guest
        const newGuest = await apiService.createGuest({
          name: formData.guestName,
          email: formData.email,
          phone: formData.phone
        });
        guestId = newGuest.id;
        console.log('Created guest with ID:', guestId);
      }

      const reservationData: CreateReservationDto = {
        guestId,
        roomId: formData.roomId,
        checkInDate: new Date(formData.checkInDate).toISOString(),
        checkOutDate: new Date(formData.checkOutDate).toISOString(),
        numberOfGuests: formData.numberOfGuests,
        specialRequests: formData.specialRequests || undefined
      };

      console.log('Sending reservation data:', reservationData);
      await onSave(reservationData);
    } catch (error) {
      console.error('Error saving reservation:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleInputChange = (field: string, value: string | number) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  const selectedRoom = rooms.find(r => r.id === formData.roomId);

  if (loading) {
    return (
      <div className={`reservation-form-container ${className}`}>
        <div className="form-wrapper">
          <div className="loading-container">
            <div className="loading-spinner"></div>
            <p>{t('common.loading')}</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className={`reservation-form-container ${className}`}>
      <div className="form-wrapper">
        <h2 className="form-title">
          {reservation ? t('reservations.edit') : t('reservations.create')}
        </h2>
        
        <form onSubmit={handleSubmit} className="reservation-form">
          <div className="form-grid">
            {/* Guest Information */}
            <div className="form-section">
              <h3 className="section-title">{t('reservations.guestInfo')}</h3>
              
              <div className="form-group">
                <label className="form-label">{t('reservations.selectGuest')} *</label>
                <select
                  value={formData.guestName}
                  onChange={(e) => {
                    const selectedGuest = guests.find(g => g.name === e.target.value);
                    if (selectedGuest) {
                      setFormData(prev => ({
                        ...prev,
                        guestName: selectedGuest.name,
                        email: selectedGuest.email,
                        phone: selectedGuest.phone
                      }));
                    }
                  }}
                  className={`form-select ${errors.guestName ? 'error' : ''}`}
                >
                  <option value="">{t('reservations.selectOrCreate')}</option>
                  {guests.map(guest => (
                    <option key={guest.id} value={guest.name}>
                      {guest.name} ({guest.email})
                    </option>
                  ))}
                </select>
                {errors.guestName && <span className="error-message">{errors.guestName}</span>}
              </div>

              <div className="form-group">
                <button
                  type="button"
                  onClick={() => setShowGuestForm(!showGuestForm)}
                  className="create-guest-btn"
                >
                  {showGuestForm ? t('reservations.cancelNewGuest') : t('reservations.createNewGuest')}
                </button>
              </div>

              {showGuestForm && (
                <div className="new-guest-form">
                  <h4>{t('reservations.createNewGuest')}</h4>
                  <div className="form-group">
                    <label className="form-label">{t('reservations.guestName')} *</label>
                    <input
                      type="text"
                      value={newGuest.name}
                      onChange={(e) => setNewGuest(prev => ({ ...prev, name: e.target.value }))}
                      className="form-input"
                      placeholder={t('reservations.guestNamePlaceholder')}
                    />
                  </div>
                  <div className="form-group">
                    <label className="form-label">{t('reservations.email')} *</label>
                    <input
                      type="email"
                      value={newGuest.email}
                      onChange={(e) => setNewGuest(prev => ({ ...prev, email: e.target.value }))}
                      className="form-input"
                      placeholder={t('reservations.emailPlaceholder')}
                    />
                  </div>
                  <div className="form-group">
                    <label className="form-label">{t('reservations.phone')} *</label>
                    <input
                      type="tel"
                      value={newGuest.phone}
                      onChange={(e) => setNewGuest(prev => ({ ...prev, phone: e.target.value }))}
                      className="form-input"
                      placeholder={t('reservations.phonePlaceholder')}
                    />
                  </div>
                  <button
                    type="button"
                    onClick={handleCreateGuest}
                    className="save-guest-btn"
                    disabled={!newGuest.name || !newGuest.email || !newGuest.phone}
                  >
                    {t('reservations.createGuest')}
                  </button>
                </div>
              )}

              <div className="form-group">
                <label className="form-label">{t('reservations.email')} *</label>
                <input
                  type="email"
                  value={formData.email}
                  onChange={(e) => handleInputChange('email', e.target.value)}
                  className={`form-input ${errors.email ? 'error' : ''}`}
                  placeholder={t('reservations.emailPlaceholder')}
                />
                {errors.email && <span className="error-message">{errors.email}</span>}
              </div>

              <div className="form-group">
                <label className="form-label">{t('reservations.phone')} *</label>
                <input
                  type="tel"
                  value={formData.phone}
                  onChange={(e) => handleInputChange('phone', e.target.value)}
                  className={`form-input ${errors.phone ? 'error' : ''}`}
                  placeholder={t('reservations.phonePlaceholder')}
                />
                {errors.phone && <span className="error-message">{errors.phone}</span>}
              </div>
            </div>

            {/* Reservation Details */}
            <div className="form-section">
              <h3 className="section-title">{t('reservations.reservationDetails')}</h3>
              
              <div className="form-group">
                <label className="form-label">{t('reservations.checkIn')} *</label>
                <input
                  type="date"
                  value={formData.checkInDate}
                  onChange={(e) => handleInputChange('checkInDate', e.target.value)}
                  className={`form-input ${errors.checkInDate ? 'error' : ''}`}
                  min={new Date().toISOString().split('T')[0]}
                />
                {errors.checkInDate && <span className="error-message">{errors.checkInDate}</span>}
              </div>

              <div className="form-group">
                <label className="form-label">{t('reservations.checkOut')} *</label>
                <input
                  type="date"
                  value={formData.checkOutDate}
                  onChange={(e) => handleInputChange('checkOutDate', e.target.value)}
                  className={`form-input ${errors.checkOutDate ? 'error' : ''}`}
                  min={formData.checkInDate || new Date().toISOString().split('T')[0]}
                />
                {errors.checkOutDate && <span className="error-message">{errors.checkOutDate}</span>}
              </div>

              <div className="form-group">
                <label className="form-label">{t('reservations.guests')} *</label>
                <input
                  type="number"
                  value={formData.numberOfGuests}
                  onChange={(e) => handleInputChange('numberOfGuests', parseInt(e.target.value))}
                  className={`form-input ${errors.numberOfGuests ? 'error' : ''}`}
                  min="1"
                  max={10}
                />
                {errors.numberOfGuests && <span className="error-message">{errors.numberOfGuests}</span>}
              </div>
            </div>

            {/* Room Information */}
            <div className="form-section">
              <h3 className="section-title">{t('reservations.roomInfo')}</h3>
              
              <div className="form-group">
                <label className="form-label">{t('reservations.selectRoom')} *</label>
                <select
                  value={formData.roomId}
                  onChange={(e) => handleInputChange('roomId', parseInt(e.target.value))}
                  className={`form-select ${errors.roomId ? 'error' : ''}`}
                >
                  <option value={0}>{t('reservations.selectRoomPlaceholder')}</option>
                  {availableRooms.length > 0 ? (
                    // Show rooms with availability status based on selected dates
                    availableRooms.map(room => (
                      <option 
                        key={room.roomId} 
                        value={room.roomId}
                        disabled={!room.isAvailable}
                      >
                        {room.roomNumber} - {room.roomType} - <CurrencyDisplay amount={room.pricePerNight} />/{t('reservations.perNight')}
                        {!room.isAvailable ? ` (${t('reservations.unavailableForDates')})` : ` (${t('reservations.available')})`}
                      </option>
                    ))
                  ) : (
                    // Show all rooms when no dates selected
                    rooms.map(room => (
                      <option 
                        key={room.id} 
                        value={room.id}
                        disabled={!room.isAvailable}
                      >
                        {room.roomNumber} - {room.roomType} - <CurrencyDisplay amount={room.pricePerNight} />/{t('reservations.perNight')}
                        {!room.isAvailable ? ` (${t('reservations.unavailable')})` : ''}
                      </option>
                    ))
                  )}
                </select>
                {errors.roomId && <span className="error-message">{errors.roomId}</span>}
                {selectedRoom && (
                  <p className="room-description">{selectedRoom.description}</p>
                )}
              </div>

              <div className="form-group">
                <label className="form-label">{t('reservations.specialRequests')}</label>
                <textarea
                  value={formData.specialRequests}
                  onChange={(e) => handleInputChange('specialRequests', e.target.value)}
                  className="form-textarea"
                  placeholder={t('reservations.specialRequestsPlaceholder')}
                  rows={3}
                />
              </div>
            </div>

            {/* Price Information */}
            <div className="form-section">
              <h3 className="section-title">{t('reservations.priceInfo')}</h3>
              
              <div className="form-group">
                <label className="form-label">{t('reservations.totalPrice')}</label>
                <div className="price-display">
                  <CurrencyDisplay amount={formData.totalPrice} />
                </div>
                {selectedRoom && formData.checkInDate && formData.checkOutDate && (
                  <p className="price-breakdown">
                    <CurrencyDisplay amount={selectedRoom.pricePerNight} /> × {Math.ceil((new Date(formData.checkOutDate).getTime() - new Date(formData.checkInDate).getTime()) / (1000 * 60 * 60 * 24))} {t('reservations.nights')}
                  </p>
                )}
              </div>
            </div>
          </div>

          <div className="form-actions">
            <button
              type="button"
              onClick={onCancel}
              className="cancel-btn"
              disabled={isSubmitting}
            >
              {t('common.cancel')}
            </button>
            <button
              type="submit"
              className="save-btn"
              disabled={isSubmitting}
            >
              {isSubmitting ? t('common.saving') : (reservation ? t('reservations.updateReservation') : t('reservations.createReservation'))}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ReservationForm;
