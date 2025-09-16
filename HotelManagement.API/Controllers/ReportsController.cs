using System;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using HotelManagement.API.Models.DTOs;
using HotelManagement.API.Services;

namespace HotelManagement.API.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class ReportsController : ControllerBase
    {
        private readonly IReportsService _reportsService;

        public ReportsController(IReportsService reportsService)
        {
            _reportsService = reportsService;
        }

        /// <summary>
        /// Get comprehensive report with all analytics data
        /// </summary>
        [HttpPost("comprehensive")]
        [ProducesResponseType(typeof(ComprehensiveReportDto), StatusCodes.Status200OK)]
        [ProducesResponseType(StatusCodes.Status400BadRequest)]
        public async Task<ActionResult<ComprehensiveReportDto>> GetComprehensiveReport([FromBody] ReportRequestDto request)
        {
            try
            {
                if (request.StartDate > request.EndDate)
                {
                    return BadRequest("Start date must be before end date");
                }

                var report = await _reportsService.GetComprehensiveReportAsync(request);
                return Ok(report);
            }
            catch (Exception ex)
            {
                return StatusCode(500, $"An error occurred while generating the report: {ex.Message}");
            }
        }

        /// <summary>
        /// Get KPI cards for dashboard
        /// </summary>
        [HttpGet("kpi-cards")]
        [ProducesResponseType(typeof(List<KpiCardDto>), StatusCodes.Status200OK)]
        public async Task<ActionResult<List<KpiCardDto>>> GetKpiCards(
            [FromQuery] DateTime? startDate = null,
            [FromQuery] DateTime? endDate = null)
        {
            try
            {
                var start = startDate ?? DateTime.UtcNow.AddDays(-30);
                var end = endDate ?? DateTime.UtcNow;

                var kpiCards = await _reportsService.GetKpiCardsAsync(start, end);
                return Ok(kpiCards);
            }
            catch (Exception ex)
            {
                return StatusCode(500, $"An error occurred: {ex.Message}");
            }
        }

        /// <summary>
        /// Get summary statistics
        /// </summary>
        [HttpGet("summary")]
        [ProducesResponseType(typeof(SummaryStatsDto), StatusCodes.Status200OK)]
        public async Task<ActionResult<SummaryStatsDto>> GetSummaryStats(
            [FromQuery] DateTime? startDate = null,
            [FromQuery] DateTime? endDate = null)
        {
            try
            {
                var start = startDate ?? DateTime.UtcNow.AddDays(-30);
                var end = endDate ?? DateTime.UtcNow;

                var summary = await _reportsService.GetSummaryStatsAsync(start, end);
                return Ok(summary);
            }
            catch (Exception ex)
            {
                return StatusCode(500, $"An error occurred: {ex.Message}");
            }
        }

        /// <summary>
        /// Get revenue trend analysis
        /// </summary>
        [HttpGet("revenue-trend")]
        [ProducesResponseType(typeof(RevenueTrendDto), StatusCodes.Status200OK)]
        public async Task<ActionResult<RevenueTrendDto>> GetRevenueTrend(
            [FromQuery] DateTime? startDate = null,
            [FromQuery] DateTime? endDate = null)
        {
            try
            {
                var start = startDate ?? DateTime.UtcNow.AddDays(-30);
                var end = endDate ?? DateTime.UtcNow;

                var revenueTrend = await _reportsService.GetRevenueTrendAsync(start, end);
                return Ok(revenueTrend);
            }
            catch (Exception ex)
            {
                return StatusCode(500, $"An error occurred: {ex.Message}");
            }
        }

        /// <summary>
        /// Get occupancy trend analysis
        /// </summary>
        [HttpGet("occupancy-trend")]
        [ProducesResponseType(typeof(OccupancyTrendDto), StatusCodes.Status200OK)]
        public async Task<ActionResult<OccupancyTrendDto>> GetOccupancyTrend(
            [FromQuery] DateTime? startDate = null,
            [FromQuery] DateTime? endDate = null)
        {
            try
            {
                var start = startDate ?? DateTime.UtcNow.AddDays(-30);
                var end = endDate ?? DateTime.UtcNow;

                var occupancyTrend = await _reportsService.GetOccupancyTrendAsync(start, end);
                return Ok(occupancyTrend);
            }
            catch (Exception ex)
            {
                return StatusCode(500, $"An error occurred: {ex.Message}");
            }
        }

        /// <summary>
        /// Get revenue breakdown by room type
        /// </summary>
        [HttpGet("revenue-by-room-type")]
        [ProducesResponseType(typeof(List<RevenueByRoomTypeDto>), StatusCodes.Status200OK)]
        public async Task<ActionResult<List<RevenueByRoomTypeDto>>> GetRevenueByRoomType(
            [FromQuery] DateTime? startDate = null,
            [FromQuery] DateTime? endDate = null)
        {
            try
            {
                var start = startDate ?? DateTime.UtcNow.AddDays(-30);
                var end = endDate ?? DateTime.UtcNow;

                var revenueByType = await _reportsService.GetRevenueByRoomTypeAsync(start, end);
                return Ok(revenueByType);
            }
            catch (Exception ex)
            {
                return StatusCode(500, $"An error occurred: {ex.Message}");
            }
        }

        /// <summary>
        /// Get monthly performance metrics
        /// </summary>
        [HttpGet("monthly-performance")]
        [ProducesResponseType(typeof(List<MonthlyPerformanceDto>), StatusCodes.Status200OK)]
        public async Task<ActionResult<List<MonthlyPerformanceDto>>> GetMonthlyPerformance(
            [FromQuery] int? year = null)
        {
            try
            {
                var targetYear = year ?? DateTime.UtcNow.Year;
                var performance = await _reportsService.GetMonthlyPerformanceAsync(targetYear);
                return Ok(performance);
            }
            catch (Exception ex)
            {
                return StatusCode(500, $"An error occurred: {ex.Message}");
            }
        }

        /// <summary>
        /// Get top performing rooms
        /// </summary>
        [HttpGet("top-rooms")]
        [ProducesResponseType(typeof(List<TopRoomDto>), StatusCodes.Status200OK)]
        public async Task<ActionResult<List<TopRoomDto>>> GetTopRooms(
            [FromQuery] DateTime? startDate = null,
            [FromQuery] DateTime? endDate = null,
            [FromQuery] int topCount = 5)
        {
            try
            {
                var start = startDate ?? DateTime.UtcNow.AddDays(-30);
                var end = endDate ?? DateTime.UtcNow;

                var topRooms = await _reportsService.GetTopRoomsAsync(start, end, topCount);
                return Ok(topRooms);
            }
            catch (Exception ex)
            {
                return StatusCode(500, $"An error occurred: {ex.Message}");
            }
        }

        /// <summary>
        /// Get top guests by revenue
        /// </summary>
        [HttpGet("top-guests")]
        [ProducesResponseType(typeof(List<TopGuestDto>), StatusCodes.Status200OK)]
        public async Task<ActionResult<List<TopGuestDto>>> GetTopGuests(
            [FromQuery] DateTime? startDate = null,
            [FromQuery] DateTime? endDate = null,
            [FromQuery] int topCount = 5)
        {
            try
            {
                var start = startDate ?? DateTime.UtcNow.AddDays(-30);
                var end = endDate ?? DateTime.UtcNow;

                var topGuests = await _reportsService.GetTopGuestsAsync(start, end, topCount);
                return Ok(topGuests);
            }
            catch (Exception ex)
            {
                return StatusCode(500, $"An error occurred: {ex.Message}");
            }
        }

        /// <summary>
        /// Get guest demographics analysis
        /// </summary>
        [HttpGet("guest-demographics")]
        [ProducesResponseType(typeof(List<GuestDemographicsDto>), StatusCodes.Status200OK)]
        public async Task<ActionResult<List<GuestDemographicsDto>>> GetGuestDemographics(
            [FromQuery] DateTime? startDate = null,
            [FromQuery] DateTime? endDate = null)
        {
            try
            {
                var start = startDate ?? DateTime.UtcNow.AddDays(-30);
                var end = endDate ?? DateTime.UtcNow;

                var demographics = await _reportsService.GetGuestDemographicsAsync(start, end);
                return Ok(demographics);
            }
            catch (Exception ex)
            {
                return StatusCode(500, $"An error occurred: {ex.Message}");
            }
        }

        /// <summary>
        /// Get payment analytics
        /// </summary>
        [HttpGet("payment-analytics")]
        [ProducesResponseType(typeof(PaymentAnalyticsDto), StatusCodes.Status200OK)]
        public async Task<ActionResult<PaymentAnalyticsDto>> GetPaymentAnalytics(
            [FromQuery] DateTime? startDate = null,
            [FromQuery] DateTime? endDate = null)
        {
            try
            {
                var start = startDate ?? DateTime.UtcNow.AddDays(-30);
                var end = endDate ?? DateTime.UtcNow;

                var paymentAnalytics = await _reportsService.GetPaymentAnalyticsAsync(start, end);
                return Ok(paymentAnalytics);
            }
            catch (Exception ex)
            {
                return StatusCode(500, $"An error occurred: {ex.Message}");
            }
        }

        /// <summary>
        /// Get booking patterns analysis
        /// </summary>
        [HttpGet("booking-patterns")]
        [ProducesResponseType(typeof(List<BookingPatternDto>), StatusCodes.Status200OK)]
        public async Task<ActionResult<List<BookingPatternDto>>> GetBookingPatterns(
            [FromQuery] DateTime? startDate = null,
            [FromQuery] DateTime? endDate = null)
        {
            try
            {
                var start = startDate ?? DateTime.UtcNow.AddDays(-30);
                var end = endDate ?? DateTime.UtcNow;

                var patterns = await _reportsService.GetBookingPatternsAsync(start, end);
                return Ok(patterns);
            }
            catch (Exception ex)
            {
                return StatusCode(500, $"An error occurred: {ex.Message}");
            }
        }

        /// <summary>
        /// Get quick report for a specific period
        /// </summary>
        [HttpGet("quick-report")]
        [ProducesResponseType(typeof(object), StatusCodes.Status200OK)]
        public async Task<ActionResult<object>> GetQuickReport([FromQuery] string period = "last30days")
        {
            try
            {
                DateTime startDate, endDate = DateTime.UtcNow;

                switch (period.ToLower())
                {
                    case "today":
                        startDate = DateTime.UtcNow.Date;
                        break;
                    case "yesterday":
                        startDate = DateTime.UtcNow.AddDays(-1).Date;
                        endDate = DateTime.UtcNow.AddDays(-1).Date.AddDays(1).AddSeconds(-1);
                        break;
                    case "last7days":
                        startDate = DateTime.UtcNow.AddDays(-7);
                        break;
                    case "last30days":
                        startDate = DateTime.UtcNow.AddDays(-30);
                        break;
                    case "last90days":
                        startDate = DateTime.UtcNow.AddDays(-90);
                        break;
                    case "thismonth":
                        startDate = new DateTime(DateTime.UtcNow.Year, DateTime.UtcNow.Month, 1);
                        break;
                    case "lastmonth":
                        var lastMonth = DateTime.UtcNow.AddMonths(-1);
                        startDate = new DateTime(lastMonth.Year, lastMonth.Month, 1);
                        endDate = startDate.AddMonths(1).AddSeconds(-1);
                        break;
                    case "thisyear":
                        startDate = new DateTime(DateTime.UtcNow.Year, 1, 1);
                        break;
                    default:
                        startDate = DateTime.UtcNow.AddDays(-30);
                        break;
                }

                var quickReport = new
                {
                    Period = period,
                    StartDate = startDate,
                    EndDate = endDate,
                    Summary = await _reportsService.GetSummaryStatsAsync(startDate, endDate),
                    KpiCards = await _reportsService.GetKpiCardsAsync(startDate, endDate),
                    RevenueByRoomType = await _reportsService.GetRevenueByRoomTypeAsync(startDate, endDate),
                    TopRooms = await _reportsService.GetTopRoomsAsync(startDate, endDate, 3),
                    TopGuests = await _reportsService.GetTopGuestsAsync(startDate, endDate, 3)
                };

                return Ok(quickReport);
            }
            catch (Exception ex)
            {
                return StatusCode(500, $"An error occurred: {ex.Message}");
            }
        }

        /// <summary>
        /// Get comparison report between two periods
        /// </summary>
        [HttpPost("comparison")]
        [ProducesResponseType(typeof(object), StatusCodes.Status200OK)]
        public async Task<ActionResult<object>> GetComparisonReport([FromBody] ComparisonRequestDto request)
        {
            try
            {
                var period1Summary = await _reportsService.GetSummaryStatsAsync(request.Period1Start, request.Period1End);
                var period2Summary = await _reportsService.GetSummaryStatsAsync(request.Period2Start, request.Period2End);

                var period1Revenue = await _reportsService.GetRevenueTrendAsync(request.Period1Start, request.Period1End);
                var period2Revenue = await _reportsService.GetRevenueTrendAsync(request.Period2Start, request.Period2End);

                var comparison = new
                {
                    Period1 = new
                    {
                        StartDate = request.Period1Start,
                        EndDate = request.Period1End,
                        Summary = period1Summary,
                        RevenueTrend = period1Revenue
                    },
                    Period2 = new
                    {
                        StartDate = request.Period2Start,
                        EndDate = request.Period2End,
                        Summary = period2Summary,
                        RevenueTrend = period2Revenue
                    },
                    Changes = new
                    {
                        RevenueChange = CalculateChange(period1Summary.TotalRevenue, period2Summary.TotalRevenue),
                        OccupancyChange = CalculateChange(period1Summary.AverageOccupancy, period2Summary.AverageOccupancy),
                        BookingsChange = CalculateChange(period1Summary.TotalBookings, period2Summary.TotalBookings),
                        AdrChange = CalculateChange(period1Summary.AverageDailyRate, period2Summary.AverageDailyRate),
                        RevParChange = CalculateChange(period1Summary.RevPar, period2Summary.RevPar),
                        GuestsChange = CalculateChange(period1Summary.TotalGuests, period2Summary.TotalGuests)
                    }
                };

                return Ok(comparison);
            }
            catch (Exception ex)
            {
                return StatusCode(500, $"An error occurred: {ex.Message}");
            }
        }

        private object CalculateChange(decimal oldValue, decimal newValue)
        {
            var difference = newValue - oldValue;
            var percentageChange = oldValue != 0 ? Math.Round((difference / oldValue) * 100, 2) : 0;
            
            return new
            {
                Difference = difference,
                PercentageChange = percentageChange,
                Trend = difference > 0 ? "up" : difference < 0 ? "down" : "stable"
            };
        }
    }

    public class ComparisonRequestDto
    {
        public DateTime Period1Start { get; set; }
        public DateTime Period1End { get; set; }
        public DateTime Period2Start { get; set; }
        public DateTime Period2End { get; set; }
    }
}
