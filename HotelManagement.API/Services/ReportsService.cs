using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.EntityFrameworkCore;
using HotelManagement.API.Models;
using HotelManagement.API.Models.DTOs;

namespace HotelManagement.API.Services
{
    public interface IReportsService
    {
        Task<SummaryStatsDto> GetSummaryStatsAsync(DateTime startDate, DateTime endDate);
        Task<List<KpiCardDto>> GetKpiCardsAsync(DateTime startDate, DateTime endDate);
        Task<RevenueTrendDto> GetRevenueTrendAsync(DateTime startDate, DateTime endDate);
        Task<OccupancyTrendDto> GetOccupancyTrendAsync(DateTime startDate, DateTime endDate);
        Task<List<RevenueByRoomTypeDto>> GetRevenueByRoomTypeAsync(DateTime startDate, DateTime endDate);
        Task<List<MonthlyPerformanceDto>> GetMonthlyPerformanceAsync(int year);
        Task<List<TopRoomDto>> GetTopRoomsAsync(DateTime startDate, DateTime endDate, int topCount = 5);
        Task<List<TopGuestDto>> GetTopGuestsAsync(DateTime startDate, DateTime endDate, int topCount = 5);
        Task<List<GuestDemographicsDto>> GetGuestDemographicsAsync(DateTime startDate, DateTime endDate);
        Task<PaymentAnalyticsDto> GetPaymentAnalyticsAsync(DateTime startDate, DateTime endDate);
        Task<List<BookingPatternDto>> GetBookingPatternsAsync(DateTime startDate, DateTime endDate);
        Task<ComprehensiveReportDto> GetComprehensiveReportAsync(ReportRequestDto request);
    }

    public class ReportsService : IReportsService
    {
        private readonly HotelManagementDbContext _context;

        public ReportsService(HotelManagementDbContext context)
        {
            _context = context;
        }

        public async Task<SummaryStatsDto> GetSummaryStatsAsync(DateTime startDate, DateTime endDate)
        {
            // Ensure dates are in UTC
            var utcStartDate = DateTime.SpecifyKind(startDate.Date, DateTimeKind.Utc);
            var utcEndDate = DateTime.SpecifyKind(endDate.Date.AddDays(1).AddSeconds(-1), DateTimeKind.Utc);

            // Get all reservations in the date range
            var reservations = await _context.Reservations
                .Include(r => r.Guest)
                .Include(r => r.Room)
                .Where(r => r.CheckInDate >= utcStartDate && r.CheckInDate <= utcEndDate)
                .ToListAsync();

            // Get all rooms for occupancy calculations
            var totalRooms = await _context.Rooms.CountAsync();
            var totalDays = (utcEndDate - utcStartDate).Days + 1;

            // Calculate metrics
            var totalRevenue = reservations
                .Where(r => r.PaymentStatus == PaymentStatus.Paid)
                .Sum(r => r.TotalPrice);

            var totalBookings = reservations.Count;
            var cancelledBookings = reservations.Count(r => r.Status == ReservationStatus.Cancelled);
            var cancellationRate = totalBookings > 0 ? (decimal)cancelledBookings / totalBookings * 100 : 0;

            // Calculate occupancy
            var totalRoomNights = totalRooms * totalDays;
            var occupiedRoomNights = 0;
            foreach (var reservation in reservations.Where(r => r.Status != ReservationStatus.Cancelled))
            {
                var nights = (reservation.CheckOutDate - reservation.CheckInDate).Days;
                occupiedRoomNights += nights;
            }
            var averageOccupancy = totalRoomNights > 0 ? (decimal)occupiedRoomNights / totalRoomNights * 100 : 0;

            // Calculate ADR (Average Daily Rate)
            var paidReservations = reservations.Where(r => r.PaymentStatus == PaymentStatus.Paid).ToList();
            var totalNightsSold = 0;
            decimal totalRoomRevenue = 0;
            foreach (var reservation in paidReservations)
            {
                var nights = (reservation.CheckOutDate - reservation.CheckInDate).Days;
                totalNightsSold += nights;
                totalRoomRevenue += reservation.TotalPrice;
            }
            var averageDailyRate = totalNightsSold > 0 ? totalRoomRevenue / totalNightsSold : 0;

            // Calculate RevPAR (Revenue Per Available Room)
            var revPar = totalRoomNights > 0 ? totalRevenue / totalRoomNights : 0;

            // Get unique guests
            var uniqueGuests = reservations.Select(r => r.GuestId).Distinct().Count();

            // Calculate repeat guest rate
            var guestBookingCounts = reservations
                .GroupBy(r => r.GuestId)
                .Select(g => g.Count())
                .ToList();
            var repeatGuests = guestBookingCounts.Count(c => c > 1);
            var repeatGuestRate = uniqueGuests > 0 ? (decimal)repeatGuests / uniqueGuests * 100 : 0;

            // Calculate average stay length
            var totalStayNights = reservations
                .Where(r => r.Status != ReservationStatus.Cancelled)
                .Sum(r => (r.CheckOutDate - r.CheckInDate).Days);
            var completedStays = reservations.Count(r => r.Status == ReservationStatus.CheckedOut);
            var averageStayLength = completedStays > 0 ? (decimal)totalStayNights / completedStays : 0;

            return new SummaryStatsDto
            {
                TotalRevenue = totalRevenue,
                TotalBookings = totalBookings,
                AverageOccupancy = Math.Round(averageOccupancy, 1),
                AverageDailyRate = Math.Round(averageDailyRate, 2),
                RevPar = Math.Round(revPar, 2),
                TotalGuests = uniqueGuests,
                RepeatGuestRate = Math.Round(repeatGuestRate, 1),
                AverageStayLength = Math.Round(averageStayLength, 1),
                TotalActiveRooms = totalRooms,
                CancellationRate = Math.Round(cancellationRate, 1)
            };
        }

