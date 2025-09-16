// API service for communicating with the Hotel Management backend

const API_BASE_URL = 'http://localhost:5159/api';

// Types matching the backend DTOs
export interface Guest {
  id: number;
  name: string;
  email: string;
  phone: string;
  createdAt: string;
}

export interface CreateGuestDto {
  name: string;
  email: string;
  phone: string;
}

export interface Room {
  id: number;
  roomNumber: string;
  roomType: string;
  pricePerNight: number;
  description?: string;
  isAvailable: boolean;
  createdAt: string;
}

export interface RoomAvailability {
  roomId: number;
  roomNumber: string;
  roomType: string;
  pricePerNight: number;
  description: string;
  isAvailable: boolean;
}

export interface CreateRoomDto {
  roomNumber: string;
  roomType: string;
  pricePerNight: number;
  description?: string;
  isAvailable: boolean;
}

export interface Reservation {
  id: number;
  guestId: number;
  roomId: number;
  checkInDate: string;
  checkOutDate: string;
  numberOfGuests: number;
  specialRequests?: string;
  status: 'Pending' | 'Confirmed' | 'CheckedIn' | 'CheckedOut' | 'Cancelled';
  paymentStatus: 'Pending' | 'Paid' | 'Failed' | 'Refunded';
  totalPrice: number;
  createdAt: string;
  guest?: Guest;
  room?: Room;
}

export interface CreateReservationDto {
  guestId: number;
  roomId: number;
  checkInDate: string;
  checkOutDate: string;
  numberOfGuests: number;
  specialRequests?: string;
}

export interface ReservationSummary {
  id: number;
  guestName: string;
  roomNumber: string;
  roomType: string;
  checkInDate: string;
  checkOutDate: string;
  numberOfGuests: number;
  status: 'Pending' | 'Confirmed' | 'CheckedIn' | 'CheckedOut' | 'Cancelled';
  paymentStatus: 'Pending' | 'Paid' | 'Failed' | 'Refunded';
  totalPrice: number;
}

// API service class
class ApiService {
  private async request<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
    const url = `${API_BASE_URL}${endpoint}`;
    const config: RequestInit = {
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
        ...options.headers,
      },
      mode: 'cors',
      credentials: 'omit',
      ...options,
    };

    try {
      console.log(`API Request: ${options.method || 'GET'} ${url}`);
      const response = await fetch(url, config);
      
      if (!response.ok) {
        let errorMessage = `HTTP error! status: ${response.status}`;
        try {
          const contentType = response.headers.get('content-type');
          if (contentType && contentType.includes('application/json')) {
            const errorData = await response.json();
            errorMessage = errorData.message || errorData.title || errorMessage;
          } else {
            // Handle plain text error responses
            const errorText = await response.text();
            errorMessage = errorText || response.statusText || errorMessage;
          }
        } catch {
          // If response is not JSON, use status text
          errorMessage = response.statusText || errorMessage;
        }
        throw new Error(errorMessage);
      }

      // Check if response has content before trying to parse JSON
      const contentType = response.headers.get('content-type');
      if (contentType && contentType.includes('application/json')) {
        const text = await response.text();
        if (text.trim()) {
          const data = JSON.parse(text);
          console.log(`API Response: ${options.method || 'GET'} ${url}`, data);
          return data as T;
        } else {
          // Empty response for successful requests (like DELETE)
          console.log(`API Response: ${options.method || 'GET'} ${url} - Empty response`);
          return undefined as T;
        }
      } else {
        // Non-JSON response
        const text = await response.text();
        console.log(`API Response: ${options.method || 'GET'} ${url} - Non-JSON:`, text);
        return text as T;
      }
    } catch (error) {
      console.error(`API request failed: ${options.method || 'GET'} ${url}`, error);
      
      // Provide more specific error messages
      if (error instanceof TypeError && error.message.includes('fetch')) {
        throw new Error('Unable to connect to the server. Please check if the backend is running on http://localhost:5159');
      }
      
      throw error;
    }
  }

  // Guest endpoints
  async getGuests(): Promise<Guest[]> {
    return this.request<Guest[]>('/guests');
  }

  async getGuest(id: number): Promise<Guest> {
    return this.request<Guest>(`/guests/${id}`);
  }

  async createGuest(guest: CreateGuestDto): Promise<Guest> {
    return this.request<Guest>('/guests', {
      method: 'POST',
      body: JSON.stringify(guest),
    });
  }

  async updateGuest(id: number, guest: CreateGuestDto): Promise<void> {
    return this.request<void>(`/guests/${id}`, {
      method: 'PUT',
      body: JSON.stringify(guest),
    });
  }

  async deleteGuest(id: number): Promise<void> {
    return this.request<void>(`/guests/${id}`, {
      method: 'DELETE',
    });
  }

  // Room endpoints
  async getRooms(): Promise<Room[]> {
    return this.request<Room[]>('/rooms');
  }

  async getAvailableRooms(): Promise<Room[]> {
    return this.request<Room[]>('/rooms/available');
  }

  async getRoom(id: number): Promise<Room> {
    return this.request<Room>(`/rooms/${id}`);
  }

  async createRoom(room: CreateRoomDto): Promise<Room> {
    return this.request<Room>('/rooms', {
      method: 'POST',
      body: JSON.stringify(room),
    });
  }

  async updateRoom(id: number, room: CreateRoomDto): Promise<void> {
    return this.request<void>(`/rooms/${id}`, {
      method: 'PUT',
      body: JSON.stringify(room),
    });
  }

  async deleteRoom(id: number): Promise<void> {
    return this.request<void>(`/rooms/${id}`, {
      method: 'DELETE',
    });
  }

  // Reservation endpoints
  async getReservations(): Promise<ReservationSummary[]> {
    return this.request<ReservationSummary[]>('/reservations');
  }

  async getReservation(id: number): Promise<Reservation> {
    return this.request<Reservation>(`/reservations/${id}`);
  }

  async createReservation(reservation: CreateReservationDto): Promise<Reservation> {
    return this.request<Reservation>('/reservations', {
      method: 'POST',
      body: JSON.stringify(reservation),
    });
  }

  async updateReservation(id: number, reservation: Partial<CreateReservationDto> & {
    status: Reservation['status'];
    paymentStatus: Reservation['paymentStatus'];
  }): Promise<void> {
    await this.request<void>(`/reservations/${id}`, {
      method: 'PUT',
      body: JSON.stringify(reservation),
    });
  }

  async deleteReservation(id: number): Promise<void> {
    await this.request<void>(`/reservations/${id}`, {
      method: 'DELETE',
    });
  }

  async checkRoomAvailability(checkInDate: string, checkOutDate: string): Promise<RoomAvailability[]> {
    const params = new URLSearchParams({
      checkInDate,
      checkOutDate
    });
    return this.request<RoomAvailability[]>(`/reservations/check-availability?${params}`);
  }

  async updatePaymentStatus(id: number, paymentStatus: string): Promise<Reservation> {
    return this.request<Reservation>(`/reservations/${id}/payment-status`, {
      method: 'PATCH',
      body: JSON.stringify({ paymentStatus }),
    });
  }

