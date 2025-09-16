using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using HotelManagement.API.Models;
using HotelManagement.API.Models.DTOs;
using HotelManagement.API.Services;

namespace HotelManagement.API.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class RoomsController : ControllerBase
    {
        private readonly HotelManagementDbContext _context;

        public RoomsController(HotelManagementDbContext context)
        {
            _context = context;
        }

        // GET: api/rooms
        [HttpGet]
        public async Task<ActionResult<IEnumerable<RoomDto>>> GetRooms()
        {
            var rooms = await _context.Rooms
                .Select(r => new RoomDto
                {
                    Id = r.Id,
                    RoomNumber = r.RoomNumber,
                    RoomType = r.RoomType,
                    PricePerNight = r.PricePerNight,
                    Description = r.Description,
                    IsAvailable = r.IsAvailable,
                    CreatedAt = r.CreatedAt
                })
                .ToListAsync();

            return Ok(rooms);
        }

        // GET: api/rooms/5
        [HttpGet("{id}")]
        public async Task<ActionResult<RoomDto>> GetRoom(int id)
        {
            var room = await _context.Rooms
                .Select(r => new RoomDto
                {
                    Id = r.Id,
                    RoomNumber = r.RoomNumber,
                    RoomType = r.RoomType,
                    PricePerNight = r.PricePerNight,
                    Description = r.Description,
                    IsAvailable = r.IsAvailable,
                    CreatedAt = r.CreatedAt
                })
                .FirstOrDefaultAsync(r => r.Id == id);

            if (room == null)
            {
                return NotFound();
            }

            return Ok(room);
        }

        // GET: api/rooms/available
        [HttpGet("available")]
        public async Task<ActionResult<IEnumerable<RoomDto>>> GetAvailableRooms()
        {
            var rooms = await _context.Rooms
                .Where(r => r.IsAvailable)
                .Select(r => new RoomDto
                {
                    Id = r.Id,
                    RoomNumber = r.RoomNumber,
                    RoomType = r.RoomType,
                    PricePerNight = r.PricePerNight,
                    Description = r.Description,
                    IsAvailable = r.IsAvailable,
                    CreatedAt = r.CreatedAt
                })
                .ToListAsync();

            return Ok(rooms);
        }

        // POST: api/rooms
        [HttpPost]
        public async Task<ActionResult<RoomDto>> CreateRoom(CreateRoomDto createRoomDto)
        {
            var room = new Room
            {
                RoomNumber = createRoomDto.RoomNumber,
                RoomType = createRoomDto.RoomType,
                PricePerNight = createRoomDto.PricePerNight,
                Description = createRoomDto.Description,
                IsAvailable = createRoomDto.IsAvailable,
                CreatedAt = DateTime.UtcNow,
                UpdatedAt = DateTime.UtcNow
            };

            _context.Rooms.Add(room);
            await _context.SaveChangesAsync();

            var roomDto = new RoomDto
            {
                Id = room.Id,
                RoomNumber = room.RoomNumber,
                RoomType = room.RoomType,
                PricePerNight = room.PricePerNight,
                Description = room.Description,
                IsAvailable = room.IsAvailable,
                CreatedAt = room.CreatedAt
            };

            return CreatedAtAction(nameof(GetRoom), new { id = room.Id }, roomDto);
        }

        // PUT: api/rooms/5
        [HttpPut("{id}")]
        public async Task<IActionResult> UpdateRoom(int id, UpdateRoomDto updateRoomDto)
        {
            var room = await _context.Rooms.FindAsync(id);
            if (room == null)
            {
                return NotFound();
            }

            room.RoomNumber = updateRoomDto.RoomNumber;
            room.RoomType = updateRoomDto.RoomType;
            room.PricePerNight = updateRoomDto.PricePerNight;
            room.Description = updateRoomDto.Description;
            room.IsAvailable = updateRoomDto.IsAvailable;
            room.UpdatedAt = DateTime.UtcNow;

            try
            {
                await _context.SaveChangesAsync();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!RoomExists(id))
                {
                    return NotFound();
                }
                throw;
            }

            return NoContent();
        }

        // POST: api/rooms/bulk
        [HttpPost("bulk")]
        public async Task<ActionResult<BulkCreateRoomResultDto>> CreateRoomsBulk(List<CreateRoomDto> createRoomDtos)
        {
            if (createRoomDtos == null || !createRoomDtos.Any())
            {
                return BadRequest("No rooms provided for bulk creation");
            }

            var createdRooms = new List<RoomDto>();
            var errors = new List<string>();

            foreach (var roomDto in createRoomDtos)
            {
                try
                {
                    // Check if room number already exists
                    var existingRoom = await _context.Rooms
                        .FirstOrDefaultAsync(r => r.RoomNumber == roomDto.RoomNumber);
                    
                    if (existingRoom != null)
                    {
                        errors.Add($"Room {roomDto.RoomNumber} already exists");
                        continue;
                    }

                    var room = new Room
                    {
                        RoomNumber = roomDto.RoomNumber,
                        RoomType = roomDto.RoomType,
                        PricePerNight = roomDto.PricePerNight,
                        Description = roomDto.Description,
                        IsAvailable = roomDto.IsAvailable,
                        CreatedAt = DateTime.UtcNow,
                        UpdatedAt = DateTime.UtcNow
                    };

                    _context.Rooms.Add(room);
                    await _context.SaveChangesAsync();

                    createdRooms.Add(new RoomDto
                    {
                        Id = room.Id,
                        RoomNumber = room.RoomNumber,
                        RoomType = room.RoomType,
                        PricePerNight = room.PricePerNight,
                        Description = room.Description,
                        IsAvailable = room.IsAvailable,
                        CreatedAt = room.CreatedAt
                    });
                }
                catch (Exception ex)
                {
                    errors.Add($"Error creating room {roomDto.RoomNumber}: {ex.Message}");
                }
            }

            return Ok(new BulkCreateRoomResultDto
            {
                CreatedRooms = createdRooms,
                TotalRequested = createRoomDtos.Count,
                TotalCreated = createdRooms.Count,
                Errors = errors
            });
        }

        // POST: api/rooms/populate-sample
        [HttpPost("populate-sample")]
        public async Task<ActionResult<BulkCreateRoomResultDto>> PopulateSampleRooms([FromQuery] string type = "standard")
        {
            List<CreateRoomDto> roomsToCreate;

            switch (type.ToLower())
            {
                case "standard":
                    roomsToCreate = RoomDataService.GenerateStandardHotelRooms();
                    break;
                case "luxury":
                    roomsToCreate = RoomDataService.GenerateLuxuryHotelRooms();
                    break;
                case "boutique":
                    roomsToCreate = RoomDataService.GenerateBoutiqueHotelRooms();
                    break;
                case "economy":
                    roomsToCreate = RoomDataService.GenerateEconomyHotelRooms();
                    break;
                case "business":
                    roomsToCreate = RoomDataService.GenerateBusinessHotelRooms();
                    break;
                case "resort":
                    roomsToCreate = RoomDataService.GenerateResortRooms();
                    break;
                case "all":
                    roomsToCreate = RoomDataService.GetAllSampleRooms();
                    break;
                default:
                    return BadRequest($"Invalid type: {type}. Valid options are: standard, luxury, boutique, economy, business, resort, all");
            }

            return await CreateRoomsBulk(roomsToCreate);
        }

        // POST: api/rooms/populate-floor
        [HttpPost("populate-floor")]
        public async Task<ActionResult<BulkCreateRoomResultDto>> PopulateFloorRooms(
            [FromQuery] int floorNumber = 1, 
            [FromQuery] int roomsPerFloor = 10)
        {
            if (floorNumber < 1 || floorNumber > 20)
            {
                return BadRequest("Floor number must be between 1 and 20");
            }

            if (roomsPerFloor < 1 || roomsPerFloor > 50)
            {
                return BadRequest("Rooms per floor must be between 1 and 50");
            }

            var roomsToCreate = RoomDataService.GenerateFloorRooms(floorNumber, roomsPerFloor);
            return await CreateRoomsBulk(roomsToCreate);
        }

        // POST: api/rooms/populate-custom
        [HttpPost("populate-custom")]
        public async Task<ActionResult<BulkCreateRoomResultDto>> PopulateCustomRooms(
            [FromQuery] int count = 10,
            [FromQuery] string roomType = null)
        {
            if (count < 1 || count > 100)
            {
                return BadRequest("Count must be between 1 and 100");
            }

            var roomsToCreate = RoomDataService.GenerateCustomRooms(count, roomType);
            return await CreateRoomsBulk(roomsToCreate);
        }

        // DELETE: api/rooms/5
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteRoom(int id)
        {
            var room = await _context.Rooms.FindAsync(id);
            if (room == null)
            {
                return NotFound();
            }

            _context.Rooms.Remove(room);
            await _context.SaveChangesAsync();

            return NoContent();
        }

        private bool RoomExists(int id)
        {
            return _context.Rooms.Any(e => e.Id == id);
        }
    }
}
