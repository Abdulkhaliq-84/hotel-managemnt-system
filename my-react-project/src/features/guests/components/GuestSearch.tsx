import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import type { GuestSearchFilters as Filters } from '../types/guest.types';
import './GuestSearch.css';

interface GuestSearchProps {
  onFiltersChange: (filters: Filters) => void;
  onExport?: () => void;
  className?: string;
}

const GuestSearch: React.FC<GuestSearchProps> = ({ onFiltersChange, onExport, className = '' }) => {
  const { t } = useTranslation();
  const [filters, setFilters] = useState<Filters>({
    name: '',
    email: '',
    phone: '',
    isActive: null,
    dateRange: { start: '', end: '' }
  });

  const handleFilterChange = (key: keyof Filters, value: string | boolean | null) => {
    const newFilters = { ...filters };
    if (key === 'dateRange') {
      // Handle date range separately
      return;
    }
    if (key === 'name' || key === 'email' || key === 'phone') {
      newFilters[key] = value as string;
    }
    if (key === 'isActive') {
      newFilters[key] = value as boolean | null;
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
      name: '',
      email: '',
      phone: '',
      isActive: null,
      dateRange: { start: '', end: '' }
    };
    setFilters(clearedFilters);
    onFiltersChange(clearedFilters);
  };

  const handleExport = () => {
    if (onExport) {
      onExport();
    }
  };

  return (
    <div className={`guest-search ${className}`}>
      <div className="filters-container">
        <div className="filter-group">
          <label className="filter-label">{t('guests.guestName')}</label>
          <input
            type="text"
            placeholder={t('guests.searchByName')}
            value={filters.name}
            onChange={(e) => handleFilterChange('name', e.target.value)}
            className="filter-input"
          />
        </div>

        <div className="filter-group">
          <label className="filter-label">{t('guests.email')}</label>
          <input
            type="email"
            placeholder={t('guests.searchByEmail')}
            value={filters.email}
            onChange={(e) => handleFilterChange('email', e.target.value)}
            className="filter-input"
          />
        </div>

        <div className="filter-group">
          <label className="filter-label">{t('guests.phone')}</label>
          <input
            type="tel"
            placeholder={t('guests.searchByPhone')}
            value={filters.phone}
            onChange={(e) => handleFilterChange('phone', e.target.value)}
            className="filter-input"
          />
        </div>

        <div className="filter-group">
          <label className="filter-label">{t('common.status')}</label>
          <select
            value={filters.isActive === null ? '' : filters.isActive ? 'active' : 'inactive'}
            onChange={(e) => {
              const value = e.target.value;
              handleFilterChange('isActive', value === '' ? null : value === 'active');
            }}
            className="filter-select"
          >
            <option value="">{t('guests.allStatuses')}</option>
            <option value="active">{t('guests.active')}</option>
            <option value="inactive">{t('guests.inactive')}</option>
          </select>
        </div>

        <div className="filter-group">
          <label className="filter-label">{t('guests.lastVisitFrom')}</label>
          <input
            type="date"
            value={filters.dateRange.start}
            onChange={(e) => handleDateChange('start', e.target.value)}
            className="filter-input"
          />
        </div>

        <div className="filter-group">
          <label className="filter-label">{t('guests.lastVisitTo')}</label>
          <input
            type="date"
            value={filters.dateRange.end}
            onChange={(e) => handleDateChange('end', e.target.value)}
            className="filter-input"
          />
        </div>

        <div className="filter-actions">
          <button onClick={clearFilters} className="clear-filters-btn">
            {t('guests.clearFilters')}
          </button>
          <button onClick={handleExport} className="export-btn">
            {t('common.export')}
          </button>
        </div>
      </div>
    </div>
  );
};

export default GuestSearch;
