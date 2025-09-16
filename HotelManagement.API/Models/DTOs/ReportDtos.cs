using System;
using System.Collections.Generic;
using HotelManagement.API.Models;

namespace HotelManagement.API.Models.DTOs
{
    // KPI and Summary DTOs
    public class KpiCardDto
    {
        public string Title { get; set; } = string.Empty;
        public string Value { get; set; } = string.Empty;
        public decimal? Change { get; set; }
        public string Trend { get; set; } = "stable"; // up, down, stable
        public string Icon { get; set; } = string.Empty;
        public string Color { get; set; } = string.Empty;
    }

    public class SummaryStatsDto
    {
        public decimal TotalRevenue { get; set; }
        public int TotalBookings { get; set; }
        public decimal AverageOccupancy { get; set; }
        public decimal AverageDailyRate { get; set; }
        public decimal RevPar { get; set; }
        public int TotalGuests { get; set; }
        public decimal RepeatGuestRate { get; set; }
        public decimal AverageStayLength { get; set; }
        public int TotalActiveRooms { get; set; }
        public decimal CancellationRate { get; set; }
    }

    // Revenue Related DTOs
    public class RevenueDataDto
    {
        public DateTime Date { get; set; }
        public decimal Revenue { get; set; }
        public int Bookings { get; set; }
        public decimal AverageRate { get; set; }
    }

    public class RevenueByRoomTypeDto
    {
        public string RoomType { get; set; } = string.Empty;
        public decimal Revenue { get; set; }
        public int Bookings { get; set; }
        public decimal Percentage { get; set; }
    }

    public class RevenueTrendDto
    {
        public List<RevenueDataDto> DailyRevenue { get; set; } = new();
        public decimal TotalRevenue { get; set; }
        public decimal AverageRevenue { get; set; }
        public decimal GrowthRate { get; set; }
        public string TrendDirection { get; set; } = string.Empty;
    }

    // Occupancy Related DTOs
    public class OccupancyDataDto
    {
        public DateTime Date { get; set; }
        public decimal OccupancyRate { get; set; }
        public int AvailableRooms { get; set; }
        public int OccupiedRooms { get; set; }
    }

    public class OccupancyByFloorDto
    {
        public int Floor { get; set; }
        public decimal OccupancyRate { get; set; }
        public int TotalRooms { get; set; }
        public int OccupiedRooms { get; set; }
    }

    public class OccupancyTrendDto
    {
        public List<OccupancyDataDto> DailyOccupancy { get; set; } = new();
        public decimal AverageOccupancy { get; set; }
        public decimal PeakOccupancy { get; set; }
        public decimal LowestOccupancy { get; set; }
    }

    // Guest Analytics DTOs
    public class GuestDemographicsDto
    {
        public string Country { get; set; } = string.Empty;
        public int Count { get; set; }
        public decimal Percentage { get; set; }
    }

    public class GuestStayPatternDto
    {
        public string StayLength { get; set; } = string.Empty; // "1-2 nights", "3-5 nights", etc.
        public int Count { get; set; }
        public decimal Percentage { get; set; }
    }

    public class RepeatGuestAnalyticsDto
    {
        public string Month { get; set; } = string.Empty;
        public int NewGuests { get; set; }
        public int RepeatGuests { get; set; }
        public decimal RepeatRate { get; set; }
    }

    public class TopGuestDto
    {
        public int Id { get; set; }
        public string Name { get; set; } = string.Empty;
        public int TotalStays { get; set; }
        public decimal TotalSpent { get; set; }
        public DateTime LastVisit { get; set; }
        public string Email { get; set; } = string.Empty;
        public string Phone { get; set; } = string.Empty;
    }

    // Performance Metrics DTOs
    public class MonthlyPerformanceDto
    {
        public string Month { get; set; } = string.Empty;
        public int Year { get; set; }
        public decimal Revenue { get; set; }
        public decimal Occupancy { get; set; }
        public decimal Adr { get; set; } // Average Daily Rate
        public decimal RevPar { get; set; } // Revenue Per Available Room
        public int TotalBookings { get; set; }
        public int CancelledBookings { get; set; }
    }

    public class TopRoomDto
    {
        public string RoomNumber { get; set; } = string.Empty;
        public string RoomType { get; set; } = string.Empty;
        public int Bookings { get; set; }
        public decimal Revenue { get; set; }
        public decimal OccupancyRate { get; set; }
        public decimal AverageRate { get; set; }
    }

    public class PerformanceMetricsDto
    {
        public string Metric { get; set; } = string.Empty;
        public decimal Value { get; set; }
        public decimal Change { get; set; } // Percentage change from previous period
        public string Trend { get; set; } = string.Empty; // up, down, stable
    }

    // Forecast DTOs
    public class ForecastDataDto
    {
        public string Period { get; set; } = string.Empty;
        public decimal PredictedRevenue { get; set; }
        public decimal PredictedOccupancy { get; set; }
        public decimal Confidence { get; set; }
    }

    // Report Request DTOs
    public class ReportRequestDto
    {
        public DateTime StartDate { get; set; }
        public DateTime EndDate { get; set; }
        public string Period { get; set; } = "monthly"; // daily, weekly, monthly, yearly
        public string? GroupBy { get; set; }
        public bool IncludeForecasts { get; set; } = false;
    }

    // Comprehensive Report Response
    public class ComprehensiveReportDto
    {
        public SummaryStatsDto Summary { get; set; } = new();
        public List<KpiCardDto> KpiCards { get; set; } = new();
        public RevenueTrendDto RevenueTrend { get; set; } = new();
        public OccupancyTrendDto OccupancyTrend { get; set; } = new();
        public List<RevenueByRoomTypeDto> RevenueByRoomType { get; set; } = new();
        public List<MonthlyPerformanceDto> MonthlyPerformance { get; set; } = new();
        public List<TopRoomDto> TopRooms { get; set; } = new();
        public List<TopGuestDto> TopGuests { get; set; } = new();
        public List<GuestDemographicsDto> GuestDemographics { get; set; } = new();
        public ReportMetadataDto Metadata { get; set; } = new();
    }

    public class ReportMetadataDto
    {
        public DateTime GeneratedAt { get; set; }
        public DateTime StartDate { get; set; }
        public DateTime EndDate { get; set; }
        public string Period { get; set; } = string.Empty;
        public int TotalDays { get; set; }
    }

    // Payment Analytics DTOs
    public class PaymentAnalyticsDto
    {
        public decimal TotalPaid { get; set; }
        public decimal TotalPending { get; set; }
        public decimal TotalRefunded { get; set; }
        public int PaidCount { get; set; }
        public int PendingCount { get; set; }
        public int RefundedCount { get; set; }
        public decimal PaymentSuccessRate { get; set; }
    }

    // Booking Pattern DTOs
    public class BookingPatternDto
    {
        public string DayOfWeek { get; set; } = string.Empty;
        public int BookingCount { get; set; }
        public decimal AverageRevenue { get; set; }
    }

    public class SeasonalTrendDto
    {
        public string Season { get; set; } = string.Empty;
        public decimal AverageOccupancy { get; set; }
        public decimal AverageRate { get; set; }
        public int TotalBookings { get; set; }
    }
}
