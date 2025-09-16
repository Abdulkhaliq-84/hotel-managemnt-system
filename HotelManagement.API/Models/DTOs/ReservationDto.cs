using System.ComponentModel.DataAnnotations;
using HotelManagement.API.Models;

namespace HotelManagement.API.Models.DTOs
{
    public class ReservationDto
    {
        public int Id { get; set; }
        public int GuestId { get; set; }
        public int RoomId { get; set; }
        public DateTime CheckInDate { get; set; }
        public DateTime CheckOutDate { get; set; }
        public int NumberOfGuests { get; set; }
        public string? SpecialRequests { get; set; }
        public ReservationStatus Status { get; set; }
        public PaymentStatus PaymentStatus { get; set; }
        public decimal TotalPrice { get; set; }
        public DateTime CreatedAt { get; set; }
        
        // Navigation properties
        public GuestDto? Guest { get; set; }
        public RoomDto? Room { get; set; }
    }
    
    public class CreateReservationDto
    {
        [Required]
        public int GuestId { get; set; }
        
        [Required]
        public int RoomId { get; set; }
        
        [Required]
        public DateTime CheckInDate { get; set; }
        
        [Required]
        public DateTime CheckOutDate { get; set; }
        
        [Required]
        [Range(1, 10, ErrorMessage = "Number of guests must be between 1 and 10")]
        public int NumberOfGuests { get; set; }
        
        [StringLength(1000)]
        public string? SpecialRequests { get; set; }
    }
    
    public class UpdateReservationDto
    {
        [Required]
        public int GuestId { get; set; }
        
        [Required]
        public int RoomId { get; set; }
        
        [Required]
        public DateTime CheckInDate { get; set; }
        
        [Required]
        public DateTime CheckOutDate { get; set; }
        
        [Required]
        [Range(1, 10, ErrorMessage = "Number of guests must be between 1 and 10")]
        public int NumberOfGuests { get; set; }
        
        [StringLength(1000)]
        public string? SpecialRequests { get; set; }
        
        [Required]
        public ReservationStatus Status { get; set; }
        
        [Required]
        public PaymentStatus PaymentStatus { get; set; }
    }
    
    public class ReservationSummaryDto
    {
        public int Id { get; set; }
        public string GuestName { get; set; } = string.Empty;
        public string RoomNumber { get; set; } = string.Empty;
        public string RoomType { get; set; } = string.Empty;
        public DateTime CheckInDate { get; set; }
        public DateTime CheckOutDate { get; set; }
        public int NumberOfGuests { get; set; }
        public ReservationStatus Status { get; set; }
        public PaymentStatus PaymentStatus { get; set; }
        public decimal TotalPrice { get; set; }
    }
    
    public class BulkCreateReservationResultDto
    {
        public List<ReservationSummaryDto> CreatedReservations { get; set; } = new();
        public int TotalRequested { get; set; }
        public int TotalCreated { get; set; }
        public int TotalSkipped { get; set; }
        public List<string> Errors { get; set; } = new();
    }
}
