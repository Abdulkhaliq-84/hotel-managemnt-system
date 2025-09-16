import React, { useState } from 'react';
import type { Room } from '../types/room.types';
import './RoomAvailability.css';

interface RoomAvailabilityProps {
  rooms: Room[];
  onClose: () => void;
  onStatusUpdate?: (roomId: string, status: Room['status']) => void;
  className?: string;
}

interface AvailabilityFilter {
  roomType: string;
  floor: number | null;
  dateRange: {
    start: string;
    end: string;
  };
}


const RoomAvailability: React.FC<RoomAvailabilityProps> = ({
  rooms,
  onClose,
  onStatusUpdate,
  className = ''
}) => {
  const [filter, setFilter] = useState<AvailabilityFilter>({
    roomType: '',
    floor: null,
    dateRange: {
      start: new Date().toISOString().split('T')[0],
      end: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0]
    }
  });

  const [selectedRoom, setSelectedRoom] = useState<Room | null>(null);

  const roomTypes = [
    { value: '', label: 'All Room Types' },
    { value: 'single', label: 'Single Room' },
    { value: 'double', label: 'Double Room' },
    { value: 'suite', label: 'Suite' },
    { value: 'deluxe', label: 'Deluxe Room' }
  ];

  const floors = [
    { value: null, label: 'All Floors' },
    { value: 1, label: 'Floor 1' },
    { value: 2, label: 'Floor 2' },
    { value: 3, label: 'Floor 3' },
    { value: 4, label: 'Floor 4' },
    { value: 5, label: 'Floor 5' }
  ];

  const statusOptions = [
    { value: 'available', label: 'Available' },
    { value: 'occupied', label: 'Occupied' },
    { value: 'maintenance', label: 'Maintenance' },
    { value: 'cleaning', label: 'Cleaning' },
    { value: 'reserved', label: 'Reserved' }
  ];

  // Generate date range for calendar
  const generateDateRange = () => {
    const dates: string[] = [];
    const startDate = new Date(filter.dateRange.start);
    const endDate = new Date(filter.dateRange.end);
    
    for (let d = new Date(startDate); d <= endDate; d.setDate(d.getDate() + 1)) {
      dates.push(d.toISOString().split('T')[0]);
    }
    
    return dates;
  };

  // Filter rooms based on current filter
  const getFilteredRooms = () => {
    let filtered = [...rooms];

    if (filter.roomType) {
      filtered = filtered.filter(room => room.roomType === filter.roomType);
    }

    if (filter.floor !== null) {
      filtered = filtered.filter(room => room.floor === filter.floor);
    }

    return filtered;
  };

  const filteredRooms = getFilteredRooms();
  const dateRange = generateDateRange();

  // Calculate occupancy statistics
  const calculateOccupancyStats = () => {
    const totalRooms = filteredRooms.length;
    const occupiedRooms = filteredRooms.filter(room => room.status === 'occupied').length;
    const availableRooms = filteredRooms.filter(room => room.status === 'available').length;
    const maintenanceRooms = filteredRooms.filter(room => room.status === 'maintenance').length;
    const cleaningRooms = filteredRooms.filter(room => room.status === 'cleaning').length;
    const reservedRooms = filteredRooms.filter(room => room.status === 'reserved').length;

    return {
      total: totalRooms,
      occupied: occupiedRooms,
      available: availableRooms,
      maintenance: maintenanceRooms,
      cleaning: cleaningRooms,
      reserved: reservedRooms,
      occupancyRate: totalRooms > 0 ? Math.round((occupiedRooms / totalRooms) * 100) : 0
    };
  };

  const stats = calculateOccupancyStats();

  const getStatusColor = (status: Room['status']) => {
    const colors = {
      'available': '#10b981',
      'occupied': '#ef4444',
      'maintenance': '#f59e0b',
      'cleaning': '#3b82f6',
      'reserved': '#8b5cf6'
    };
    return colors[status];
  };

  const getStatusLabel = (status: Room['status']) => {
    const labels = {
      'available': 'Available',
      'occupied': 'Occupied',
      'maintenance': 'Maintenance',
      'cleaning': 'Cleaning',
      'reserved': 'Reserved'
    };
    return labels[status];
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      weekday: 'short',
      month: 'short',
      day: 'numeric'
    });
  };

  const handleStatusUpdate = (roomId: string, newStatus: Room['status']) => {
    if (onStatusUpdate) {
      onStatusUpdate(roomId, newStatus);
    }
    setSelectedRoom(null);
  };

  const handleFilterChange = (key: keyof AvailabilityFilter, value: any) => {
    setFilter(prev => ({ ...prev, [key]: value }));
  };

  const handleDateRangeChange = (type: 'start' | 'end', value: string) => {
    setFilter(prev => ({
      ...prev,
      dateRange: { ...prev.dateRange, [type]: value }
    }));
  };

  return (
    <div className={`rooms-availability-container ${className}`}>
      <div className="rooms-availability-wrapper">
        <div className="rooms-availability-header">
          <h2 className="rooms-availability-title">Room Availability</h2>
          <button onClick={onClose} className="rooms-availability-close-btn">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M18 6L6 18" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              <path d="M6 6L18 18" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </button>
        </div>

        <div className="rooms-availability-content">
          {/* Filters */}
          <div className="rooms-availability-filters">
            <div className="rooms-availability-filter-group">
              <label className="rooms-availability-filter-label">Room Type</label>
              <select
                value={filter.roomType}
                onChange={(e) => handleFilterChange('roomType', e.target.value)}
                className="rooms-availability-filter-select"
              >
                {roomTypes.map(type => (
                  <option key={type.value} value={type.value}>
                    {type.label}
                  </option>
                ))}
              </select>
            </div>

            <div className="rooms-availability-filter-group">
              <label className="rooms-availability-filter-label">Floor</label>
              <select
                value={filter.floor || ''}
                onChange={(e) => handleFilterChange('floor', e.target.value ? parseInt(e.target.value) : null)}
                className="rooms-availability-filter-select"
              >
                {floors.map(floor => (
                  <option key={floor.value || 'all'} value={floor.value || ''}>
                    {floor.label}
                  </option>
                ))}
              </select>
            </div>

            <div className="rooms-availability-filter-group">
              <label className="rooms-availability-filter-label">Start Date</label>
              <input
                type="date"
                value={filter.dateRange.start}
                onChange={(e) => handleDateRangeChange('start', e.target.value)}
                className="rooms-availability-filter-input"
              />
            </div>

            <div className="rooms-availability-filter-group">
              <label className="rooms-availability-filter-label">End Date</label>
              <input
                type="date"
                value={filter.dateRange.end}
                onChange={(e) => handleDateRangeChange('end', e.target.value)}
                className="rooms-availability-filter-input"
              />
            </div>
          </div>

          {/* Statistics */}
          <div className="rooms-availability-stats">
            <div className="rooms-availability-stat-item">
              <span className="rooms-availability-stat-label">Total Rooms</span>
              <span className="rooms-availability-stat-value">{stats.total}</span>
            </div>
            <div className="rooms-availability-stat-item">
              <span className="rooms-availability-stat-label">Available</span>
              <span className="rooms-availability-stat-value available">{stats.available}</span>
            </div>
            <div className="rooms-availability-stat-item">
              <span className="rooms-availability-stat-label">Occupied</span>
              <span className="rooms-availability-stat-value occupied">{stats.occupied}</span>
            </div>
            <div className="rooms-availability-stat-item">
              <span className="rooms-availability-stat-label">Maintenance</span>
              <span className="rooms-availability-stat-value maintenance">{stats.maintenance}</span>
            </div>
            <div className="rooms-availability-stat-item">
              <span className="rooms-availability-stat-label">Cleaning</span>
              <span className="rooms-availability-stat-value cleaning">{stats.cleaning}</span>
            </div>
            <div className="rooms-availability-stat-item">
              <span className="rooms-availability-stat-label">Reserved</span>
              <span className="rooms-availability-stat-value reserved">{stats.reserved}</span>
            </div>
            <div className="rooms-availability-stat-item">
              <span className="rooms-availability-stat-label">Occupancy Rate</span>
              <span className="rooms-availability-stat-value occupancy-rate">{stats.occupancyRate}%</span>
            </div>
          </div>

          {/* Availability Grid */}
          <div className="rooms-availability-grid-container">
            <div className="rooms-availability-grid">
              {/* Header Row */}
              <div className="rooms-availability-grid-header">
                <div className="rooms-availability-room-header">Room</div>
                {dateRange.map(date => (
                  <div key={date} className="rooms-availability-date-header">
                    {formatDate(date)}
                  </div>
                ))}
              </div>

              {/* Room Rows */}
              {filteredRooms.map(room => (
                <div key={room.id} className="rooms-availability-room-row">
                  <div className="rooms-availability-room-info">
                    <div className="rooms-availability-room-number">{room.roomNumber}</div>
                    <div className="rooms-availability-room-type">{room.roomType}</div>
                    <div className="rooms-availability-room-floor">Floor {room.floor}</div>
                  </div>
                  
                  {dateRange.map(date => (
                    <div key={date} className="rooms-availability-cell">
                      <div
                        className="rooms-availability-status-indicator"
                        style={{ backgroundColor: getStatusColor(room.status) }}
                        onClick={() => setSelectedRoom(room)}
                        title={`${room.roomNumber} - ${getStatusLabel(room.status)}`}
                      >
                        <span className="rooms-availability-status-label">
                          {getStatusLabel(room.status)}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              ))}
            </div>
          </div>

          {/* Legend */}
          <div className="rooms-availability-legend">
            <h3 className="rooms-availability-legend-title">Status Legend</h3>
            <div className="rooms-availability-legend-items">
              {statusOptions.map(status => (
                <div key={status.value} className="rooms-availability-legend-item">
                  <div
                    className="rooms-availability-legend-color"
                    style={{ backgroundColor: getStatusColor(status.value as Room['status']) }}
                  ></div>
                  <span className="rooms-availability-legend-label">{status.label}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Status Update Modal */}
        {selectedRoom && (
          <div className="rooms-availability-modal">
            <div className="rooms-availability-modal-content">
              <h3 className="rooms-availability-modal-title">
                Update Status - Room {selectedRoom.roomNumber}
              </h3>
              <p className="rooms-availability-modal-subtitle">
                Current Status: {getStatusLabel(selectedRoom.status)}
              </p>
              
              <div className="rooms-availability-status-options">
                {statusOptions.map(status => (
                  <button
                    key={status.value}
                    onClick={() => handleStatusUpdate(selectedRoom.id, status.value as Room['status'])}
                    className={`rooms-availability-status-option ${
                      selectedRoom.status === status.value ? 'active' : ''
                    }`}
                    style={{
                      borderColor: getStatusColor(status.value as Room['status'])
                    }}
                  >
                    <div
                      className="rooms-availability-status-option-color"
                      style={{ backgroundColor: getStatusColor(status.value as Room['status']) }}
                    ></div>
                    {status.label}
                  </button>
                ))}
              </div>
              
              <div className="rooms-availability-modal-actions">
                <button
                  onClick={() => setSelectedRoom(null)}
                  className="rooms-availability-modal-cancel-btn"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        )}

        <div className="rooms-availability-actions">
          <button onClick={onClose} className="rooms-availability-close-action-btn">
            Close
          </button>
        </div>
      </div>
    </div>
  );
};

export default RoomAvailability;
