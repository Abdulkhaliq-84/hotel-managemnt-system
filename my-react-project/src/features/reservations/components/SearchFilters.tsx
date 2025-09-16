import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import type { SearchFilters as Filters } from '../types/reservation.types';
import './SearchFilters.css';

interface SearchFiltersProps {
  onFiltersChange: (filters: Filters) => void;
  className?: string;
}

const SearchFilters: React.FC<SearchFiltersProps> = ({ onFiltersChange, className = '' }) => {
  const { t } = useTranslation();
  const [filters, setFilters] = useState<Filters>({
    dateRange: { start: '', end: '' },
    guestName: '',
    roomType: '',
    status: ''
  });

  const handleFilterChange = (key: keyof Filters, value: string) => {
    const newFilters = { ...filters };
    if (key === 'dateRange') {
      // Handle date range separately
      return;
    }
    if (key === 'guestName' || key === 'roomType' || key === 'status') {
      newFilters[key] = value;
    }
    setFilters(newFilters);
    onFiltersChange(newFilters);
  };

  const handleDateChange = (type: 'start' | 'end', value: string) => {
    const newFilters = { ...filters };
    newFilters.dateRange[type] = value;
    setFilters(newFilters);
    onFiltersChange(newFilters);
  };

  const clearFilters = () => {
    const clearedFilters: Filters = {
      dateRange: { start: '', end: '' },
      guestName: '',
      roomType: '',
      status: ''
    };
    setFilters(clearedFilters);
    onFiltersChange(clearedFilters);
  };

  return (
    <div className={`search-filters ${className}`}>
      <div className="filters-container">
        <div className="filter-group">
          <label className="filter-label">{t('reservations.guestName')}</label>
          <input
            type="text"
            placeholder={t('reservations.searchReservations')}
            value={filters.guestName}
            onChange={(e) => handleFilterChange('guestName', e.target.value)}
            className="filter-input"
          />
        </div>

        <div className="filter-group">
          <label className="filter-label">{t('reservations.checkInDate')}</label>
          <input
            type="date"
            value={filters.dateRange.start}
            onChange={(e) => handleDateChange('start', e.target.value)}
            className="filter-input"
          />
        </div>

        <div className="filter-group">
          <label className="filter-label">{t('reservations.checkOutDate')}</label>
          <input
            type="date"
            value={filters.dateRange.end}
            onChange={(e) => handleDateChange('end', e.target.value)}
            className="filter-input"
          />
        </div>

        <div className="filter-group">
          <label className="filter-label">{t('rooms.roomType')}</label>
          <select
            value={filters.roomType}
            onChange={(e) => handleFilterChange('roomType', e.target.value)}
            className="filter-select"
          >
            <option value="">{t('common.all')}</option>
            <option value="single">{t('rooms.single')}</option>
            <option value="double">{t('rooms.double')}</option>
            <option value="suite">{t('rooms.suite')}</option>
            <option value="deluxe">{t('rooms.deluxe')}</option>
          </select>
        </div>

        <div className="filter-group">
          <label className="filter-label">{t('common.status')}</label>
          <select
            value={filters.status}
            onChange={(e) => handleFilterChange('status', e.target.value)}
            className="filter-select"
          >
            <option value="">{t('common.all')}</option>
            <option value="pending">{t('reservations.pending')}</option>
            <option value="confirmed">{t('reservations.confirmed')}</option>
            <option value="checked-in">{t('dashboard.checkIn')}</option>
            <option value="checked-out">{t('dashboard.checkOut')}</option>
            <option value="cancelled">{t('reservations.cancelled')}</option>
          </select>
        </div>

        <div className="filter-actions">
          <button onClick={clearFilters} className="clear-filters-btn">
            {t('common.reset')}
          </button>
        </div>
      </div>
    </div>
  );
};

export default SearchFilters;
