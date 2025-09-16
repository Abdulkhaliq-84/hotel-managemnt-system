import type { Room as FrontendRoom } from '../types/room.types';
import type { Room as BackendRoom, CreateRoomDto } from '../../../services/api';

/**
 * Maps backend room data to frontend room format
 * The frontend expects additional fields that the backend doesn't provide
 */
export const mapBackendToFrontendRoom = (backendRoom: BackendRoom): FrontendRoom => {
  // Extract floor number from room number (e.g., "101" -> floor 1, "205" -> floor 2)
  const floor = Math.floor(parseInt(backendRoom.roomNumber) / 100) || 1;
  
  // Determine room status based on availability
  const status = backendRoom.isAvailable ? 'available' : 'occupied';
  
  // Map room type to frontend format (ensure it matches the union type)
  const roomType = mapRoomType(backendRoom.roomType);
  
  // Generate default amenities based on room type
  const amenities = generateAmenities(roomType);
  
  // Calculate capacity based on room type
  const capacity = calculateCapacity(roomType);
  
  return {
    id: backendRoom.id.toString(),
    roomNumber: backendRoom.roomNumber,
    roomType,
    floor,
    status,
    price: backendRoom.pricePerNight,
    capacity,
    amenities,
    description: backendRoom.description || `Comfortable ${roomType} room`,
    lastCleaned: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString(), // Default: 1 day ago
    nextCleaning: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(), // Default: tomorrow
    isActive: true, // Default to active
    createdAt: backendRoom.createdAt,
    updatedAt: backendRoom.createdAt // Backend doesn't have updatedAt
  };
};

/**
 * Maps frontend room data to backend format for creating/updating
 */
export const mapFrontendToBackendRoom = (frontendRoom: Partial<FrontendRoom>): CreateRoomDto => {
  return {
    roomNumber: frontendRoom.roomNumber || '',
    roomType: frontendRoom.roomType || 'single',
    pricePerNight: frontendRoom.price || 0,
    description: frontendRoom.description,
    isAvailable: frontendRoom.status === 'available'
  };
};

/**
 * Maps room type string to ensure it matches frontend union type
 */
const mapRoomType = (type: string): FrontendRoom['roomType'] => {
  const normalizedType = type.toLowerCase();
  switch (normalizedType) {
    case 'single':
      return 'single';
    case 'double':
      return 'double';
    case 'suite':
      return 'suite';
    case 'deluxe':
      return 'deluxe';
    default:
      // If the type doesn't match, default to 'single'
      return 'single';
  }
};

/**
 * Generates default amenities based on room type
 */
const generateAmenities = (roomType: FrontendRoom['roomType']): string[] => {
  const baseAmenities = ['Wi-Fi', 'TV', 'Air Conditioning'];
  
  switch (roomType) {
    case 'single':
      return [...baseAmenities, 'Coffee Maker'];
    case 'double':
      return [...baseAmenities, 'Mini Bar', 'Coffee Maker'];
    case 'deluxe':
      return [...baseAmenities, 'Mini Bar', 'Coffee Maker', 'Room Service', 'Balcony'];
    case 'suite':
      return [...baseAmenities, 'Mini Bar', 'Coffee Maker', 'Room Service', 'Jacuzzi', 'Kitchen', 'Living Room'];
    default:
      return baseAmenities;
  }
};

/**
 * Calculates room capacity based on room type
 */
const calculateCapacity = (roomType: FrontendRoom['roomType']): number => {
  switch (roomType) {
    case 'single':
      return 1;
    case 'double':
      return 2;
    case 'deluxe':
      return 3;
    case 'suite':
      return 4;
    default:
      return 2;
  }
};

/**
 * Updates room status in frontend format
 */
export const updateRoomStatus = (room: FrontendRoom, isAvailable: boolean): FrontendRoom => {
  return {
    ...room,
    status: isAvailable ? 'available' : 'occupied',
    updatedAt: new Date().toISOString()
  };
};
