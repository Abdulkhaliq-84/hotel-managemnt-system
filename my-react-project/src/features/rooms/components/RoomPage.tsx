import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import RoomStats from './RoomStats';
import RoomSearch from './RoomSearch';
import RoomTable from './RoomTable';
import RoomForm from './RoomForm';
import RoomDetails from './RoomDetails';
import RoomAvailability from './RoomAvailability';
import type { Room, RoomSearchFilters as Filters, RoomStats as Stats } from '../types/room.types';
import { apiService } from '../../../services/api';
import { mapBackendToFrontendRoom, mapFrontendToBackendRoom } from '../utils/roomAdapter';
import { useToast } from '../../../hooks/useToast';
import ToastContainer from '../../../components/ToastContainer';
import './RoomPage.css';

const RoomPage: React.FC = () => {
  const { t } = useTranslation();
  const [rooms, setRooms] = useState<Room[]>([]);
  const [filteredRooms, setFilteredRooms] = useState<Room[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [showDetails, setShowDetails] = useState(false);
  const [showAvailability, setShowAvailability] = useState(false);
  const [editingRoom, setEditingRoom] = useState<Room | undefined>();
  const [viewingRoom, setViewingRoom] = useState<Room | undefined>();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { toasts, removeToast, success, error: showError, info } = useToast();

  // Load rooms from API on component mount
  useEffect(() => {
    const loadRooms = async () => {
      try {
        setLoading(true);
        setError(null);
        
        const backendRooms = await apiService.getRooms();
        const frontendRooms = backendRooms.map(mapBackendToFrontendRoom);
        
        setRooms(frontendRooms);
        setFilteredRooms(frontendRooms);
        
        // Show info if no rooms found
        if (frontendRooms.length === 0) {
          info(t('rooms.noRooms'), t('rooms.noRoomsMessage'));
        }
      } catch (err) {
        const errorMessage = err instanceof Error ? err.message : t('rooms.loadFailed');
        setError(errorMessage);
        showError(t('common.loadFailed'), errorMessage);
        console.error('Error loading rooms:', err);
        
        // Set empty arrays on error
        setRooms([]);
        setFilteredRooms([]);
      } finally {
        setLoading(false);
      }
    };

    loadRooms();
  }, [info, showError]);

  // Update filtered rooms when rooms change
  useEffect(() => {
    setFilteredRooms(rooms);
  }, [rooms]);

  // Calculate stats
  const stats: Stats = {
    total: rooms.length,
    available: rooms.filter(r => r.status === 'available').length,
    occupied: rooms.filter(r => r.status === 'occupied').length,
    maintenance: rooms.filter(r => r.status === 'maintenance').length,
    cleaning: rooms.filter(r => r.status === 'cleaning').length,
    reserved: rooms.filter(r => r.status === 'reserved').length,
    occupancyRate: rooms.length > 0 ? Math.round((rooms.filter(r => r.status === 'occupied').length / rooms.length) * 100) : 0,
    averagePrice: rooms.length > 0 ? Math.round(rooms.reduce((sum, r) => sum + r.price, 0) / rooms.length) : 0
  };

  const handleFiltersChange = (filters: Filters) => {
    let filtered = [...rooms];

    if (filters.roomNumber) {
      filtered = filtered.filter(r => 
        r.roomNumber.toLowerCase().includes(filters.roomNumber.toLowerCase())
      );
    }

    if (filters.roomType) {
      filtered = filtered.filter(r => r.roomType === filters.roomType);
    }

    if (filters.floor !== null) {
      filtered = filtered.filter(r => r.floor === filters.floor);
    }

    if (filters.status) {
      filtered = filtered.filter(r => r.status === filters.status);
    }

    if (filters.priceRange.min > 0) {
      filtered = filtered.filter(r => r.price >= filters.priceRange.min);
    }

    if (filters.priceRange.max > 0) {
      filtered = filtered.filter(r => r.price <= filters.priceRange.max);
    }

    if (filters.capacity !== null) {
      filtered = filtered.filter(r => r.capacity === filters.capacity);
    }

    setFilteredRooms(filtered);
  };

  const handleEdit = (room: Room) => {
    setEditingRoom(room);
    setShowForm(true);
  };

  const handleViewDetails = (room: Room) => {
    setViewingRoom(room);
    setShowDetails(true);
  };

  const handleDelete = async (id: string) => {
    try {
      await apiService.deleteRoom(parseInt(id));
      setRooms(prev => prev.filter(r => r.id !== id));
      setFilteredRooms(prev => prev.filter(r => r.id !== id));
      success(t('rooms.roomDeleted'), t('rooms.roomDeletedMessage'));
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : t('rooms.deleteFailed');
      showError(t('common.deleteFailed'), errorMessage);
      console.error('Error deleting room:', err);
    }
  };

  const handleSave = async (roomData: Omit<Room, 'id' | 'createdAt' | 'updatedAt' | 'lastCleaned' | 'nextCleaning'>) => {
    try {
      const backendRoomData = mapFrontendToBackendRoom(roomData);
      
      if (editingRoom) {
        // Update existing room
        await apiService.updateRoom(parseInt(editingRoom.id), backendRoomData);
        
        // Update local state
        const updatedRoom = { 
          ...editingRoom, 
          ...roomData, 
          updatedAt: new Date().toISOString() 
        };
        const updatedRooms = rooms.map(r => 
          r.id === editingRoom.id ? updatedRoom : r
        );
        setRooms(updatedRooms);
        setFilteredRooms(updatedRooms);
        
        success(t('rooms.roomUpdated'), t('rooms.roomUpdatedMessage'));
      } else {
        // Create new room
        const createdRoom = await apiService.createRoom(backendRoomData);
        const newFrontendRoom = mapBackendToFrontendRoom(createdRoom);
        
        // Override with the form data to keep the user's input for fields not in backend
        const finalRoom: Room = {
          ...newFrontendRoom,
          ...roomData,
          id: createdRoom.id.toString(),
          createdAt: createdRoom.createdAt,
          updatedAt: createdRoom.createdAt,
          lastCleaned: new Date().toISOString(),
          nextCleaning: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString()
        };
        
        setRooms(prev => [...prev, finalRoom]);
        setFilteredRooms(prev => [...prev, finalRoom]);
        
        success(t('rooms.roomCreated'), t('rooms.roomCreatedMessage'));
      }
      
      setShowForm(false);
      setEditingRoom(undefined);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : t('rooms.saveFailed');
      showError(t('common.saveFailed'), errorMessage);
      console.error('Error saving room:', err);
    }
  };

  const handleCancel = () => {
    setShowForm(false);
    setEditingRoom(undefined);
  };

  const handleCloseDetails = () => {
    setShowDetails(false);
    setViewingRoom(undefined);
  };

  const handleCloseAvailability = () => {
    setShowAvailability(false);
  };

  const handleStatusUpdate = (roomId: string, newStatus: Room['status']) => {
    const updatedRooms = rooms.map(room =>
      room.id === roomId
        ? { ...room, status: newStatus, updatedAt: new Date().toISOString() }
        : room
    );
    setRooms(updatedRooms);
    setFilteredRooms(updatedRooms);
  };

  const handleNewRoom = () => {
    setEditingRoom(undefined);
    setShowForm(true);
  };

  const handleExport = () => {
    // Export functionality - in real app this would generate CSV/PDF
    console.log('Exporting rooms:', filteredRooms);
    alert(t('common.exportNotImplemented'));
  };

  const handleCheckAvailability = () => {
    setShowAvailability(true);
  };

  // Show loading state
  if (loading) {
    return (
      <div className="room-page">
        <div className="page-header">
          <h1 className="page-title">{t('rooms.title')}</h1>
        </div>
        <div style={{ padding: '40px', textAlign: 'center' }}>
          <p>{t('rooms.loading')}</p>
        </div>
      </div>
    );
  }

  // Show error state
  if (error && rooms.length === 0) {
    return (
      <div className="room-page">
        <div className="page-header">
          <h1 className="page-title">{t('rooms.title')}</h1>
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
    <div className="room-page">
      <ToastContainer toasts={toasts} onRemoveToast={removeToast} />
      
      <div className="page-header">
        <h1 className="page-title">{t('rooms.title')}</h1>
        <div className="page-actions">
          <button onClick={handleCheckAvailability} className="check-availability-btn">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M8 2V5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              <path d="M16 2V5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              <path d="M3 7.5H21" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              <path d="M3 10C3 8.11438 3 7.17157 3.58579 6.58579C4.17157 6 5.11438 6 7 6H17C18.8856 6 19.8284 6 20.4142 6.58579C21 7.17157 21 8.11438 21 10V17C21 18.8856 21 19.8284 20.4142 20.4142C19.8284 21 18.8856 21 17 21H7C5.11438 21 4.17157 21 3.58579 20.4142C3 19.8284 3 18.8856 3 17V10Z" stroke="currentColor" strokeWidth="2"/>
              <path d="M9 16L11 18L15 14" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
            {t('rooms.checkAvailability')}
          </button>
          <button onClick={handleNewRoom} className="new-room-btn">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M12 5V19" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              <path d="M5 12H19" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
            {t('rooms.addNewRoom')}
          </button>
        </div>
      </div>

      <RoomStats stats={stats} />

      <RoomSearch 
        onFiltersChange={handleFiltersChange}
        onExport={handleExport}
      />

      <div className="full-width-table-section">
        <RoomTable
          rooms={filteredRooms}
          onEdit={handleEdit}
          onViewDetails={handleViewDetails}
          onDelete={handleDelete}
        />
      </div>

      {showForm && (
        <RoomForm
          room={editingRoom}
          onSave={handleSave}
          onCancel={handleCancel}
        />
      )}

      {showDetails && viewingRoom && (
        <RoomDetails
          room={viewingRoom}
          onEdit={handleEdit}
          onClose={handleCloseDetails}
        />
      )}

      {showAvailability && (
        <RoomAvailability
          rooms={rooms}
          onClose={handleCloseAvailability}
          onStatusUpdate={handleStatusUpdate}
        />
      )}
    </div>
  );
};

export default RoomPage;
