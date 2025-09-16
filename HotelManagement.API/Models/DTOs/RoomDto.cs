using System.ComponentModel.DataAnnotations;

namespace HotelManagement.API.Models.DTOs
{
    public class RoomDto
    {
        public int Id { get; set; }
        public string RoomNumber { get; set; } = string.Empty;
        public string RoomType { get; set; } = string.Empty;
        public decimal PricePerNight { get; set; }
        public string? Description { get; set; }
        public bool IsAvailable { get; set; }
        public DateTime CreatedAt { get; set; }
    }
    
    public class CreateRoomDto
    {
        [Required]
        [StringLength(50)]
        public string RoomNumber { get; set; } = string.Empty;
        
        [Required]
        [StringLength(50)]
        public string RoomType { get; set; } = string.Empty;
        
        [Required]
        [Range(0.01, double.MaxValue, ErrorMessage = "Price must be greater than 0")]
        public decimal PricePerNight { get; set; }
        
        [StringLength(500)]
        public string? Description { get; set; }
        
        public bool IsAvailable { get; set; } = true;
    }
    
    public class UpdateRoomDto
    {
        [Required]
        [StringLength(50)]
        public string RoomNumber { get; set; } = string.Empty;
        
        [Required]
        [StringLength(50)]
        public string RoomType { get; set; } = string.Empty;
        
        [Required]
        [Range(0.01, double.MaxValue, ErrorMessage = "Price must be greater than 0")]
        public decimal PricePerNight { get; set; }
        
        [StringLength(500)]
        public string? Description { get; set; }
        
        public bool IsAvailable { get; set; }
    }
    
    public class BulkCreateRoomResultDto
    {
        public List<RoomDto> CreatedRooms { get; set; } = new();
        public int TotalRequested { get; set; }
        public int TotalCreated { get; set; }
        public List<string> Errors { get; set; } = new();
    }
}
