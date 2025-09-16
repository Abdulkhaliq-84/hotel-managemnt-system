// Simple API test utility to verify connection
import { apiService } from '../services/api';

export const testApiConnection = async () => {
  try {
    console.log('Testing API connection...');
    console.log('Base URL:', 'http://localhost:5159/api');
    
    // Test getting reservations
    const reservations = await apiService.getReservations();
    console.log('✅ Reservations API working:', reservations.length, 'reservations found');
    
    // Test getting guests
    const guests = await apiService.getGuests();
    console.log('✅ Guests API working:', guests.length, 'guests found');
    
    // Test getting rooms
    const rooms = await apiService.getRooms();
    console.log('✅ Rooms API working:', rooms.length, 'rooms found');
    
    return true;
  } catch (error) {
    console.error('❌ API connection failed:', error);
    return false;
  }
};

// Test function that can be called from browser console
(window as any).testApi = testApiConnection;