        public async Task<List<KpiCardDto>> GetKpiCardsAsync(DateTime startDate, DateTime endDate)
        {
            var stats = await GetSummaryStatsAsync(startDate, endDate);
            
            // Calculate previous period for comparison
            var periodDays = (endDate - startDate).Days + 1;
            var previousStartDate = startDate.AddDays(-periodDays);
            var previousEndDate = startDate.AddDays(-1);
            var previousStats = await GetSummaryStatsAsync(previousStartDate, previousEndDate);

            var kpiCards = new List<KpiCardDto>
            {
                new KpiCardDto
                {
                    Title = "Total Revenue",
                    Value = $"${stats.TotalRevenue:N0}",
                    Change = CalculatePercentageChange(previousStats.TotalRevenue, stats.TotalRevenue),
                    Trend = GetTrend(previousStats.TotalRevenue, stats.TotalRevenue),
                    Icon = "revenue",
                    Color = "blue"
                },
                new KpiCardDto
                {
                    Title = "Occupancy Rate",
                    Value = $"{stats.AverageOccupancy:F1}%",
                    Change = CalculatePercentageChange(previousStats.AverageOccupancy, stats.AverageOccupancy),
                    Trend = GetTrend(previousStats.AverageOccupancy, stats.AverageOccupancy),
                    Icon = "occupancy",
                    Color = "green"
                },
                new KpiCardDto
                {
                    Title = "Total Bookings",
                    Value = stats.TotalBookings.ToString(),
                    Change = CalculatePercentageChange(previousStats.TotalBookings, stats.TotalBookings),
                    Trend = GetTrend(previousStats.TotalBookings, stats.TotalBookings),
                    Icon = "bookings",
                    Color = "purple"
                },
                new KpiCardDto
                {
                    Title = "Average Daily Rate",
                    Value = $"${stats.AverageDailyRate:F2}",
                    Change = CalculatePercentageChange(previousStats.AverageDailyRate, stats.AverageDailyRate),
                    Trend = GetTrend(previousStats.AverageDailyRate, stats.AverageDailyRate),
                    Icon = "adr",
                    Color = "orange"
                },
                new KpiCardDto
                {
                    Title = "Total Guests",
                    Value = stats.TotalGuests.ToString(),
                    Change = CalculatePercentageChange(previousStats.TotalGuests, stats.TotalGuests),
                    Trend = GetTrend(previousStats.TotalGuests, stats.TotalGuests),
                    Icon = "guests",
                    Color = "pink"
                },
                new KpiCardDto
                {
                    Title = "RevPAR",
                    Value = $"${stats.RevPar:F2}",
                    Change = CalculatePercentageChange(previousStats.RevPar, stats.RevPar),
                    Trend = GetTrend(previousStats.RevPar, stats.RevPar),
                    Icon = "revpar",
                    Color = "teal"
                }
            };

            return kpiCards;
        }

