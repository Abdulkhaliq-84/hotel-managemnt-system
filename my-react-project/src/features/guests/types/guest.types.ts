export interface Guest {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  dateOfBirth?: string;
  country: string;
  totalStays: number;
  totalSpent: number;
  lastVisit: string;
  isActive: boolean;
  preferences: {
    roomType: 'single' | 'double' | 'suite' | 'deluxe';
    floor: 'low' | 'high' | 'any';
    smoking: boolean;
    specialRequests: string[];
  };
  createdAt: string;
  updatedAt: string;
}

export interface GuestStats {
  total: number;
  active: number;
  newThisMonth: number;
  repeatGuests: number;
  averageRating: number;
}

export interface GuestSearchFilters {
  name: string;
  email: string;
  phone: string;
  isActive: boolean | null;
  dateRange: {
    start: string;
    end: string;
  };
}
