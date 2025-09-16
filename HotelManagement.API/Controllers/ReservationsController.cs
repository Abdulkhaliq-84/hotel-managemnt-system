using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using HotelManagement.API.Models;
using HotelManagement.API.Models.DTOs;
using HotelManagement.API.Services;

namespace HotelManagement.API.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class ReservationsController : ControllerBase
    {
        private readonly HotelManagementDbContext _context;
        private readonly ReservationDataService _reservationService;

        public ReservationsController(HotelManagementDbContext context, ReservationDataService reservationService)
        {
            _context = context;
            _reservationService = reservationService;
        }

        // GET: api/reservations
        [HttpGet]
        public async Task<ActionResult<IEnumerable<ReservationSummaryDto>>> GetReservations()
        {
            var reservations = await _context.Reservations
                .Include(r => r.Guest)
                .Include(r => r.Room)
                .Select(r => new ReservationSummaryDto
                {
                    Id = r.Id,
                    GuestName = r.Guest.Name,
                    RoomNumber = r.Room.RoomNumber,
                    RoomType = r.Room.RoomType,
                    CheckInDate = r.CheckInDate,
                    CheckOutDate = r.CheckOutDate,
                    NumberOfGuests = r.NumberOfGuests,
                    Status = r.Status,
                    PaymentStatus = r.PaymentStatus,
                    TotalPrice = r.TotalPrice
                })
                .ToListAsync();

            return Ok(reservations);
        }

        // GET: api/reservations/5
        [HttpGet("{id}")]
        [ProducesResponseType(typeof(ReservationDto), StatusCodes.Status200OK)]
        [ProducesResponseType(StatusCodes.Status404NotFound)]
        public async Task<ActionResult<ReservationDto>> GetReservation(int id)
        {
            var reservation = await _context.Reservations
                .Include(r => r.Guest)
                .Include(r => r.Room)
                .Select(r => new ReservationDto
                {
                    Id = r.Id,
                    GuestId = r.GuestId,
                    RoomId = r.RoomId,
                    CheckInDate = r.CheckInDate,
                    CheckOutDate = r.CheckOutDate,
                    NumberOfGuests = r.NumberOfGuests,
                    SpecialRequests = r.SpecialRequests,
                    Status = r.Status,
                    PaymentStatus = r.PaymentStatus,
                    TotalPrice = r.TotalPrice,
                    CreatedAt = r.CreatedAt,
                    Guest = new GuestDto
                    {
                        Id = r.Guest.Id,
                        Name = r.Guest.Name,
                        Email = r.Guest.Email,
                        Phone = r.Guest.Phone,
                        CreatedAt = r.Guest.CreatedAt
                    },
                    Room = new RoomDto
                    {
                        Id = r.Room.Id,
                        RoomNumber = r.Room.RoomNumber,
                        RoomType = r.Room.RoomType,
                        PricePerNight = r.Room.PricePerNight,
                        Description = r.Room.Description,
                        IsAvailable = r.Room.IsAvailable,
                        CreatedAt = r.Room.CreatedAt
                    }
                })
                .FirstOrDefaultAsync(r => r.Id == id);

            if (reservation == null)
            {
                return NotFound();
            }

            return Ok(reservation);
        }

        // POST: api/reservations
        [HttpPost]
        public async Task<ActionResult<ReservationDto>> CreateReservation(CreateReservationDto createReservationDto)
        {
            // Validate guest exists
            var guest = await _context.Guests.FindAsync(createReservationDto.GuestId);
            if (guest == null)
            {
                return BadRequest("Guest not found");
            }

            // Validate room exists and is available
            var room = await _context.Rooms.FindAsync(createReservationDto.RoomId);
            if (room == null)
            {
                return BadRequest("Room not found");
            }

            if (!room.IsAvailable)
            {
                return BadRequest("Room is not available");
            }

            // Ensure dates are in UTC for PostgreSQL
            var utcCheckInDate = DateTime.SpecifyKind(createReservationDto.CheckInDate, DateTimeKind.Utc);
            var utcCheckOutDate = DateTime.SpecifyKind(createReservationDto.CheckOutDate, DateTimeKind.Utc);

            // Check for date conflicts
            var conflictingReservation = await _context.Reservations
                .Where(r => r.RoomId == createReservationDto.RoomId &&
                           r.Status != ReservationStatus.Cancelled &&
                           ((utcCheckInDate >= r.CheckInDate && utcCheckInDate < r.CheckOutDate) ||
                            (utcCheckOutDate > r.CheckInDate && utcCheckOutDate <= r.CheckOutDate) ||
                            (utcCheckInDate <= r.CheckInDate && utcCheckOutDate >= r.CheckOutDate)))
                .FirstOrDefaultAsync();

            if (conflictingReservation != null)
            {
                return BadRequest("Room is not available for the selected dates");
            }

            // Calculate total price
            var nights = (utcCheckOutDate - utcCheckInDate).Days;
            var totalPrice = room.PricePerNight * nights;

            var reservation = new Reservation
            {
                GuestId = createReservationDto.GuestId,
                RoomId = createReservationDto.RoomId,
                CheckInDate = utcCheckInDate,
                CheckOutDate = utcCheckOutDate,
                NumberOfGuests = createReservationDto.NumberOfGuests,
                SpecialRequests = createReservationDto.SpecialRequests,
                Status = ReservationStatus.Pending,
                PaymentStatus = PaymentStatus.Pending,
                TotalPrice = totalPrice,
                CreatedAt = DateTime.UtcNow,
                UpdatedAt = DateTime.UtcNow
            };

            _context.Reservations.Add(reservation);
            await _context.SaveChangesAsync();

            // Load the created reservation with related data
            var createdReservation = await _context.Reservations
                .Include(r => r.Guest)
                .Include(r => r.Room)
                .FirstOrDefaultAsync(r => r.Id == reservation.Id);

            var reservationDto = new ReservationDto
            {
                Id = createdReservation!.Id,
                GuestId = createdReservation.GuestId,
                RoomId = createdReservation.RoomId,
                CheckInDate = createdReservation.CheckInDate,
                CheckOutDate = createdReservation.CheckOutDate,
                NumberOfGuests = createdReservation.NumberOfGuests,
                SpecialRequests = createdReservation.SpecialRequests,
                Status = createdReservation.Status,
                PaymentStatus = createdReservation.PaymentStatus,
                TotalPrice = createdReservation.TotalPrice,
                CreatedAt = createdReservation.CreatedAt,
                Guest = new GuestDto
                {
                    Id = createdReservation.Guest.Id,
                    Name = createdReservation.Guest.Name,
                    Email = createdReservation.Guest.Email,
                    Phone = createdReservation.Guest.Phone,
                    CreatedAt = createdReservation.Guest.CreatedAt
                },
                Room = new RoomDto
                {
                    Id = createdReservation.Room.Id,
                    RoomNumber = createdReservation.Room.RoomNumber,
                    RoomType = createdReservation.Room.RoomType,
                    PricePerNight = createdReservation.Room.PricePerNight,
                    Description = createdReservation.Room.Description,
                    IsAvailable = createdReservation.Room.IsAvailable,
                    CreatedAt = createdReservation.Room.CreatedAt
                }
            };

            return CreatedAtAction(nameof(GetReservation), new { id = reservation.Id }, reservationDto);
        }

        // PUT: api/reservations/5
        [HttpPut("{id}")]
        [ProducesResponseType(StatusCodes.Status204NoContent)]
        [ProducesResponseType(StatusCodes.Status404NotFound)]
        public async Task<IActionResult> UpdateReservation(int id, UpdateReservationDto updateReservationDto)
        {
            var reservation = await _context.Reservations.FindAsync(id);
            if (reservation == null)
            {
                return NotFound();
            }

            reservation.GuestId = updateReservationDto.GuestId;
            reservation.RoomId = updateReservationDto.RoomId;
            reservation.CheckInDate = updateReservationDto.CheckInDate;
            reservation.CheckOutDate = updateReservationDto.CheckOutDate;
            reservation.NumberOfGuests = updateReservationDto.NumberOfGuests;
            reservation.SpecialRequests = updateReservationDto.SpecialRequests;
            reservation.Status = updateReservationDto.Status;
            reservation.PaymentStatus = updateReservationDto.PaymentStatus;
            reservation.UpdatedAt = DateTime.UtcNow;

            try
            {
                await _context.SaveChangesAsync();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!ReservationExists(id))
                {
                    return NotFound();
                }
                throw;
            }

            return NoContent();
        }

        // DELETE: api/reservations/5
        [HttpDelete("{id}")]
        [ProducesResponseType(StatusCodes.Status204NoContent)]
        [ProducesResponseType(StatusCodes.Status404NotFound)]
        public async Task<IActionResult> DeleteReservation(int id)
        {
            var reservation = await _context.Reservations.FindAsync(id);
            if (reservation == null)
            {
                return NotFound();
            }

            _context.Reservations.Remove(reservation);
            await _context.SaveChangesAsync();

            return NoContent();
        }

        [HttpPatch("{id}/payment-status")]
        [ProducesResponseType(StatusCodes.Status200OK)]
        [ProducesResponseType(StatusCodes.Status404NotFound)]
        [ProducesResponseType(StatusCodes.Status400BadRequest)]
        public async Task<ActionResult<ReservationDto>> UpdatePaymentStatus(int id, [FromBody] UpdatePaymentStatusDto updatePaymentStatusDto)
        {
            try
            {
                var reservation = await _context.Reservations
                    .Include(r => r.Guest)
                    .Include(r => r.Room)
                    .FirstOrDefaultAsync(r => r.Id == id);

                if (reservation == null)
                {
                    return NotFound("Reservation not found");
                }

                // Validate payment status transition
                if (!IsValidPaymentStatusTransition(reservation.PaymentStatus, updatePaymentStatusDto.PaymentStatus))
                {
                    return BadRequest($"Invalid payment status transition from {reservation.PaymentStatus} to {updatePaymentStatusDto.PaymentStatus}");
                }

                reservation.PaymentStatus = updatePaymentStatusDto.PaymentStatus;
                reservation.UpdatedAt = DateTime.UtcNow;

                await _context.SaveChangesAsync();

                var reservationDto = new ReservationDto
                {
                    Id = reservation.Id,
                    GuestId = reservation.GuestId,
                    RoomId = reservation.RoomId,
                    CheckInDate = reservation.CheckInDate,
                    CheckOutDate = reservation.CheckOutDate,
                    NumberOfGuests = reservation.NumberOfGuests,
                    SpecialRequests = reservation.SpecialRequests,
                    Status = reservation.Status,
                    PaymentStatus = reservation.PaymentStatus,
                    TotalPrice = reservation.TotalPrice,
                    CreatedAt = reservation.CreatedAt,
                    Guest = new GuestDto
                    {
                        Id = reservation.Guest.Id,
                        Name = reservation.Guest.Name,
                        Email = reservation.Guest.Email,
                        Phone = reservation.Guest.Phone,
                        CreatedAt = reservation.Guest.CreatedAt
                    },
                    Room = new RoomDto
                    {
                        Id = reservation.Room.Id,
                        RoomNumber = reservation.Room.RoomNumber,
                        RoomType = reservation.Room.RoomType,
                        PricePerNight = reservation.Room.PricePerNight,
                        Description = reservation.Room.Description,
                        IsAvailable = reservation.Room.IsAvailable,
                        CreatedAt = reservation.Room.CreatedAt
                    }
                };

                return Ok(reservationDto);
            }
            catch (Exception ex)
            {
                return StatusCode(500, $"An error occurred: {ex.Message}");
            }
        }

        private bool IsValidPaymentStatusTransition(PaymentStatus currentStatus, PaymentStatus newStatus)
        {
            return currentStatus switch
            {
                PaymentStatus.Pending => newStatus == PaymentStatus.Paid || newStatus == PaymentStatus.Failed,
                PaymentStatus.Paid => newStatus == PaymentStatus.Refunded,
                PaymentStatus.Failed => newStatus == PaymentStatus.Pending || newStatus == PaymentStatus.Paid,
                PaymentStatus.Refunded => false, // Cannot change from refunded
                _ => false
            };
        }

        [HttpGet("check-availability")]
        public async Task<ActionResult<IEnumerable<RoomAvailabilityDto>>> CheckRoomAvailability(
            [FromQuery] DateTime checkInDate, 
            [FromQuery] DateTime checkOutDate)
        {
            try
            {
                // Ensure dates are in UTC for PostgreSQL
                var utcCheckInDate = DateTime.SpecifyKind(checkInDate, DateTimeKind.Utc);
                var utcCheckOutDate = DateTime.SpecifyKind(checkOutDate, DateTimeKind.Utc);

                var rooms = await _context.Rooms.ToListAsync();
                var availability = new List<RoomAvailabilityDto>();

                foreach (var room in rooms)
                {
                    var conflictingReservation = await _context.Reservations
                        .Where(r => r.RoomId == room.Id &&
                                   r.Status != ReservationStatus.Cancelled &&
                                   ((utcCheckInDate >= r.CheckInDate && utcCheckInDate < r.CheckOutDate) ||
                                    (utcCheckOutDate > r.CheckInDate && utcCheckOutDate <= r.CheckOutDate) ||
                                    (utcCheckInDate <= r.CheckInDate && utcCheckOutDate >= r.CheckOutDate)))
                        .FirstOrDefaultAsync();

                    availability.Add(new RoomAvailabilityDto
                    {
                        RoomId = room.Id,
                        RoomNumber = room.RoomNumber,
                        RoomType = room.RoomType,
                        PricePerNight = room.PricePerNight,
                        Description = room.Description ?? string.Empty,
                        IsAvailable = room.IsAvailable && conflictingReservation == null
                    });
                }

                return Ok(availability);
            }
            catch (Exception ex)
            {
                return StatusCode(500, $"An error occurred: {ex.Message}");
            }
        }

        // POST: api/reservations/bulk
        [HttpPost("bulk")]
        public async Task<ActionResult<BulkCreateReservationResultDto>> CreateBulkReservations(
            [FromBody] List<CreateReservationDto> reservationDtos)
        {
            if (reservationDtos == null || !reservationDtos.Any())
            {
                return BadRequest("No reservations provided");
            }

            var createdReservations = new List<ReservationSummaryDto>();
            var errors = new List<string>();
            var skipped = 0;

            foreach (var dto in reservationDtos)
            {
                try
                {
                    // Check for conflicts
                    var utcCheckInDate = DateTime.SpecifyKind(dto.CheckInDate, DateTimeKind.Utc);
                    var utcCheckOutDate = DateTime.SpecifyKind(dto.CheckOutDate, DateTimeKind.Utc);

                    var conflictingReservation = await _context.Reservations
                        .Where(r => r.RoomId == dto.RoomId &&
                                   r.Status != ReservationStatus.Cancelled &&
                                   ((utcCheckInDate >= r.CheckInDate && utcCheckInDate < r.CheckOutDate) ||
                                    (utcCheckOutDate > r.CheckInDate && utcCheckOutDate <= r.CheckOutDate) ||
                                    (utcCheckInDate <= r.CheckInDate && utcCheckOutDate >= r.CheckOutDate)))
                        .FirstOrDefaultAsync();

                    if (conflictingReservation != null)
                    {
                        skipped++;
                        errors.Add($"Room {dto.RoomId} not available for dates {dto.CheckInDate:yyyy-MM-dd} to {dto.CheckOutDate:yyyy-MM-dd}");
                        continue;
                    }

                    // Get room for pricing
                    var room = await _context.Rooms.FindAsync(dto.RoomId);
                    if (room == null)
                    {
                        errors.Add($"Room {dto.RoomId} not found");
                        continue;
                    }

                    // Calculate total price
                    var nights = (utcCheckOutDate - utcCheckInDate).Days;
                    var totalPrice = room.PricePerNight * nights;

                    var reservation = new Reservation
                    {
                        GuestId = dto.GuestId,
                        RoomId = dto.RoomId,
                        CheckInDate = utcCheckInDate,
                        CheckOutDate = utcCheckOutDate,
                        NumberOfGuests = dto.NumberOfGuests,
                        SpecialRequests = dto.SpecialRequests,
                        Status = ReservationStatus.Pending,
                        PaymentStatus = PaymentStatus.Pending,
                        TotalPrice = totalPrice,
                        CreatedAt = DateTime.UtcNow,
                        UpdatedAt = DateTime.UtcNow
                    };

                    _context.Reservations.Add(reservation);
                    await _context.SaveChangesAsync();

                    // Load related data for response
                    var guest = await _context.Guests.FindAsync(dto.GuestId);

                    createdReservations.Add(new ReservationSummaryDto
                    {
                        Id = reservation.Id,
                        GuestName = guest?.Name ?? "Unknown",
                        RoomNumber = room.RoomNumber,
                        RoomType = room.RoomType,
                        CheckInDate = reservation.CheckInDate,
                        CheckOutDate = reservation.CheckOutDate,
                        NumberOfGuests = reservation.NumberOfGuests,
                        Status = reservation.Status,
                        PaymentStatus = reservation.PaymentStatus,
                        TotalPrice = reservation.TotalPrice
                    });
                }
                catch (Exception ex)
                {
                    errors.Add($"Error creating reservation: {ex.Message}");
                }
            }

            return Ok(new BulkCreateReservationResultDto
            {
                CreatedReservations = createdReservations,
                TotalRequested = reservationDtos.Count,
                TotalCreated = createdReservations.Count,
                TotalSkipped = skipped,
                Errors = errors
            });
        }

        // POST: api/reservations/populate
        [HttpPost("populate")]
        public async Task<ActionResult<BulkCreateReservationResultDto>> PopulateReservations(
            [FromQuery] string type = "mixed",
            [FromQuery] int count = 10)
        {
            if (count < 1 || count > 100)
            {
                return BadRequest("Count must be between 1 and 100");
            }

            List<CreateReservationDto> reservationsToCreate;

            try
            {
                switch (type.ToLower())
                {
                    case "business":
                        reservationsToCreate = await _reservationService.GenerateBusinessReservations(count);
                        break;
                    case "vacation":
                        reservationsToCreate = await _reservationService.GenerateVacationReservations(count);
                        break;
                    case "weekend":
                        reservationsToCreate = await _reservationService.GenerateWeekendReservations(count);
                        break;
                    case "mixed":
                    default:
                        reservationsToCreate = await _reservationService.GenerateRandomReservations(count);
                        break;
                }

                return await CreateBulkReservations(reservationsToCreate);
            }
            catch (Exception ex)
            {
                return BadRequest($"Error generating reservations: {ex.Message}");
            }
        }

        // POST: api/reservations/populate-group
        [HttpPost("populate-group")]
        public async Task<ActionResult<BulkCreateReservationResultDto>> PopulateGroupReservations(
            [FromQuery] int numberOfRooms = 5,
            [FromQuery] DateTime? checkInDate = null,
            [FromQuery] DateTime? checkOutDate = null,
            [FromQuery] string groupName = "Conference Group")
        {
            if (numberOfRooms < 1 || numberOfRooms > 50)
            {
                return BadRequest("Number of rooms must be between 1 and 50");
            }

            var checkIn = checkInDate ?? DateTime.UtcNow.Date.AddDays(7);
            var checkOut = checkOutDate ?? checkIn.AddDays(3);

            try
            {
                var reservationsToCreate = await _reservationService.GenerateGroupReservations(
                    numberOfRooms, checkIn, checkOut, groupName);
                
                return await CreateBulkReservations(reservationsToCreate);
            }
            catch (Exception ex)
            {
                return BadRequest($"Error creating group reservations: {ex.Message}");
            }
        }

        private bool ReservationExists(int id)
        {
            return _context.Reservations.Any(e => e.Id == id);
        }
    }

    public class RoomAvailabilityDto
    {
        public int RoomId { get; set; }
        public string RoomNumber { get; set; } = string.Empty;
        public string RoomType { get; set; } = string.Empty;
        public decimal PricePerNight { get; set; }
        public string Description { get; set; } = string.Empty;
        public bool IsAvailable { get; set; }
    }

    public class UpdatePaymentStatusDto
    {
        public PaymentStatus PaymentStatus { get; set; }
    }
}
