import type { 
  RevenueData, 
  OccupancyData, 
  RevenueByRoomType,
  GuestDemographics,
  MonthlyPerformance,
  TopRoom,
  TopGuest
} from '../types/report.types';

// Generate revenue data for the last N days
export const generateRevenueData = (days: number = 30): RevenueData[] => {
  const data: RevenueData[] = [];
  const today = new Date();
  
  for (let i = days - 1; i >= 0; i--) {
    const date = new Date(today);
    date.setDate(date.getDate() - i);
    
    // Simulate realistic revenue patterns (higher on weekends)
    const dayOfWeek = date.getDay();
    const isWeekend = dayOfWeek === 0 || dayOfWeek === 6;
    const baseRevenue = isWeekend ? 8000 : 6000;
    const variance = Math.random() * 2000 - 1000;
    
    data.push({
      date: date.toISOString().split('T')[0],
      revenue: Math.round(baseRevenue + variance),
      bookings: Math.floor(Math.random() * 15 + 10),
      averageRate: Math.round(150 + Math.random() * 100)
    });
  }
  
  return data;
};

// Generate occupancy data
export const generateOccupancyData = (days: number = 30): OccupancyData[] => {
  const data: OccupancyData[] = [];
  const today = new Date();
  const totalRooms = 25; // Assuming 25 rooms total
  
  for (let i = days - 1; i >= 0; i--) {
    const date = new Date(today);
    date.setDate(date.getDate() - i);
    
    // Simulate realistic occupancy patterns
    const dayOfWeek = date.getDay();
    const isWeekend = dayOfWeek === 0 || dayOfWeek === 6;
    const baseOccupancy = isWeekend ? 0.85 : 0.65;
    const variance = Math.random() * 0.2 - 0.1;
    const occupancyRate = Math.min(1, Math.max(0, baseOccupancy + variance));
    
    data.push({
      date: date.toISOString().split('T')[0],
      occupancyRate: Math.round(occupancyRate * 100),
      availableRooms: totalRooms,
      occupiedRooms: Math.round(totalRooms * occupancyRate)
    });
  }
  
  return data;
};

// Generate revenue by room type
export const generateRevenueByRoomType = (): RevenueByRoomType[] => {
  const roomTypes = [
    { type: 'Single', revenue: 45000, bookings: 180 },
    { type: 'Double', revenue: 85000, bookings: 220 },
    { type: 'Suite', revenue: 120000, bookings: 150 },
    { type: 'Deluxe', revenue: 95000, bookings: 120 }
  ];
  
  const totalRevenue = roomTypes.reduce((sum, rt) => sum + rt.revenue, 0);
  
  return roomTypes.map(rt => ({
    roomType: rt.type,
    revenue: rt.revenue,
    bookings: rt.bookings,
    percentage: Math.round((rt.revenue / totalRevenue) * 100)
  }));
};

// Generate guest demographics
export const generateGuestDemographics = (): GuestDemographics[] => {
  const countries = [
    { country: 'United States', count: 450 },
    { country: 'Canada', count: 180 },
    { country: 'United Kingdom', count: 220 },
    { country: 'Germany', count: 150 },
    { country: 'France', count: 120 },
    { country: 'Japan', count: 95 },
    { country: 'Australia', count: 85 },
    { country: 'Others', count: 200 }
  ];
  
  const totalGuests = countries.reduce((sum, c) => sum + c.count, 0);
  
  return countries.map(c => ({
    country: c.country,
    count: c.count,
    percentage: Math.round((c.count / totalGuests) * 100)
  }));
};

// Generate monthly performance data
export const generateMonthlyPerformance = (): MonthlyPerformance[] => {
  const months = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ];
  
  const currentMonth = new Date().getMonth();
  const data: MonthlyPerformance[] = [];
  
  for (let i = 0; i <= currentMonth; i++) {
    const baseRevenue = 180000 + Math.random() * 60000;
    const occupancy = 65 + Math.random() * 25;
    const adr = 150 + Math.random() * 50;
    
    data.push({
      month: months[i],
      revenue: Math.round(baseRevenue),
      occupancy: Math.round(occupancy),
      adr: Math.round(adr),
      revPar: Math.round((occupancy / 100) * adr)
    });
  }
  
  return data;
};

// Generate top performing rooms
export const generateTopRooms = (): TopRoom[] => {
  const rooms = [
    { number: '301', type: 'Suite', bookings: 45, revenue: 67500 },
    { number: '205', type: 'Deluxe', bookings: 42, revenue: 52500 },
    { number: '101', type: 'Single', bookings: 58, revenue: 34800 },
    { number: '202', type: 'Double', bookings: 48, revenue: 43200 },
    { number: '304', type: 'Suite', bookings: 38, revenue: 57000 }
  ];
  
  return rooms.map(room => ({
    roomNumber: room.number,
    roomType: room.type,
    bookings: room.bookings,
    revenue: room.revenue,
    occupancyRate: Math.round((room.bookings / 60) * 100) // Assuming 60 days period
  }));
};

// Generate top guests
export const generateTopGuests = (): TopGuest[] => {
  const guests = [
    { name: 'John Smith', stays: 12, spent: 8400 },
    { name: 'Sarah Johnson', stays: 10, spent: 7200 },
    { name: 'Michael Chen', stays: 9, spent: 9500 },
    { name: 'Emma Davis', stays: 8, spent: 6800 },
    { name: 'Robert Wilson', stays: 7, spent: 5600 }
  ];
  
  return guests.map((guest, index) => ({
    id: (index + 1).toString(),
    name: guest.name,
    totalStays: guest.stays,
    totalSpent: guest.spent,
    lastVisit: new Date(Date.now() - Math.random() * 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0]
  }));
};

// Calculate summary statistics
export const calculateSummaryStats = () => {
  return {
    totalRevenue: 345000,
    totalBookings: 670,
    averageOccupancy: 72,
    averageDailyRate: 175,
    revPar: 126,
    totalGuests: 1500,
    repeatGuestRate: 35,
    averageStayLength: 2.8
  };
};