        public async Task<RevenueTrendDto> GetRevenueTrendAsync(DateTime startDate, DateTime endDate)
        {
            var utcStartDate = DateTime.SpecifyKind(startDate.Date, DateTimeKind.Utc);
            var utcEndDate = DateTime.SpecifyKind(endDate.Date.AddDays(1).AddSeconds(-1), DateTimeKind.Utc);

            var reservations = await _context.Reservations
                .Include(r => r.Room)
                .Where(r => r.CheckInDate >= utcStartDate && r.CheckInDate <= utcEndDate)
                .Where(r => r.PaymentStatus == PaymentStatus.Paid)
                .ToListAsync();

            var dailyRevenue = new List<RevenueDataDto>();
            var currentDate = utcStartDate;

            while (currentDate <= utcEndDate)
            {
                var dayReservations = reservations
                    .Where(r => r.CheckInDate.Date == currentDate.Date)
                    .ToList();

                var revenue = dayReservations.Sum(r => r.TotalPrice);
                var bookings = dayReservations.Count;
                var averageRate = bookings > 0 ? revenue / bookings : 0;

                dailyRevenue.Add(new RevenueDataDto
                {
                    Date = currentDate,
                    Revenue = revenue,
                    Bookings = bookings,
                    AverageRate = Math.Round(averageRate, 2)
                });

                currentDate = currentDate.AddDays(1);
            }

            var totalRevenue = dailyRevenue.Sum(d => d.Revenue);
            var averageRevenue = dailyRevenue.Count > 0 ? totalRevenue / dailyRevenue.Count : 0;

            // Calculate growth rate (compare first and last periods)
            var firstPeriodRevenue = dailyRevenue.Take(7).Sum(d => d.Revenue);
            var lastPeriodRevenue = dailyRevenue.TakeLast(7).Sum(d => d.Revenue);
            var growthRate = CalculatePercentageChange(firstPeriodRevenue, lastPeriodRevenue);

            return new RevenueTrendDto
            {
                DailyRevenue = dailyRevenue,
                TotalRevenue = totalRevenue,
                AverageRevenue = Math.Round(averageRevenue, 2),
                GrowthRate = growthRate ?? 0,
                TrendDirection = GetTrend(firstPeriodRevenue, lastPeriodRevenue)
            };
        }

