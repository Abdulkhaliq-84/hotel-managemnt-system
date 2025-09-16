// Revenue Related Types
export interface RevenueData {
  date: string;
  revenue: number;
  bookings: number;
  averageRate: number;
}

export interface RevenueByRoomType {
  roomType: string;
  revenue: number;
  bookings: number;
  percentage: number;
}

// Occupancy Related Types
export interface OccupancyData {
  date: string;
  occupancyRate: number;
  availableRooms: number;
  occupiedRooms: number;
}

export interface OccupancyByFloor {
  floor: number;
  occupancyRate: number;
  totalRooms: number;
  occupiedRooms: number;
}

// Guest Analytics Types
export interface GuestDemographics {
  country: string;
  count: number;
  percentage: number;
}

export interface GuestStayPattern {
  stayLength: string; // "1-2 nights", "3-5 nights", etc.
  count: number;
  percentage: number;
}

export interface RepeatGuestAnalytics {
  month: string;
  newGuests: number;
  repeatGuests: number;
  repeatRate: number;
}

// Performance Metrics
export interface PerformanceMetrics {
  metric: string;
  value: number;
  change: number; // Percentage change from previous period
  trend: 'up' | 'down' | 'stable';
}

export interface MonthlyPerformance {
  month: string;
  revenue: number;
  occupancy: number;
  adr: number; // Average Daily Rate
  revPar: number; // Revenue Per Available Room
}

// Report Period Types
export type ReportPeriod = 'daily' | 'weekly' | 'monthly' | 'yearly' | 'custom';

export interface DateRange {
  start: string;
  end: string;
}

// Summary Statistics
export interface SummaryStats {
  totalRevenue: number;
  totalBookings: number;
  averageOccupancy: number;
  averageDailyRate: number;
  revPar: number;
  totalGuests: number;
  repeatGuestRate: number;
  averageStayLength: number;
}

// Top Lists
export interface TopRoom {
  roomNumber: string;
  roomType: string;
  bookings: number;
  revenue: number;
  occupancyRate: number;
}

export interface TopGuest {
  id: string;
  name: string;
  totalStays: number;
  totalSpent: number;
  lastVisit: string;
}

// Forecast Data
export interface ForecastData {
  period: string;
  predictedRevenue: number;
  predictedOccupancy: number;
  confidence: number;
}
