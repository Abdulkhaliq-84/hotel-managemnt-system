import React from 'react';
import type { Room } from '../types/room.types';
import './RoomDetails.css';

interface RoomDetailsProps {
  room: Room;
  onEdit: (room: Room) => void;
  onClose: () => void;
  className?: string;
}

interface GuestInfo {
  name: string;
  checkIn: string;
  checkOut: string;
  numberOfGuests: number;
  totalPrice: number;
}

const RoomDetails: React.FC<RoomDetailsProps> = ({
  room,
  onEdit,
  onClose,
  className = ''
}) => {
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(price);
  };

  const getStatusBadge = (status: Room['status']) => {
    const statusConfig = {
      'available': { label: 'Available', className: 'status-available' },
      'occupied': { label: 'Occupied', className: 'status-occupied' },
      'maintenance': { label: 'Maintenance', className: 'status-maintenance' },
      'cleaning': { label: 'Cleaning', className: 'status-cleaning' },
      'reserved': { label: 'Reserved', className: 'status-reserved' }
    };

    const config = statusConfig[status];
    return (
      <span className={`rooms-details-status-badge ${config.className}`}>
        {config.label}
      </span>
    );
  };

  const getRoomTypeLabel = (roomType: Room['roomType']) => {
    const typeLabels = {
      'single': 'Single Room',
      'double': 'Double Room',
      'suite': 'Suite',
      'deluxe': 'Deluxe Room'
    };
    return typeLabels[roomType];
  };

  // Mock guest information (in real app, this would come from reservations)
  const getCurrentGuest = (): GuestInfo | null => {
    if (room.status === 'occupied') {
      return {
        name: 'John Smith',
        checkIn: '2024-01-15T14:00:00Z',
        checkOut: '2024-01-18T11:00:00Z',
        numberOfGuests: 2,
        totalPrice: 540
      };
    }
    return null;
  };

  const currentGuest = getCurrentGuest();

  // Mock room history (in real app, this would come from database)
  const roomHistory = [
    {
      id: '1',
      action: 'Guest Check-in',
      guestName: 'John Smith',
      date: '2024-01-15T14:00:00Z',
      details: 'Room 201 checked in by John Smith'
    },
    {
      id: '2',
      action: 'Room Cleaned',
      guestName: null,
      date: '2024-01-15T10:00:00Z',
      details: 'Room cleaned by housekeeping staff'
    },
    {
      id: '3',
      action: 'Guest Check-out',
      guestName: 'Sarah Johnson',
      date: '2024-01-14T11:00:00Z',
      details: 'Room 201 checked out by Sarah Johnson'
    }
  ];

  return (
    <div className={`rooms-details-container ${className}`}>
      <div className="rooms-details-wrapper">
        <div className="rooms-details-header">
          <h2 className="rooms-details-title">Room {room.roomNumber}</h2>
          <button onClick={onClose} className="rooms-details-close-btn">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M18 6L6 18" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              <path d="M6 6L18 18" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </button>
        </div>

        <div className="rooms-details-content">
          {/* Basic Information */}
          <div className="rooms-details-section">
            <h3 className="rooms-details-section-title">Basic Information</h3>
            <div className="rooms-details-grid">
              <div className="rooms-details-info-item">
                <label className="rooms-details-label">Room Number</label>
                <span className="rooms-details-value">{room.roomNumber}</span>
              </div>
              <div className="rooms-details-info-item">
                <label className="rooms-details-label">Room Type</label>
                <span className="rooms-details-value">{getRoomTypeLabel(room.roomType)}</span>
              </div>
              <div className="rooms-details-info-item">
                <label className="rooms-details-label">Floor</label>
                <span className="rooms-details-value">{room.floor}</span>
              </div>
              <div className="rooms-details-info-item">
                <label className="rooms-details-label">Price per Night</label>
                <span className="rooms-details-value price">{formatPrice(room.price)}</span>
              </div>
              <div className="rooms-details-info-item">
                <label className="rooms-details-label">Capacity</label>
                <span className="rooms-details-value">{room.capacity} {room.capacity === 1 ? 'person' : 'people'}</span>
              </div>
              <div className="rooms-details-info-item">
                <label className="rooms-details-label">Status</label>
                <span className="rooms-details-value">{getStatusBadge(room.status)}</span>
              </div>
            </div>
          </div>

          {/* Description */}
          <div className="rooms-details-section">
            <h3 className="rooms-details-section-title">Description</h3>
            <p className="rooms-details-description">{room.description}</p>
          </div>

          {/* Amenities */}
          <div className="rooms-details-section">
            <h3 className="rooms-details-section-title">Amenities</h3>
            <div className="rooms-details-amenities">
              {room.amenities.map((amenity, index) => (
                <span key={index} className="rooms-details-amenity-tag">
                  {amenity}
                </span>
              ))}
            </div>
          </div>

          {/* Cleaning Schedule */}
          <div className="rooms-details-section">
            <h3 className="rooms-details-section-title">Cleaning Schedule</h3>
            <div className="rooms-details-grid">
              <div className="rooms-details-info-item">
                <label className="rooms-details-label">Last Cleaned</label>
                <span className="rooms-details-value">{formatDate(room.lastCleaned)}</span>
              </div>
              <div className="rooms-details-info-item">
                <label className="rooms-details-label">Next Cleaning</label>
                <span className="rooms-details-value">{formatDate(room.nextCleaning)}</span>
              </div>
            </div>
          </div>

          {/* Current Guest Information */}
          {currentGuest && (
            <div className="rooms-details-section">
              <h3 className="rooms-details-section-title">Current Guest</h3>
              <div className="rooms-details-guest-info">
                <div className="rooms-details-grid">
                  <div className="rooms-details-info-item">
                    <label className="rooms-details-label">Guest Name</label>
                    <span className="rooms-details-value">{currentGuest.name}</span>
                  </div>
                  <div className="rooms-details-info-item">
                    <label className="rooms-details-label">Check-in</label>
                    <span className="rooms-details-value">{formatDate(currentGuest.checkIn)}</span>
                  </div>
                  <div className="rooms-details-info-item">
                    <label className="rooms-details-label">Check-out</label>
                    <span className="rooms-details-value">{formatDate(currentGuest.checkOut)}</span>
                  </div>
                  <div className="rooms-details-info-item">
                    <label className="rooms-details-label">Number of Guests</label>
                    <span className="rooms-details-value">{currentGuest.numberOfGuests}</span>
                  </div>
                  <div className="rooms-details-info-item">
                    <label className="rooms-details-label">Total Price</label>
                    <span className="rooms-details-value price">{formatPrice(currentGuest.totalPrice)}</span>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Room History */}
          <div className="rooms-details-section">
            <h3 className="rooms-details-section-title">Recent Activity</h3>
            <div className="rooms-details-history">
              {roomHistory.map((event) => (
                <div key={event.id} className="rooms-details-history-item">
                  <div className="rooms-details-history-header">
                    <span className="rooms-details-history-action">{event.action}</span>
                    <span className="rooms-details-history-date">{formatDate(event.date)}</span>
                  </div>
                  <p className="rooms-details-history-details">{event.details}</p>
                  {event.guestName && (
                    <span className="rooms-details-history-guest">Guest: {event.guestName}</span>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="rooms-details-actions">
          <button onClick={onClose} className="rooms-details-back-btn">
            Back to List
          </button>
          <button onClick={() => onEdit(room)} className="rooms-details-edit-btn">
            Edit Room
          </button>
        </div>
      </div>
    </div>
  );
};

export default RoomDetails;
