import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import {
  GuestStats,
  GuestSearch,
  GuestTable,
  GuestForm,
  GuestProfile
} from '../index';
import type { Guest, GuestSearchFilters as Filters, GuestStats as Stats } from '../types/guest.types';
import { apiService } from '../../../services/api';
import { mapBackendToFrontendGuest, mapFrontendToBackendGuest } from '../utils/guestAdapter';
import { useToast } from '../../../hooks/useToast';
import ToastContainer from '../../../components/ToastContainer';
import './GuestPage.css';

const GuestPage: React.FC = () => {
  const { t } = useTranslation();
  const [guests, setGuests] = useState<Guest[]>([]);
  const [filteredGuests, setFilteredGuests] = useState<Guest[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [showProfile, setShowProfile] = useState(false);
  const [editingGuest, setEditingGuest] = useState<Guest | undefined>();
  const [viewingGuest, setViewingGuest] = useState<Guest | undefined>();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { toasts, removeToast, success, error: showError, info } = useToast();

  // Load guests from API on component mount
  useEffect(() => {
    const loadGuests = async () => {
      try {
        setLoading(true);
        setError(null);
        
        const backendGuests = await apiService.getGuests();
        const frontendGuests = backendGuests.map(mapBackendToFrontendGuest);
        
        setGuests(frontendGuests);
        setFilteredGuests(frontendGuests);
        
        // Show info if no guests found
        if (frontendGuests.length === 0) {
          info(t('guests.noGuests'), t('guests.noGuestsMessage'));
        }
      } catch (err) {
        const errorMessage = err instanceof Error ? err.message : t('guests.loadFailed');
        setError(errorMessage);
        showError(t('guests.loadFailedTitle'), errorMessage);
        console.error('Error loading guests:', err);
        
        // Set empty arrays on error
        setGuests([]);
        setFilteredGuests([]);
      } finally {
        setLoading(false);
      }
    };

    loadGuests();
  }, [info, showError]);

  // Update filtered guests when guests change
  useEffect(() => {
    setFilteredGuests(guests);
  }, [guests]);

  // Calculate stats
  const stats: Stats = {
    total: guests.length,
    active: guests.filter(g => g.isActive).length,
    newThisMonth: guests.filter(g => {
      const createdAt = new Date(g.createdAt);
      const now = new Date();
      return createdAt.getMonth() === now.getMonth() && createdAt.getFullYear() === now.getFullYear();
    }).length,
    repeatGuests: Math.round((guests.filter(g => g.totalStays > 1).length / guests.length) * 100),
    averageRating: 4.7
  };

  const handleFiltersChange = (filters: Filters) => {
    let filtered = [...guests];

    if (filters.name) {
      filtered = filtered.filter(g => 
        `${g.firstName} ${g.lastName}`.toLowerCase().includes(filters.name.toLowerCase())
      );
    }

    if (filters.email) {
      filtered = filtered.filter(g => 
        g.email.toLowerCase().includes(filters.email.toLowerCase())
      );
    }

    if (filters.phone) {
      filtered = filtered.filter(g => 
        g.phone.includes(filters.phone)
      );
    }

    if (filters.isActive !== null) {
      filtered = filtered.filter(g => g.isActive === filters.isActive);
    }

    if (filters.dateRange.start) {
      filtered = filtered.filter(g => g.lastVisit >= filters.dateRange.start);
    }

    if (filters.dateRange.end) {
      filtered = filtered.filter(g => g.lastVisit <= filters.dateRange.end);
    }

    setFilteredGuests(filtered);
  };

  const handleEdit = (guest: Guest) => {
    setEditingGuest(guest);
    setShowForm(true);
  };

  const handleViewProfile = (guest: Guest) => {
    setViewingGuest(guest);
    setShowProfile(true);
  };

  const handleDelete = async (id: string) => {
    try {
      await apiService.deleteGuest(parseInt(id));
      setGuests(prev => prev.filter(g => g.id !== id));
      setFilteredGuests(prev => prev.filter(g => g.id !== id));
      success(t('guests.deleteSuccess'), t('guests.deleteSuccessMessage'));
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : t('guests.deleteFailed');
      showError(t('guests.deleteFailedTitle'), errorMessage);
      console.error('Error deleting guest:', err);
    }
  };

  const handleSave = async (guestData: Omit<Guest, 'id' | 'totalStays' | 'totalSpent' | 'lastVisit' | 'createdAt' | 'updatedAt'>) => {
    try {
      const backendGuestData = mapFrontendToBackendGuest(guestData);
      
      if (editingGuest) {
        // Update existing guest
        await apiService.updateGuest(parseInt(editingGuest.id), backendGuestData);
        
        // Update local state
        const updatedGuest = { ...editingGuest, ...guestData, updatedAt: new Date().toISOString() };
        const updatedGuests = guests.map(g => 
          g.id === editingGuest.id ? updatedGuest : g
        );
        setGuests(updatedGuests);
        setFilteredGuests(updatedGuests);
        
        success(t('guests.updateSuccess'), t('guests.updateSuccessMessage'));
      } else {
        // Create new guest
        const createdGuest = await apiService.createGuest(backendGuestData);
        const newFrontendGuest = mapBackendToFrontendGuest(createdGuest);
        
        // Override with the form data to keep the user's input
        const finalGuest: Guest = {
          ...newFrontendGuest,
          ...guestData,
          id: createdGuest.id.toString(),
          createdAt: createdGuest.createdAt,
          updatedAt: createdGuest.createdAt
        };
        
        setGuests(prev => [...prev, finalGuest]);
        setFilteredGuests(prev => [...prev, finalGuest]);
        
        success(t('guests.createSuccess'), t('guests.createSuccessMessage'));
      }
      
      setShowForm(false);
      setEditingGuest(undefined);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : t('guests.saveFailed');
      showError(t('guests.saveFailedTitle'), errorMessage);
      console.error('Error saving guest:', err);
    }
  };

  const handleCancel = () => {
    setShowForm(false);
    setEditingGuest(undefined);
  };

  const handleCloseProfile = () => {
    setShowProfile(false);
    setViewingGuest(undefined);
  };

  const handleNewGuest = () => {
    setEditingGuest(undefined);
    setShowForm(true);
  };

  const handleExport = () => {
    // Export functionality - in real app this would generate CSV/PDF
    console.log('Exporting guests:', filteredGuests);
    alert(t('guests.exportMessage'));
  };

  // Show loading state
  if (loading) {
    return (
      <div className="guest-page">
        <div className="page-header">
          <h1 className="page-title">{t('guests.title')}</h1>
        </div>
        <div style={{ padding: '40px', textAlign: 'center' }}>
          <p>{t('guests.loadingGuests')}</p>
        </div>
      </div>
    );
  }

  // Show error state
  if (error && guests.length === 0) {
    return (
      <div className="guest-page">
        <div className="page-header">
          <h1 className="page-title">{t('guests.title')}</h1>
        </div>
        <div style={{ padding: '40px', textAlign: 'center', color: '#dc3545' }}>
          <p>{t('common.error')}: {error}</p>
          <button 
            onClick={() => window.location.reload()} 
            style={{ marginTop: '20px', padding: '8px 16px', cursor: 'pointer' }}
          >
            {t('common.retry')}
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="guest-page">
      <ToastContainer toasts={toasts} onRemoveToast={removeToast} />
      
      <div className="page-header">
        <h1 className="page-title">{t('guests.title')}</h1>
        <button onClick={handleNewGuest} className="new-guest-btn">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M12 5V19" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            <path d="M5 12H19" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
          {t('guests.addGuest')}
        </button>
      </div>

      <GuestStats stats={stats} />

      <GuestSearch 
        onFiltersChange={handleFiltersChange}
        onExport={handleExport}
      />

      <div className="full-width-table-section">
        <GuestTable
          guests={filteredGuests}
          onEdit={handleEdit}
          onViewProfile={handleViewProfile}
          onDelete={handleDelete}
        />
      </div>

      {showForm && (
        <GuestForm
          guest={editingGuest}
          onSave={handleSave}
          onCancel={handleCancel}
        />
      )}

      {showProfile && viewingGuest && (
        <GuestProfile
          guest={viewingGuest}
          onEdit={handleEdit}
          onClose={handleCloseProfile}
        />
      )}
    </div>
  );
};

export default GuestPage;