        public async Task<OccupancyTrendDto> GetOccupancyTrendAsync(DateTime startDate, DateTime endDate)
        {
            var utcStartDate = DateTime.SpecifyKind(startDate.Date, DateTimeKind.Utc);
            var utcEndDate = DateTime.SpecifyKind(endDate.Date.AddDays(1).AddSeconds(-1), DateTimeKind.Utc);

            var totalRooms = await _context.Rooms.CountAsync();
            var reservations = await _context.Reservations
                .Where(r => r.Status != ReservationStatus.Cancelled)
                .Where(r => (r.CheckInDate <= utcEndDate && r.CheckOutDate >= utcStartDate))
                .ToListAsync();

            var dailyOccupancy = new List<OccupancyDataDto>();
            var currentDate = utcStartDate;

            while (currentDate <= utcEndDate)
            {
                var occupiedRooms = reservations.Count(r => 
                    r.CheckInDate <= currentDate && r.CheckOutDate > currentDate);
                
                var occupancyRate = totalRooms > 0 ? (decimal)occupiedRooms / totalRooms * 100 : 0;

                dailyOccupancy.Add(new OccupancyDataDto
                {
                    Date = currentDate,
                    OccupancyRate = Math.Round(occupancyRate, 1),
                    AvailableRooms = totalRooms,
                    OccupiedRooms = occupiedRooms
                });

                currentDate = currentDate.AddDays(1);
            }

            var averageOccupancy = dailyOccupancy.Count > 0 
                ? dailyOccupancy.Average(d => d.OccupancyRate) : 0;
            var peakOccupancy = dailyOccupancy.Count > 0 
                ? dailyOccupancy.Max(d => d.OccupancyRate) : 0;
            var lowestOccupancy = dailyOccupancy.Count > 0 
                ? dailyOccupancy.Min(d => d.OccupancyRate) : 0;

            return new OccupancyTrendDto
            {
                DailyOccupancy = dailyOccupancy,
                AverageOccupancy = Math.Round(averageOccupancy, 1),
                PeakOccupancy = Math.Round(peakOccupancy, 1),
                LowestOccupancy = Math.Round(lowestOccupancy, 1)
            };
        }

        public async Task<List<RevenueByRoomTypeDto>> GetRevenueByRoomTypeAsync(DateTime startDate, DateTime endDate)
        {
            var utcStartDate = DateTime.SpecifyKind(startDate.Date, DateTimeKind.Utc);
            var utcEndDate = DateTime.SpecifyKind(endDate.Date.AddDays(1).AddSeconds(-1), DateTimeKind.Utc);

            var revenueByType = await _context.Reservations
                .Include(r => r.Room)
                .Where(r => r.CheckInDate >= utcStartDate && r.CheckInDate <= utcEndDate)
                .Where(r => r.PaymentStatus == PaymentStatus.Paid)
                .GroupBy(r => r.Room.RoomType)
                .Select(g => new 
                {
                    RoomType = g.Key,
                    Revenue = g.Sum(r => r.TotalPrice),
                    Bookings = g.Count()
                })
                .ToListAsync();

            var totalRevenue = revenueByType.Sum(r => r.Revenue);

            return revenueByType.Select(r => new RevenueByRoomTypeDto
            {
                RoomType = r.RoomType,
                Revenue = r.Revenue,
                Bookings = r.Bookings,
                Percentage = totalRevenue > 0 ? Math.Round(r.Revenue / totalRevenue * 100, 1) : 0
            })
            .OrderByDescending(r => r.Revenue)
            .ToList();
        }