// Seed data endpoint
  async seedData(): Promise<{ message: string; roomsCreated: number }> {
    return this.request<{ message: string; roomsCreated: number }>('/seeddata', {
      method: 'POST',
    });
  }

  // Report endpoints
  async getComprehensiveReport(startDate?: string, endDate?: string): Promise<any> {
    return this.request<any>('/reports/comprehensive', {
      method: 'POST',
      body: JSON.stringify({ startDate, endDate })
    });
  }

  async getKpiCards(): Promise<any> {
    return this.request<any>('/reports/kpi-cards');
  }

  async getReportSummary(): Promise<any> {
    return this.request<any>('/reports/summary');
  }

  async getRevenueTrend(days: number = 30): Promise<any> {
    return this.request<any>(`/reports/revenue-trend?days=${days}`);
  }

  async getOccupancyTrend(days: number = 30): Promise<any> {
    return this.request<any>(`/reports/occupancy-trend?days=${days}`);
  }

  async getRevenueByRoomType(): Promise<any> {
    return this.request<any>('/reports/revenue-by-room-type');
  }

  async getMonthlyPerformance(): Promise<any> {
    return this.request<any>('/reports/monthly-performance');
  }

  async getTopRooms(limit: number = 5): Promise<any> {
    return this.request<any>(`/reports/top-rooms?limit=${limit}`);
  }

  async getTopGuests(limit: number = 5): Promise<any> {
    return this.request<any>(`/reports/top-guests?limit=${limit}`);
  }

  async getGuestDemographics(): Promise<any> {
    return this.request<any>('/reports/guest-demographics');
  }

  async getPaymentAnalytics(): Promise<any> {
    return this.request<any>('/reports/payment-analytics');
  }

  async getBookingPatterns(): Promise<any> {
    return this.request<any>('/reports/booking-patterns');
  }

  async getQuickReport(period: string): Promise<any> {
    return this.request<any>(`/reports/quick-report?period=${period}`);
  }

  async getComparison(period1Start: string, period1End: string, period2Start: string, period2End: string): Promise<any> {
    return this.request<any>('/reports/comparison', {
      method: 'POST',
      body: JSON.stringify({ period1Start, period1End, period2Start, period2End })
    });
  }
}

export const apiService = new ApiService();
export default apiService;
