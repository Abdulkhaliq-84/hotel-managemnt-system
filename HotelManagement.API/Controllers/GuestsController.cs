using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using HotelManagement.API.Models;
using HotelManagement.API.Models.DTOs;
using HotelManagement.API.Services;

namespace HotelManagement.API.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class GuestsController : ControllerBase
    {
        private readonly HotelManagementDbContext _context;

        public GuestsController(HotelManagementDbContext context)
        {
            _context = context;
        }

        // GET: api/guests
        [HttpGet]
        public async Task<ActionResult<IEnumerable<GuestDto>>> GetGuests()
        {
            var guests = await _context.Guests
                .Select(g => new GuestDto
                {
                    Id = g.Id,
                    Name = g.Name,
                    Email = g.Email,
                    Phone = g.Phone,
                    CreatedAt = g.CreatedAt
                })
                .ToListAsync();

            return Ok(guests);
        }

        // GET: api/guests/5
        [HttpGet("{id}")]
        public async Task<ActionResult<GuestDto>> GetGuest(int id)
        {
            var guest = await _context.Guests
                .Select(g => new GuestDto
                {
                    Id = g.Id,
                    Name = g.Name,
                    Email = g.Email,
                    Phone = g.Phone,
                    CreatedAt = g.CreatedAt
                })
                .FirstOrDefaultAsync(g => g.Id == id);

            if (guest == null)
            {
                return NotFound();
            }

            return Ok(guest);
        }

        // POST: api/guests
        [HttpPost]
        public async Task<ActionResult<GuestDto>> CreateGuest(CreateGuestDto createGuestDto)
        {
            var guest = new Guest
            {
                Name = createGuestDto.Name,
                Email = createGuestDto.Email,
                Phone = createGuestDto.Phone,
                CreatedAt = DateTime.UtcNow,
                UpdatedAt = DateTime.UtcNow
            };

            _context.Guests.Add(guest);
            await _context.SaveChangesAsync();

            var guestDto = new GuestDto
            {
                Id = guest.Id,
                Name = guest.Name,
                Email = guest.Email,
                Phone = guest.Phone,
                CreatedAt = guest.CreatedAt
            };

            return CreatedAtAction(nameof(GetGuest), new { id = guest.Id }, guestDto);
        }

        // PUT: api/guests/5
        [HttpPut("{id}")]
        public async Task<IActionResult> UpdateGuest(int id, UpdateGuestDto updateGuestDto)
        {
            var guest = await _context.Guests.FindAsync(id);
            if (guest == null)
            {
                return NotFound();
            }

            guest.Name = updateGuestDto.Name;
            guest.Email = updateGuestDto.Email;
            guest.Phone = updateGuestDto.Phone;
            guest.UpdatedAt = DateTime.UtcNow;

            try
            {
                await _context.SaveChangesAsync();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!GuestExists(id))
                {
                    return NotFound();
                }
                throw;
            }

            return NoContent();
        }

        // POST: api/guests/bulk
        [HttpPost("bulk")]
        public async Task<ActionResult<BulkCreateGuestResultDto>> CreateGuestsBulk(List<CreateGuestDto> createGuestDtos)
        {
            if (createGuestDtos == null || !createGuestDtos.Any())
            {
                return BadRequest("No guests provided for bulk creation");
            }

            var createdGuests = new List<GuestDto>();
            var errors = new List<string>();

            foreach (var guestDto in createGuestDtos)
            {
                try
                {
                    // Check if email already exists
                    var existingGuest = await _context.Guests
                        .FirstOrDefaultAsync(g => g.Email == guestDto.Email);
                    
                    if (existingGuest != null)
                    {
                        errors.Add($"Guest with email {guestDto.Email} already exists");
                        continue;
                    }

                    var guest = new Guest
                    {
                        Name = guestDto.Name,
                        Email = guestDto.Email,
                        Phone = guestDto.Phone,
                        CreatedAt = DateTime.UtcNow,
                        UpdatedAt = DateTime.UtcNow
                    };

                    _context.Guests.Add(guest);
                    await _context.SaveChangesAsync();

                    createdGuests.Add(new GuestDto
                    {
                        Id = guest.Id,
                        Name = guest.Name,
                        Email = guest.Email,
                        Phone = guest.Phone,
                        CreatedAt = guest.CreatedAt
                    });
                }
                catch (Exception ex)
                {
                    errors.Add($"Error creating guest {guestDto.Name}: {ex.Message}");
                }
            }

            return Ok(new BulkCreateGuestResultDto
            {
                CreatedGuests = createdGuests,
                TotalRequested = createGuestDtos.Count,
                TotalCreated = createdGuests.Count,
                Errors = errors
            });
        }

        // POST: api/guests/populate-sample
        [HttpPost("populate-sample")]
        public async Task<ActionResult<BulkCreateGuestResultDto>> PopulateSampleGuests([FromQuery] string type = "all")
        {
            List<CreateGuestDto> guestsToCreate;

            switch (type.ToLower())
            {
                case "premium":
                    guestsToCreate = GuestDataService.GetPremiumGuests();
                    break;
                case "business":
                    guestsToCreate = GuestDataService.GetBusinessGuests();
                    break;
                case "leisure":
                    guestsToCreate = GuestDataService.GetLeisureGuests();
                    break;
                case "all":
                    guestsToCreate = GuestDataService.GetAllSampleGuests();
                    break;
                default:
                    return BadRequest($"Invalid type: {type}. Valid options are: all, premium, business, leisure");
            }

            return await CreateGuestsBulk(guestsToCreate);
        }

        // POST: api/guests/populate-random
        [HttpPost("populate-random")]
        public async Task<ActionResult<BulkCreateGuestResultDto>> PopulateRandomGuests([FromQuery] int count = 10)
        {
            if (count < 1 || count > 100)
            {
                return BadRequest("Count must be between 1 and 100");
            }

            var guestsToCreate = GuestDataService.GenerateRandomGuests(count);
            return await CreateGuestsBulk(guestsToCreate);
        }

        // DELETE: api/guests/5
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteGuest(int id)
        {
            var guest = await _context.Guests.FindAsync(id);
            if (guest == null)
            {
                return NotFound();
            }

            _context.Guests.Remove(guest);
            await _context.SaveChangesAsync();

            return NoContent();
        }

        private bool GuestExists(int id)
        {
            return _context.Guests.Any(e => e.Id == id);
        }
    }
}
