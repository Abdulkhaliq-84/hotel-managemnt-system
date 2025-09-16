import type { Guest as FrontendGuest } from '../types/guest.types';
import type { Guest as BackendGuest } from '../../../services/api';

/**
 * Maps backend guest data to frontend guest format
 * The frontend expects additional fields that aren't provided by the backend,
 * so we'll generate reasonable defaults for them
 */
export const mapBackendToFrontendGuest = (backendGuest: BackendGuest): FrontendGuest => {
  // Extract first and last name from the full name
  const nameParts = backendGuest.name.trim().split(' ');
  const firstName = nameParts[0] || '';
  const lastName = nameParts.slice(1).join(' ') || '';
  
  return {
    id: backendGuest.id.toString(),
    firstName,
    lastName,
    email: backendGuest.email,
    phone: backendGuest.phone,
    dateOfBirth: undefined, // Backend doesn't provide this
    country: 'Not specified', // Backend doesn't provide this
    totalStays: 0, // Would need to be calculated from reservations
    totalSpent: 0, // Would need to be calculated from reservations
    lastVisit: new Date().toISOString().split('T')[0], // Would need to be fetched from reservations
    isActive: true, // Default to active since backend doesn't track this
    preferences: {
      roomType: 'double' as const, // Default preference
      floor: 'any' as const, // Default preference
      smoking: false, // Default preference
      specialRequests: [] // Default empty
    },
    createdAt: backendGuest.createdAt,
    updatedAt: backendGuest.createdAt // Backend doesn't have updatedAt, use createdAt
  };
};

/**
 * Maps frontend guest data to backend format for creating/updating
 */
export const mapFrontendToBackendGuest = (frontendGuest: Partial<FrontendGuest>): { name: string; email: string; phone: string } => {
  const name = `${frontendGuest.firstName || ''} ${frontendGuest.lastName || ''}`.trim();
  
  return {
    name: name || 'Guest',
    email: frontendGuest.email || '',
    phone: frontendGuest.phone || ''
  };
};

/**
 * Enriches guest data with reservation statistics if needed
 * This would be called after fetching reservation data for a guest
 */
export const enrichGuestWithStats = (
  guest: FrontendGuest, 
  stats?: { totalStays: number; totalSpent: number; lastVisit: string }
): FrontendGuest => {
  if (!stats) return guest;
  
  return {
    ...guest,
    totalStays: stats.totalStays,
    totalSpent: stats.totalSpent,
    lastVisit: stats.lastVisit
  };
};
