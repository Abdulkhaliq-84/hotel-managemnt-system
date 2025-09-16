using System.ComponentModel.DataAnnotations;

namespace HotelManagement.API.Models.DTOs
{
    public class GuestDto
    {
        public int Id { get; set; }
        public string Name { get; set; } = string.Empty;
        public string Email { get; set; } = string.Empty;
        public string Phone { get; set; } = string.Empty;
        public DateTime CreatedAt { get; set; }
    }
    
    public class CreateGuestDto
    {
        [Required]
        [StringLength(100)]
        public string Name { get; set; } = string.Empty;
        
        [Required]
        [EmailAddress]
        [StringLength(100)]
        public string Email { get; set; } = string.Empty;
        
        [Required]
        [Phone]
        [StringLength(20)]
        public string Phone { get; set; } = string.Empty;
    }
    
    public class UpdateGuestDto
    {
        [Required]
        [StringLength(100)]
        public string Name { get; set; } = string.Empty;
        
        [Required]
        [EmailAddress]
        [StringLength(100)]
        public string Email { get; set; } = string.Empty;
        
        [Required]
        [Phone]
        [StringLength(20)]
        public string Phone { get; set; } = string.Empty;
    }
    
    public class BulkCreateGuestResultDto
    {
        public List<GuestDto> CreatedGuests { get; set; } = new();
        public int TotalRequested { get; set; }
        public int TotalCreated { get; set; }
        public List<string> Errors { get; set; } = new();
    }
}
