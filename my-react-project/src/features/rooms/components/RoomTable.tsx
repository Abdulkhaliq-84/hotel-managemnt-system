import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import type { Room } from '../types/room.types';
import CurrencyDisplay from '../../../components/CurrencyDisplay';
import { formatShortDate } from '../../../utils/dateUtils';
import './RoomTable.css';

interface RoomTableProps {
  rooms: Room[];
  onEdit: (room: Room) => void;
  onDelete: (id: string) => void;
  onViewDetails: (room: Room) => void;
  className?: string;
}

interface SortConfig {
  key: keyof Room | null;
  direction: 'asc' | 'desc';
}

const RoomTable: React.FC<RoomTableProps> = ({
  rooms,
  onEdit,
  onDelete,
  onViewDetails,
  className = ''
}) => {
  const { t, i18n } = useTranslation();
  const [sortConfig, setSortConfig] = useState<SortConfig>({ key: null, direction: 'asc' });
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(10);

  const getStatusBadge = (status: Room['status']) => {
    const statusConfig = {
      'available': { label: t('rooms.status.available'), className: 'status-available' },
      'occupied': { label: t('rooms.status.occupied'), className: 'status-occupied' },
      'maintenance': { label: t('rooms.status.maintenance'), className: 'status-maintenance' },
      'cleaning': { label: t('rooms.status.cleaning'), className: 'status-cleaning' },
      'reserved': { label: t('rooms.status.reserved'), className: 'status-reserved' }
    };

    const config = statusConfig[status];
    return (
      <span className={`rooms-table-status-badge status-badge ${config.className}`}>
        {config.label}
      </span>
    );
  };

  const formatDate = (dateString: string) => {
    return formatShortDate(dateString, i18n.language);
  };

  const handleSort = (key: keyof Room) => {
    setSortConfig(prev => ({
      key,
      direction: prev.key === key && prev.direction === 'asc' ? 'desc' : 'asc'
    }));
  };

  const sortedRooms = [...rooms].sort((a, b) => {
    if (!sortConfig.key) return 0;

    const aValue = a[sortConfig.key];
    const bValue = b[sortConfig.key];

    if (typeof aValue === 'string' && typeof bValue === 'string') {
      return sortConfig.direction === 'asc' 
        ? aValue.localeCompare(bValue)
        : bValue.localeCompare(aValue);
    }

    if (typeof aValue === 'number' && typeof bValue === 'number') {
      return sortConfig.direction === 'asc' ? aValue - bValue : bValue - aValue;
    }

    return 0;
  });

  const handleDelete = (id: string) => {
    if (window.confirm(t('rooms.confirmDelete'))) {
      onDelete(id);
    }
  };

  // Pagination
  const totalPages = Math.ceil(sortedRooms.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentRooms = sortedRooms.slice(startIndex, endIndex);

  const getSortIcon = (key: keyof Room) => {
    if (sortConfig.key !== key) {
      return (
        <svg width="12" height="12" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M7 14L12 9L17 14" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
      );
    }
    
    return sortConfig.direction === 'asc' ? (
      <svg width="12" height="12" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M17 10L12 15L7 10" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
      </svg>
    ) : (
      <svg width="12" height="12" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M7 14L12 9L17 14" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
      </svg>
    );
  };

  return (
    <div className={`rooms-table-container ${className}`}>
      <div className="rooms-table-wrapper">
        <table className="rooms-table reservation-table">
          <thead>
            <tr>
              <th onClick={() => handleSort('roomNumber')} className="sortable">
                {t('rooms.roomNumber')} {getSortIcon('roomNumber')}
              </th>
              <th onClick={() => handleSort('roomType')} className="sortable">
                {t('rooms.roomType')} {getSortIcon('roomType')}
              </th>
              <th onClick={() => handleSort('floor')} className="sortable">
                {t('rooms.floor')} {getSortIcon('floor')}
              </th>
              <th onClick={() => handleSort('status')} className="sortable">
                {t('common.status')} {getSortIcon('status')}
              </th>
              <th onClick={() => handleSort('price')} className="sortable">
                {t('rooms.price')} {getSortIcon('price')}
              </th>
              <th onClick={() => handleSort('capacity')} className="sortable">
                {t('rooms.capacity')} {getSortIcon('capacity')}
              </th>
              <th onClick={() => handleSort('lastCleaned')} className="sortable">
                {t('rooms.lastCleaned')} {getSortIcon('lastCleaned')}
              </th>
              <th onClick={() => handleSort('nextCleaning')} className="sortable">
                {t('rooms.nextCleaning')} {getSortIcon('nextCleaning')}
              </th>
              <th>{t('common.actions')}</th>
            </tr>
          </thead>
          <tbody>
            {currentRooms.map((room) => (
              <tr key={room.id}>
                <td className="room-number">{room.roomNumber}</td>
                <td className="room-type">{t(`rooms.types.${room.roomType}`)}</td>
                <td className="floor">{room.floor}</td>
                <td className="status-cell">
                  {getStatusBadge(room.status)}
                </td>
                <td className="price"><CurrencyDisplay amount={room.price} /></td>
                <td className="capacity">
                  {room.capacity} {room.capacity === 1 ? t('rooms.person') : t('rooms.people')}
                </td>
                <td className="last-cleaned check-in">{formatDate(room.lastCleaned)}</td>
                <td className="next-cleaning check-out">{formatDate(room.nextCleaning)}</td>
                <td className="actions-cell">
                  <div className="rooms-table-action-buttons">
                    <button
                      onClick={() => onViewDetails(room)}
                      className="rooms-table-action-btn action-btn view-btn"
                      title={t('rooms.viewDetails')}
                    >
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M1 12S5 4 12 4S23 12 23 12S19 20 12 20S1 12 1 12Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                        <circle cx="12" cy="12" r="3" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                      </svg>
                    </button>
                    <button
                      onClick={() => onEdit(room)}
                      className="rooms-table-action-btn action-btn edit-btn"
                      title={t('common.edit')}
                    >
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M11 4H4C3.46957 4 2.96086 4.21071 2.58579 4.58579C2.21071 4.96086 2 5.46957 2 6V20C2 20.5304 2.21071 21.0391 2.58579 21.4142C2.96086 21.7893 3.46957 22 4 22H18C18.5304 22 19.0391 21.7893 19.4142 21.4142C19.7893 21.0391 20 20.5304 20 20V13" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                        <path d="M18.5 2.5C18.8978 2.10217 19.4374 1.87868 20 1.87868C20.5626 1.87868 21.1022 2.10217 21.5 2.5C21.8978 2.89782 22.1213 3.43739 22.1213 4C22.1213 4.56261 21.8978 5.10217 21.5 5.5L12 15L8 16L9 12L18.5 2.5Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                      </svg>
                    </button>
                    <button
                      onClick={() => handleDelete(room.id)}
                      className="rooms-table-action-btn action-btn delete-btn"
                      title={t('common.delete')}
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

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="rooms-table-pagination">
          <button
            onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
            disabled={currentPage === 1}
            className="rooms-table-pagination-btn"
          >
            {t('common.previous')}
          </button>
          <span className="rooms-table-pagination-info pagination-info">
            {t('common.page')} {currentPage} {t('common.of')} {totalPages}
          </span>
          <button
            onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
            disabled={currentPage === totalPages}
            className="rooms-table-pagination-btn"
          >
            {t('common.next')}
          </button>
        </div>
      )}
    </div>
  );
};

export default RoomTable;
