import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import type { Guest } from '../types/guest.types';
import CurrencyDisplay from '../../../components/CurrencyDisplay';
import { formatShortDate } from '../../../utils/dateUtils';
import './GuestTable.css';

interface GuestTableProps {
  guests: Guest[];
  onEdit: (guest: Guest) => void;
  onViewProfile: (guest: Guest) => void;
  onDelete: (id: string) => void;
  className?: string;
}

type SortField = 'firstName' | 'email' | 'country' | 'totalStays' | 'totalSpent' | 'lastVisit';
type SortDirection = 'asc' | 'desc';

const GuestTable: React.FC<GuestTableProps> = ({
  guests,
  onEdit,
  onViewProfile,
  onDelete,
  className = ''
}) => {
  const { t, i18n } = useTranslation();
  const [currentPage, setCurrentPage] = useState(1);
  const [sortField, setSortField] = useState<SortField>('firstName');
  const [sortDirection, setSortDirection] = useState<SortDirection>('asc');
  const itemsPerPage = 10;

  const getStatusBadge = (isActive: boolean) => {
    const statusConfig = {
      true: { label: t('guests.active'), className: 'status-active' },
      false: { label: t('guests.inactive'), className: 'status-inactive' }
    };

    const config = statusConfig[isActive.toString() as keyof typeof statusConfig];
    return (
      <span className={`status-badge ${config.className}`}>
        {config.label}
      </span>
    );
  };

  const formatDateLocal = (dateString: string) => {
    return formatShortDate(dateString, i18n.language);
  };


  const handleSort = (field: SortField) => {
    if (sortField === field) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortDirection('asc');
    }
  };

  const handleDelete = (id: string) => {
    if (window.confirm(t('guests.confirmDelete'))) {
      onDelete(id);
    }
  };

  // Sort guests
  const sortedGuests = [...guests].sort((a, b) => {
    let aValue: any = a[sortField];
    let bValue: any = b[sortField];

    if (sortField === 'firstName') {
      aValue = `${a.firstName} ${a.lastName}`;
      bValue = `${b.firstName} ${b.lastName}`;
    }

    if (typeof aValue === 'string') {
      aValue = aValue.toLowerCase();
      bValue = bValue.toLowerCase();
    }

    if (aValue < bValue) return sortDirection === 'asc' ? -1 : 1;
    if (aValue > bValue) return sortDirection === 'asc' ? 1 : -1;
    return 0;
  });

  // Pagination
  const totalPages = Math.ceil(sortedGuests.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentGuests = sortedGuests.slice(startIndex, endIndex);

  const SortIcon = ({ field }: { field: SortField }) => {
    if (sortField !== field) {
      return (
        <svg width="12" height="12" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M7 10L12 15L17 10" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
      );
    }
    return (
      <svg width="12" height="12" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d={sortDirection === 'asc' ? "M7 14L12 9L17 14" : "M7 10L12 15L17 10"} stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
      </svg>
    );
  };

  return (
    <div className={`guest-table-container ${className}`}>
      <div className="table-wrapper">
        <table className="guest-table">
          <thead>
            <tr>
              <th onClick={() => handleSort('firstName')} className="sortable">
                {t('guests.guestName')}
                <SortIcon field="firstName" />
              </th>
              <th>{t('guests.email')}</th>
              <th>{t('guests.phone')}</th>
              <th onClick={() => handleSort('country')} className="sortable">
                {t('guests.country')}
                <SortIcon field="country" />
              </th>
              <th onClick={() => handleSort('totalStays')} className="sortable">
                {t('guests.totalStays')}
                <SortIcon field="totalStays" />
              </th>
              <th onClick={() => handleSort('totalSpent')} className="sortable">
                {t('guests.totalSpent')}
                <SortIcon field="totalSpent" />
              </th>
              <th onClick={() => handleSort('lastVisit')} className="sortable">
                {t('guests.lastVisit')}
                <SortIcon field="lastVisit" />
              </th>
              <th>{t('common.status')}</th>
              <th>{t('common.actions')}</th>
            </tr>
          </thead>
          <tbody>
            {currentGuests.map((guest) => (
              <tr key={guest.id}>
                <td className="guest-name">
                  {guest.firstName} {guest.lastName}
                </td>
                <td className="email">{guest.email}</td>
                <td className="phone">{guest.phone}</td>
                <td className="country">{guest.country}</td>
                <td className="total-stays">{guest.totalStays}</td>
                <td className="total-spent"><CurrencyDisplay amount={guest.totalSpent} /></td>
                <td className="last-visit">{formatDateLocal(guest.lastVisit)}</td>
                <td className="status-cell">
                  {getStatusBadge(guest.isActive)}
                </td>
                <td className="actions-cell">
                  <div className="action-buttons">
                    <button
                      onClick={() => onEdit(guest)}
                      className="action-btn edit-btn"
                      title={t('guests.editGuest')}
                    >
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M11 4H4C3.46957 4 2.96086 4.21071 2.58579 4.58579C2.21071 4.96086 2 5.46957 2 6V20C2 20.5304 2.21071 21.0391 2.58579 21.4142C2.96086 21.7893 3.46957 22 4 22H18C18.5304 22 19.0391 21.7893 19.4142 21.4142C19.7893 21.0391 20 20.5304 20 20V13" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                        <path d="M18.5 2.5C18.8978 2.10217 19.4374 1.87868 20 1.87868C20.5626 1.87868 21.1022 2.10217 21.5 2.5C21.8978 2.89782 22.1213 3.43739 22.1213 4C22.1213 4.56261 21.8978 5.10217 21.5 5.5L12 15L8 16L9 12L18.5 2.5Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                      </svg>
                    </button>
                    <button
                      onClick={() => onViewProfile(guest)}
                      className="action-btn view-btn"
                      title={t('guests.viewProfile')}
                    >
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M1 12S5 4 12 4S23 12 23 12S19 20 12 20S1 12 1 12Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                        <circle cx="12" cy="12" r="3" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                      </svg>
                    </button>
                    <button
                      onClick={() => handleDelete(guest.id)}
                      className="action-btn delete-btn"
                      title={t('guests.deleteGuest')}
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
        <div className="pagination">
          <button
            onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
            disabled={currentPage === 1}
            className="pagination-btn"
          >
            {t('guests.previous')}
          </button>
          <span className="pagination-info">
            {t('guests.pageInfo', { current: currentPage, total: totalPages })}
          </span>
          <button
            onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
            disabled={currentPage === totalPages}
            className="pagination-btn"
          >
            {t('guests.next')}
          </button>
        </div>
      )}
    </div>
  );
};

export default GuestTable;
