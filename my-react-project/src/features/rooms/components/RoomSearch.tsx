import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import type { RoomSearchFilters } from '../types/room.types';
import './RoomSearch.css';

interface RoomSearchProps {
  onFiltersChange: (filters: RoomSearchFilters) => void;
  onExport?: () => void;
  className?: string;
}

const RoomSearch: React.FC<RoomSearchProps> = ({ onFiltersChange, onExport, className = '' }) => {
  const { t } = useTranslation();
  const [filters, setFilters] = useState<RoomSearchFilters>({
    roomNumber: '',
    roomType: '',
    floor: null,
    status: '',
    priceRange: {
      min: 0,
      max: 1000
    },
    capacity: null
  });

  const handleFilterChange = (key: keyof RoomSearchFilters, value: string | number | null) => {
    const newFilters = { ...filters };
    if (key === 'roomNumber' || key === 'roomType' || key === 'status') {
      newFilters[key] = value as string;
    } else if (key === 'floor' || key === 'capacity') {
      newFilters[key] = value as number | null;
    }
    setFilters(newFilters);
    onFiltersChange(newFilters);
  };

  const handlePriceRangeChange = (type: 'min' | 'max', value: number) => {
    const newFilters = { ...filters };
    newFilters.priceRange[type] = value;
    setFilters(newFilters);
    onFiltersChange(newFilters);
  };

  const clearFilters = () => {
    const clearedFilters: RoomSearchFilters = {
      roomNumber: '',
      roomType: '',
      floor: null,
      status: '',
      priceRange: {
        min: 0,
        max: 1000
      },
      capacity: null
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
    <div className={`rooms-search ${className}`}>
      <div className="rooms-search-container">
        <div className="rooms-search-group">
          <label className="rooms-search-label filter-label">{t('rooms.roomNumber')}</label>
          <input
            type="text"
            placeholder={t('rooms.searchByRoomNumber')}
            value={filters.roomNumber}
            onChange={(e) => handleFilterChange('roomNumber', e.target.value)}
            className="rooms-search-input"
          />
        </div>

        <div className="rooms-search-group">
          <label className="rooms-search-label filter-label">{t('rooms.roomType')}</label>
          <select
            value={filters.roomType}
            onChange={(e) => handleFilterChange('roomType', e.target.value)}
            className="rooms-search-select"
          >
            <option value="">{t('rooms.allRoomTypes')}</option>
            <option value="single">{t('rooms.types.single')}</option>
            <option value="double">{t('rooms.types.double')}</option>
            <option value="suite">{t('rooms.types.suite')}</option>
            <option value="deluxe">{t('rooms.types.deluxe')}</option>
          </select>
        </div>

        <div className="rooms-search-group">
          <label className="rooms-search-label filter-label">{t('rooms.floor')}</label>
          <select
            value={filters.floor || ''}
            onChange={(e) => handleFilterChange('floor', e.target.value ? parseInt(e.target.value) : null)}
            className="rooms-search-select"
          >
            <option value="">{t('rooms.allFloors')}</option>
            <option value="1">{t('rooms.floorNumber', { number: 1 })}</option>
            <option value="2">{t('rooms.floorNumber', { number: 2 })}</option>
            <option value="3">{t('rooms.floorNumber', { number: 3 })}</option>
            <option value="4">{t('rooms.floorNumber', { number: 4 })}</option>
            <option value="5">{t('rooms.floorNumber', { number: 5 })}</option>
          </select>
        </div>

        <div className="rooms-search-group">
          <label className="rooms-search-label filter-label">{t('common.status')}</label>
          <select
            value={filters.status}
            onChange={(e) => handleFilterChange('status', e.target.value)}
            className="rooms-search-select"
          >
            <option value="">{t('rooms.allStatuses')}</option>
            <option value="available">{t('rooms.status.available')}</option>
            <option value="occupied">{t('rooms.status.occupied')}</option>
            <option value="maintenance">{t('rooms.status.maintenance')}</option>
            <option value="cleaning">{t('rooms.status.cleaning')}</option>
            <option value="reserved">{t('rooms.status.reserved')}</option>
          </select>
        </div>

        <div className="rooms-search-group">
          <label className="rooms-search-label filter-label">{t('rooms.capacity')}</label>
          <select
            value={filters.capacity || ''}
            onChange={(e) => handleFilterChange('capacity', e.target.value ? parseInt(e.target.value) : null)}
            className="rooms-search-select"
          >
            <option value="">{t('rooms.allCapacities')}</option>
            <option value="1">1 {t('rooms.person')}</option>
            <option value="2">2 {t('rooms.people')}</option>
            <option value="3">3 {t('rooms.people')}</option>
            <option value="4">4 {t('rooms.people')}</option>
            <option value="5">5+ {t('rooms.people')}</option>
          </select>
        </div>

        <div className="rooms-search-group rooms-search-price-range">
          <label className="rooms-search-label filter-label">{t('rooms.priceRange')}</label>
          <div className="rooms-search-price-inputs">
            <input
              type="number"
              placeholder={t('common.min')}
              value={filters.priceRange.min}
              onChange={(e) => handlePriceRangeChange('min', parseInt(e.target.value) || 0)}
              className="rooms-search-price-input"
            />
            <span className="rooms-search-price-separator">-</span>
            <input
              type="number"
              placeholder={t('common.max')}
              value={filters.priceRange.max}
              onChange={(e) => handlePriceRangeChange('max', parseInt(e.target.value) || 1000)}
              className="rooms-search-price-input"
            />
          </div>
        </div>

        <div className="rooms-search-actions">
          <button onClick={clearFilters} className="rooms-search-clear-btn">
            {t('common.clearFilters')}
          </button>
          {onExport && (
            <button onClick={handleExport} className="rooms-search-export-btn">
              {t('common.export')}
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default RoomSearch;
