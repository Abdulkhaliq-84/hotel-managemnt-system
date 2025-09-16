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
  guest?: {
    id: number;
    name: string;
    email: string;
    phone: string;
    createdAt: string;
  };
  room?: {
    id: number;
    roomNumber: string;
    roomType: string;
    pricePerNight: number;
    description?: string;
    isAvailable: boolean;
    createdAt: string;
  };
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

export interface RoomType {
  id: number;
  roomNumber: string;
  roomType: string;
  pricePerNight: number;
  description?: string;
  isAvailable: boolean;
  createdAt: string;
}

export interface SearchFilters {
  dateRange: {
    start: string;
    end: string;
  };
  guestName: string;
  roomType: string;
  status: string;
}

export interface ReservationStats {
  total: number;
  pending: number;
  confirmed: number;
  checkedIn: number;
  checkedOut: number;
  cancelled: number;
}

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

export interface CreateReservationDto {
  guestId: number;
  roomId: number;
  checkInDate: string;
  checkOutDate: string;
  numberOfGuests: number;
  specialRequests?: string;
}

export interface RoomAvailability {
  roomId: number;
  roomNumber: string;
  roomType: string;
  pricePerNight: number;
  description: string;
  isAvailable: boolean;
}