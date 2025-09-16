using Microsoft.AspNetCore.Mvc;
using HotelManagement.API.Models;

namespace HotelManagement.API.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class SeedDataController : ControllerBase
    {
        private readonly HotelManagementDbContext _context;

        public SeedDataController(HotelManagementDbContext context)
        {
            _context = context;
        }

        // POST: api/seeddata
        [HttpPost]
        public async Task<IActionResult> SeedData()
        {
            try
            {
                // Check if data already exists
                if (_context.Rooms.Any())
                {
                    return BadRequest("Data already exists in the database");
                }

                // Seed Rooms
                var rooms = new List<Room>
                {
                    new Room
                    {
                        RoomNumber = "101",
                        RoomType = "Single Room",
                        PricePerNight = 100,
                        Description = "Comfortable single room with basic amenities",
                        IsAvailable = true,
                        CreatedAt = DateTime.UtcNow,
                        UpdatedAt = DateTime.UtcNow
                    },
                    new Room
                    {
                        RoomNumber = "102",
                        RoomType = "Single Room",
                        PricePerNight = 100,
                        Description = "Comfortable single room with basic amenities",
                        IsAvailable = true,
                        CreatedAt = DateTime.UtcNow,
                        UpdatedAt = DateTime.UtcNow
                    },
                    new Room
                    {
                        RoomNumber = "201",
                        RoomType = "Double Room",
                        PricePerNight = 150,
                        Description = "Spacious double room with queen bed",
                        IsAvailable = true,
                        CreatedAt = DateTime.UtcNow,
                        UpdatedAt = DateTime.UtcNow
                    },
                    new Room
                    {
                        RoomNumber = "202",
                        RoomType = "Double Room",
                        PricePerNight = 150,
                        Description = "Spacious double room with queen bed",
                        IsAvailable = true,
                        CreatedAt = DateTime.UtcNow,
                        UpdatedAt = DateTime.UtcNow
                    },
                    new Room
                    {
                        RoomNumber = "301",
                        RoomType = "Suite",
                        PricePerNight = 250,
                        Description = "Luxurious suite with separate living area",
                        IsAvailable = true,
                        CreatedAt = DateTime.UtcNow,
                        UpdatedAt = DateTime.UtcNow
                    }
                };

                _context.Rooms.AddRange(rooms);
                await _context.SaveChangesAsync();

                return Ok(new { message = "Seed data created successfully", roomsCreated = rooms.Count });
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { message = "Error creating seed data", error = ex.Message });
            }
        }
    }
}