        public async Task<List<MonthlyPerformanceDto>> GetMonthlyPerformanceAsync(int year)
        {
            var startDate = new DateTime(year, 1, 1, 0, 0, 0, DateTimeKind.Utc);
            var endDate = new DateTime(year, 12, 31, 23, 59, 59, DateTimeKind.Utc);
            
            var totalRooms = await _context.Rooms.CountAsync();
            var monthlyData = new List<MonthlyPerformanceDto>();

            for (int month = 1; month <= 12; month++)
            {
                var monthStart = new DateTime(year, month, 1, 0, 0, 0, DateTimeKind.Utc);
                var monthEnd = monthStart.AddMonths(1).AddSeconds(-1);

                if (monthStart > DateTime.UtcNow) break;

                var reservations = await _context.Reservations
                    .Where(r => r.CheckInDate >= monthStart && r.CheckInDate <= monthEnd)
                    .ToListAsync();

                var revenue = reservations
                    .Where(r => r.PaymentStatus == PaymentStatus.Paid)
                    .Sum(r => r.TotalPrice);

                var totalBookings = reservations.Count;
                var cancelledBookings = reservations.Count(r => r.Status == ReservationStatus.Cancelled);

                // Calculate occupancy for the month
                var daysInMonth = DateTime.DaysInMonth(year, month);
                var totalRoomNights = totalRooms * daysInMonth;
                var occupiedRoomNights = 0;

                foreach (var reservation in reservations.Where(r => r.Status != ReservationStatus.Cancelled))
                {
                    var checkIn = reservation.CheckInDate < monthStart ? monthStart : reservation.CheckInDate;
                    var checkOut = reservation.CheckOutDate > monthEnd ? monthEnd : reservation.CheckOutDate;
                    var nights = (checkOut - checkIn).Days;
                    occupiedRoomNights += Math.Max(0, nights);
                }

                var occupancy = totalRoomNights > 0 ? (decimal)occupiedRoomNights / totalRoomNights * 100 : 0;
                
                // Calculate ADR
                var paidNights = reservations
                    .Where(r => r.PaymentStatus == PaymentStatus.Paid)
                    .Sum(r => (r.CheckOutDate - r.CheckInDate).Days);
                var adr = paidNights > 0 ? revenue / paidNights : 0;
                
                // Calculate RevPAR
                var revPar = totalRoomNights > 0 ? revenue / totalRoomNights : 0;

                monthlyData.Add(new MonthlyPerformanceDto
                {
                    Month = new DateTime(year, month, 1).ToString("MMMM"),
                    Year = year,
                    Revenue = revenue,
                    Occupancy = Math.Round(occupancy, 1),
                    Adr = Math.Round(adr, 2),
                    RevPar = Math.Round(revPar, 2),
                    TotalBookings = totalBookings,
                    CancelledBookings = cancelledBookings
                });
            }

            return monthlyData;
        }

        public async Task<List<TopRoomDto>> GetTopRoomsAsync(DateTime startDate, DateTime endDate, int topCount = 5)
        {
            var utcStartDate = DateTime.SpecifyKind(startDate.Date, DateTimeKind.Utc);
            var utcEndDate = DateTime.SpecifyKind(endDate.Date.AddDays(1).AddSeconds(-1), DateTimeKind.Utc);

            var totalDays = (utcEndDate - utcStartDate).Days + 1;

            var reservations = await _context.Reservations
                .Include(r => r.Room)
                .Where(r => r.CheckInDate >= utcStartDate && r.CheckInDate <= utcEndDate)
                .Where(r => r.PaymentStatus == PaymentStatus.Paid)
                .ToListAsync();

            var roomPerformance = reservations
                .GroupBy(r => new { r.Room.Id, r.Room.RoomNumber, r.Room.RoomType })
                .Select(g => new
                {
                    RoomId = g.Key.Id,
                    RoomNumber = g.Key.RoomNumber,
                    RoomType = g.Key.RoomType,
                    Bookings = g.Count(),
                    Revenue = g.Sum(r => r.TotalPrice),
                    TotalNights = g.Sum(r => (r.CheckOutDate - r.CheckInDate).Days)
                })
                .OrderByDescending(r => r.Revenue)
                .Take(topCount)
                .ToList();

            return roomPerformance.Select(r => new TopRoomDto
            {
                RoomNumber = r.RoomNumber,
                RoomType = r.RoomType,
                Bookings = r.Bookings,
                Revenue = r.Revenue,
                OccupancyRate = Math.Round((decimal)r.TotalNights / totalDays * 100, 1),
                AverageRate = Math.Round(r.TotalNights > 0 ? r.Revenue / r.TotalNights : 0, 2)
            }).ToList();
        }

