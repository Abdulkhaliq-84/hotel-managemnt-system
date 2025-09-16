using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace HotelManagement.API.Models
{
    public enum ReservationStatus
    {
        Pending,
        Confirmed,
        CheckedIn,
        CheckedOut,
        Cancelled
    }
    
    public enum PaymentStatus
    {
        Pending,
        Paid,
        Failed,
        Refunded
    }
    
    public class Reservation
    {
        public int Id { get; set; }
        
        [Required]
        public int GuestId { get; set; }
        
        [Required]
        public int RoomId { get; set; }
        
        [Required]
        public DateTime CheckInDate { get; set; }
        
        [Required]
        public DateTime CheckOutDate { get; set; }
        
        [Required]
        [Range(1, 10)]
        public int NumberOfGuests { get; set; }
        
        [StringLength(1000)]
        public string? SpecialRequests { get; set; }
        
        [Required]
        public ReservationStatus Status { get; set; } = ReservationStatus.Pending;
        
        [Required]
        public PaymentStatus PaymentStatus { get; set; } = PaymentStatus.Pending;
        
        [Required]
        [Column(TypeName = "decimal(10,2)")]
        public decimal TotalPrice { get; set; }
        
        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
        public DateTime UpdatedAt { get; set; } = DateTime.UtcNow;
        
        // Navigation properties
        public virtual Guest Guest { get; set; } = null!;
        public virtual Room Room { get; set; } = null!;
    }
}
