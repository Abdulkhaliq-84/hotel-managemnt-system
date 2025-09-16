export interface Room {
  id: string;
  roomNumber: string;
  roomType: 'single' | 'double' | 'suite' | 'deluxe';
  floor: number;
  status: 'available' | 'occupied' | 'maintenance' | 'cleaning' | 'reserved';
  price: number;
  capacity: number;
  amenities: string[];
  description: string;
  lastCleaned: string;
  nextCleaning: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface RoomStats {
  total: number;
  available: number;
  occupied: number;
  maintenance: number;
  cleaning: number;
  reserved: number;
  occupancyRate: number;
  averagePrice: number;
}

export interface RoomSearchFilters {
  roomNumber: string;
  roomType: string;
  floor: number | null;
  status: string;
  priceRange: {
    min: number;
    max: number;
  };
  capacity: number | null;
}

export interface RoomAvailability {
  roomId: number;
  roomNumber: string;
  roomType: string;
  pricePerNight: number;
  description: string;
  isAvailable: boolean;
}