        public async Task<List<TopGuestDto>> GetTopGuestsAsync(DateTime startDate, DateTime endDate, int topCount = 5)
        {
            var utcStartDate = DateTime.SpecifyKind(startDate.Date, DateTimeKind.Utc);
            var utcEndDate = DateTime.SpecifyKind(endDate.Date.AddDays(1).AddSeconds(-1), DateTimeKind.Utc);

            var topGuests = await _context.Reservations
                .Include(r => r.Guest)
                .Where(r => r.CheckInDate >= utcStartDate && r.CheckInDate <= utcEndDate)
                .Where(r => r.PaymentStatus == PaymentStatus.Paid)
                .GroupBy(r => new { r.Guest.Id, r.Guest.Name, r.Guest.Email, r.Guest.Phone })
                .Select(g => new
                {
                    GuestId = g.Key.Id,
                    Name = g.Key.Name,
                    Email = g.Key.Email,
                    Phone = g.Key.Phone,
                    TotalStays = g.Count(),
                    TotalSpent = g.Sum(r => r.TotalPrice),
                    LastVisit = g.Max(r => r.CheckInDate)
                })
                .OrderByDescending(g => g.TotalSpent)
                .Take(topCount)
                .ToListAsync();

            return topGuests.Select(g => new TopGuestDto
            {
                Id = g.GuestId,
                Name = g.Name,
                Email = g.Email,
                Phone = g.Phone,
                TotalStays = g.TotalStays,
                TotalSpent = g.TotalSpent,
                LastVisit = g.LastVisit
            }).ToList();
        }

        public async Task<List<GuestDemographicsDto>> GetGuestDemographicsAsync(DateTime startDate, DateTime endDate)
        {
            // For demonstration, we'll group by email domain as a proxy for demographics
            // In a real system, you might have country/region data in the Guest model
            var utcStartDate = DateTime.SpecifyKind(startDate.Date, DateTimeKind.Utc);
            var utcEndDate = DateTime.SpecifyKind(endDate.Date.AddDays(1).AddSeconds(-1), DateTimeKind.Utc);

            var guests = await _context.Reservations
                .Include(r => r.Guest)
                .Where(r => r.CheckInDate >= utcStartDate && r.CheckInDate <= utcEndDate)
                .Select(r => r.Guest)
                .Distinct()
                .ToListAsync();

            // Simulate country demographics based on email domains
            var demographics = new Dictionary<string, int>
            {
                { "United States", 0 },
                { "Canada", 0 },
                { "United Kingdom", 0 },
                { "Germany", 0 },
                { "France", 0 },
                { "Others", 0 }
            };

            foreach (var guest in guests)
            {
                var emailDomain = guest.Email.Split('@').LastOrDefault()?.ToLower() ?? "";
                
                if (emailDomain.EndsWith(".com") || emailDomain.EndsWith(".us"))
                    demographics["United States"]++;
                else if (emailDomain.EndsWith(".ca"))
                    demographics["Canada"]++;
                else if (emailDomain.EndsWith(".uk") || emailDomain.EndsWith(".co.uk"))
                    demographics["United Kingdom"]++;
                else if (emailDomain.EndsWith(".de"))
                    demographics["Germany"]++;
                else if (emailDomain.EndsWith(".fr"))
                    demographics["France"]++;
                else
                    demographics["Others"]++;
            }

            var totalGuests = demographics.Values.Sum();

            return demographics
                .Where(d => d.Value > 0)
                .Select(d => new GuestDemographicsDto
                {
                    Country = d.Key,
                    Count = d.Value,
                    Percentage = totalGuests > 0 ? Math.Round((decimal)d.Value / totalGuests * 100, 1) : 0
                })
                .OrderByDescending(d => d.Count)
                .ToList();
        }

