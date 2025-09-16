using System.ComponentModel.DataAnnotations;

namespace HotelManagement.API.Models
{
    public class Room
    {
        public int Id { get; set; }
        
        [Required]
        [StringLength(50)]
        public string RoomNumber { get; set; } = string.Empty;
        
        [Required]
        [StringLength(50)]
        public string RoomType { get; set; } = string.Empty;
        
        [Required]
        public decimal PricePerNight { get; set; }
        
        [StringLength(500)]
        public string? Description { get; set; }
        
        public bool IsAvailable { get; set; } = true;
        
        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
        public DateTime UpdatedAt { get; set; } = DateTime.UtcNow;
        
        // Navigation property
        public virtual ICollection<Reservation> Reservations { get; set; } = new List<Reservation>();
    }
}
