import React, { useState } from 'react';
import type { ReservationSummary } from '../types/reservation.types';
import './RoomAvailability.css';

interface RoomAvailabilityProps {
  reservations: ReservationSummary[];
  className?: string;
}

const RoomAvailability: React.FC<RoomAvailabilityProps> = ({ reservations, className = '' }) => {
  const [selectedMonth, setSelectedMonth] = useState(new Date());

  const getDaysInMonth = (date: Date) => {
    const year = date.getFullYear();
    const month = date.getMonth();
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const daysInMonth = lastDay.getDate();
    const startingDayOfWeek = firstDay.getDay();
    
    return { daysInMonth, startingDayOfWeek };
  };

  const getRoomAvailability = (date: Date) => {
    const dateString = date.toISOString().split('T')[0];
    const dayReservations = reservations.filter(reservation => {
      const checkIn = new Date(reservation.checkInDate);
      const checkOut = new Date(reservation.checkOutDate);
      const currentDate = new Date(dateString);
      return currentDate >= checkIn && currentDate < checkOut;
    });
    
    return {
      total: dayReservations.length,
      pending: dayReservations.filter(r => r.status === 'Pending').length,
      confirmed: dayReservations.filter(r => r.status === 'Confirmed').length,
      checkedIn: dayReservations.filter(r => r.status === 'CheckedIn').length
    };
  };

  const getAvailabilityColor = (availability: ReturnType<typeof getRoomAvailability>) => {
    const total = availability.total;
    if (total === 0) return 'available';
    if (total <= 5) return 'low-occupancy';
    if (total <= 10) return 'medium-occupancy';
    return 'high-occupancy';
  };

  const formatMonth = (date: Date) => {
    return date.toLocaleDateString('en-US', { month: 'long', year: 'numeric' });
  };

  const previousMonth = () => {
    setSelectedMonth(prev => new Date(prev.getFullYear(), prev.getMonth() - 1, 1));
  };

  const nextMonth = () => {
    setSelectedMonth(prev => new Date(prev.getFullYear(), prev.getMonth() + 1, 1));
  };

  const { daysInMonth, startingDayOfWeek } = getDaysInMonth(selectedMonth);
  const daysOfWeek = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

  const renderCalendarDays = () => {
    const days = [];
    
    // Add empty cells for days before the first day of the month
    for (let i = 0; i < startingDayOfWeek; i++) {
      days.push(<div key={`empty-${i}`} className="calendar-day empty"></div>);
    }
    
    // Add days of the month
    for (let day = 1; day <= daysInMonth; day++) {
      const currentDate = new Date(selectedMonth.getFullYear(), selectedMonth.getMonth(), day);
      const availability = getRoomAvailability(currentDate);
      const availabilityClass = getAvailabilityColor(availability);
      const isToday = currentDate.toDateString() === new Date().toDateString();
      
      days.push(
        <div 
          key={day} 
          className={`calendar-day ${availabilityClass} ${isToday ? 'today' : ''}`}
          title={`${currentDate.toLocaleDateString()}: ${availability.total} reservations`}
        >
          <span className="day-number">{day}</span>
          {availability.total > 0 && (
            <div className="availability-indicator">
              <span className="reservation-count">{availability.total}</span>
            </div>
          )}
        </div>
      );
    }
    
    return days;
  };

  return (
    <div className={`room-availability ${className}`}>
      <div className="calendar-container">
        <div className="calendar-header">
          <button onClick={previousMonth} className="month-nav-btn">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M15 18L9 12L15 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </button>
          <h3 className="month-title">{formatMonth(selectedMonth)}</h3>
          <button onClick={nextMonth} className="month-nav-btn">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M9 18L15 12L9 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </button>
        </div>
        
        <div className="calendar-grid">
          {/* Days of week header */}
          {daysOfWeek.map(day => (
            <div key={day} className="day-header">
              {day}
            </div>
          ))}
          
          {/* Calendar days */}
          {renderCalendarDays()}
        </div>
        
        <div className="calendar-legend">
          <div className="legend-item">
            <div className="legend-color available"></div>
            <span>Available</span>
          </div>
          <div className="legend-item">
            <div className="legend-color low-occupancy"></div>
            <span>Low Occupancy (1-5)</span>
          </div>
          <div className="legend-item">
            <div className="legend-color medium-occupancy"></div>
            <span>Medium Occupancy (6-10)</span>
          </div>
          <div className="legend-item">
            <div className="legend-color high-occupancy"></div>
            <span>High Occupancy (11+)</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RoomAvailability;