        public async Task<PaymentAnalyticsDto> GetPaymentAnalyticsAsync(DateTime startDate, DateTime endDate)
        {
            var utcStartDate = DateTime.SpecifyKind(startDate.Date, DateTimeKind.Utc);
            var utcEndDate = DateTime.SpecifyKind(endDate.Date.AddDays(1).AddSeconds(-1), DateTimeKind.Utc);

            var reservations = await _context.Reservations
                .Where(r => r.CheckInDate >= utcStartDate && r.CheckInDate <= utcEndDate)
                .ToListAsync();

            var paidReservations = reservations.Where(r => r.PaymentStatus == PaymentStatus.Paid).ToList();
            var pendingReservations = reservations.Where(r => r.PaymentStatus == PaymentStatus.Pending).ToList();
            var refundedReservations = reservations.Where(r => r.PaymentStatus == PaymentStatus.Refunded).ToList();

            var totalReservations = reservations.Count;

            return new PaymentAnalyticsDto
            {
                TotalPaid = paidReservations.Sum(r => r.TotalPrice),
                TotalPending = pendingReservations.Sum(r => r.TotalPrice),
                TotalRefunded = refundedReservations.Sum(r => r.TotalPrice),
                PaidCount = paidReservations.Count,
                PendingCount = pendingReservations.Count,
                RefundedCount = refundedReservations.Count,
                PaymentSuccessRate = totalReservations > 0 
                    ? Math.Round((decimal)paidReservations.Count / totalReservations * 100, 1) : 0
            };
        }

        public async Task<List<BookingPatternDto>> GetBookingPatternsAsync(DateTime startDate, DateTime endDate)
        {
            var utcStartDate = DateTime.SpecifyKind(startDate.Date, DateTimeKind.Utc);
            var utcEndDate = DateTime.SpecifyKind(endDate.Date.AddDays(1).AddSeconds(-1), DateTimeKind.Utc);

            var reservations = await _context.Reservations
                .Where(r => r.CheckInDate >= utcStartDate && r.CheckInDate <= utcEndDate)
                .Where(r => r.PaymentStatus == PaymentStatus.Paid)
                .ToListAsync();

            var patterns = reservations
                .GroupBy(r => r.CheckInDate.DayOfWeek)
                .Select(g => new BookingPatternDto
                {
                    DayOfWeek = g.Key.ToString(),
                    BookingCount = g.Count(),
                    AverageRevenue = Math.Round(g.Average(r => r.TotalPrice), 2)
                })
                .OrderBy(p => (int)Enum.Parse<DayOfWeek>(p.DayOfWeek))
                .ToList();

            return patterns;
        }

        public async Task<ComprehensiveReportDto> GetComprehensiveReportAsync(ReportRequestDto request)
        {
            var utcStartDate = DateTime.SpecifyKind(request.StartDate.Date, DateTimeKind.Utc);
            var utcEndDate = DateTime.SpecifyKind(request.EndDate.Date.AddDays(1).AddSeconds(-1), DateTimeKind.Utc);

            var report = new ComprehensiveReportDto
            {
                Summary = await GetSummaryStatsAsync(request.StartDate, request.EndDate),
                KpiCards = await GetKpiCardsAsync(request.StartDate, request.EndDate),
                RevenueTrend = await GetRevenueTrendAsync(request.StartDate, request.EndDate),
                OccupancyTrend = await GetOccupancyTrendAsync(request.StartDate, request.EndDate),
                RevenueByRoomType = await GetRevenueByRoomTypeAsync(request.StartDate, request.EndDate),
                MonthlyPerformance = await GetMonthlyPerformanceAsync(request.StartDate.Year),
                TopRooms = await GetTopRoomsAsync(request.StartDate, request.EndDate, 5),
                TopGuests = await GetTopGuestsAsync(request.StartDate, request.EndDate, 5),
                GuestDemographics = await GetGuestDemographicsAsync(request.StartDate, request.EndDate),
                Metadata = new ReportMetadataDto
                {
                    GeneratedAt = DateTime.UtcNow,
                    StartDate = request.StartDate,
                    EndDate = request.EndDate,
                    Period = request.Period,
                    TotalDays = (request.EndDate - request.StartDate).Days + 1
                }
            };

            return report;
        }

        // Helper Methods
        private decimal? CalculatePercentageChange(decimal oldValue, decimal newValue)
        {
            if (oldValue == 0)
                return newValue > 0 ? 100 : 0;
            
            return Math.Round((newValue - oldValue) / oldValue * 100, 1);
        }

        private string GetTrend(decimal oldValue, decimal newValue)
        {
            if (newValue > oldValue) return "up";
            if (newValue < oldValue) return "down";
            return "stable";
        }
    }
}
