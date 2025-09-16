using HotelManagement.API.Models;
using HotelManagement.API.Models.DTOs;
using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace HotelManagement.API.Services
{
    public class ReservationDataService
    {
        private readonly HotelManagementDbContext _context;
        private readonly Random _random = new Random();

        public ReservationDataService(HotelManagementDbContext context)
        {
            _context = context;
        }

        public async Task<List<CreateReservationDto>> GenerateRandomReservations(
            int count, 
            DateTime? startDate = null, 
            DateTime? endDate = null,
            string reservationType = "mixed")
        {
            var reservations = new List<CreateReservationDto>();
            
            // Get available guests and rooms
            var guests = await _context.Guests.Select(g => g.Id).ToListAsync();
            var rooms = await _context.Rooms.Where(r => r.IsAvailable).ToListAsync();
            
            if (!guests.Any() || !rooms.Any())
            {
                throw new InvalidOperationException("No guests or available rooms found in the database");
            }

            var baseDate = startDate ?? DateTime.UtcNow.Date;
            var maxDate = endDate ?? baseDate.AddMonths(3);

            for (int i = 0; i < count; i++)
            {
                var guestId = guests[_random.Next(guests.Count)];
                var room = rooms[_random.Next(rooms.Count)];
                
                // Generate reservation dates based on type
                var (checkIn, checkOut) = GenerateReservationDates(baseDate, maxDate, reservationType);
                
                // Generate number of guests based on room type
                var numberOfGuests = GenerateGuestCount(room.RoomType);
                
                // Generate special requests
                var specialRequests = GenerateSpecialRequests();

                reservations.Add(new CreateReservationDto
                {
                    GuestId = guestId,
                    RoomId = room.Id,
                    CheckInDate = checkIn,
                    CheckOutDate = checkOut,
                    NumberOfGuests = numberOfGuests,
                    SpecialRequests = specialRequests
                });
            }

            return reservations;
        }

        public async Task<List<CreateReservationDto>> GenerateBusinessReservations(int count)
        {
            var reservations = new List<CreateReservationDto>();
            
            // Get business guests (those with corporate email domains)
            var businessGuests = await _context.Guests
                .Where(g => g.Email.Contains("@corporate") || 
                           g.Email.Contains("@business") || 
                           g.Email.Contains("@tech") ||
                           g.Email.Contains("@consulting") ||
                           g.Email.Contains("@executive"))
                .Select(g => g.Id)
                .ToListAsync();

            // Get business-appropriate rooms
            var businessRooms = await _context.Rooms
                .Where(r => r.IsAvailable && 
                           (r.RoomType.Contains("Executive") || 
                            r.RoomType.Contains("Suite") || 
                            r.RoomType.Contains("Deluxe") ||
                            r.RoomType == "Standard"))
                .ToListAsync();

            if (!businessGuests.Any()) 
            {
                // Fallback to any guests
                businessGuests = await _context.Guests.Select(g => g.Id).ToListAsync();
            }

            if (!businessRooms.Any())
            {
                businessRooms = await _context.Rooms.Where(r => r.IsAvailable).ToListAsync();
            }

            var baseDate = DateTime.UtcNow.Date.AddDays(7); // Start next week

            for (int i = 0; i < count; i++)
            {
                var guestId = businessGuests[_random.Next(businessGuests.Count)];
                var room = businessRooms[_random.Next(businessRooms.Count)];
                
                // Business trips are typically 2-5 nights, weekdays
                var checkIn = GetNextWeekday(baseDate.AddDays(_random.Next(0, 60)));
                var nights = _random.Next(2, 6);
                var checkOut = checkIn.AddDays(nights);

                reservations.Add(new CreateReservationDto
                {
                    GuestId = guestId,
                    RoomId = room.Id,
                    CheckInDate = checkIn,
                    CheckOutDate = checkOut,
                    NumberOfGuests = _random.Next(1, 3), // Usually 1-2 for business
                    SpecialRequests = GenerateBusinessRequests()
                });
            }

            return reservations;
        }

        public async Task<List<CreateReservationDto>> GenerateVacationReservations(int count)
        {
            var reservations = new List<CreateReservationDto>();
            
            // Get leisure guests
            var leisureGuests = await _context.Guests
                .Where(g => g.Email.Contains("@gmail") || 
                           g.Email.Contains("@yahoo") || 
                           g.Email.Contains("@hotmail") ||
                           g.Email.Contains("@outlook"))
                .Select(g => g.Id)
                .ToListAsync();

            // Get vacation-appropriate rooms
            var vacationRooms = await _context.Rooms
                .Where(r => r.IsAvailable && 
                           (r.RoomType.Contains("Family") || 
                            r.RoomType.Contains("Suite") || 
                            r.RoomType.Contains("Double") ||
                            r.RoomType.Contains("Honeymoon") ||
                            r.RoomType.Contains("Deluxe")))
                .ToListAsync();

            if (!leisureGuests.Any()) 
            {
                leisureGuests = await _context.Guests.Select(g => g.Id).ToListAsync();
            }

            if (!vacationRooms.Any())
            {
                vacationRooms = await _context.Rooms.Where(r => r.IsAvailable).ToListAsync();
            }

            var baseDate = DateTime.UtcNow.Date.AddDays(14); // Start in 2 weeks

            for (int i = 0; i < count; i++)
            {
                var guestId = leisureGuests[_random.Next(leisureGuests.Count)];
                var room = vacationRooms[_random.Next(vacationRooms.Count)];
                
                // Vacations are typically 3-14 nights, often starting on weekends
                var checkIn = GetNextWeekend(baseDate.AddDays(_random.Next(0, 90)));
                var nights = _random.Next(3, 15);
                var checkOut = checkIn.AddDays(nights);

                var numberOfGuests = room.RoomType.Contains("Family") ? _random.Next(3, 5) :
                                    room.RoomType.Contains("Honeymoon") ? 2 :
                                    _random.Next(1, 4);

                reservations.Add(new CreateReservationDto
                {
                    GuestId = guestId,
                    RoomId = room.Id,
                    CheckInDate = checkIn,
                    CheckOutDate = checkOut,
                    NumberOfGuests = numberOfGuests,
                    SpecialRequests = GenerateVacationRequests()
                });
            }

            return reservations;
        }

        public async Task<List<CreateReservationDto>> GenerateWeekendReservations(int count)
        {
            var reservations = new List<CreateReservationDto>();
            var guests = await _context.Guests.Select(g => g.Id).ToListAsync();
            var rooms = await _context.Rooms.Where(r => r.IsAvailable).ToListAsync();

            var baseDate = GetNextWeekend(DateTime.UtcNow.Date);

            for (int i = 0; i < count; i++)
            {
                var guestId = guests[_random.Next(guests.Count)];
                var room = rooms[_random.Next(rooms.Count)];
                
                // Weekend stays are typically Friday to Sunday (2 nights)
                var weekendStart = GetNextWeekend(baseDate.AddDays(i * 7));
                var checkIn = weekendStart.AddDays(-1); // Friday
                var checkOut = weekendStart.AddDays(1); // Sunday

                reservations.Add(new CreateReservationDto
                {
                    GuestId = guestId,
                    RoomId = room.Id,
                    CheckInDate = checkIn,
                    CheckOutDate = checkOut,
                    NumberOfGuests = _random.Next(1, 3),
                    SpecialRequests = "Weekend getaway package"
                });
            }

            return reservations;
        }

        public async Task<List<CreateReservationDto>> GenerateGroupReservations(
            int numberOfRooms, 
            DateTime checkInDate, 
            DateTime checkOutDate,
            string groupName = "Conference Group")
        {
            var reservations = new List<CreateReservationDto>();
            
            // Get enough guests for the group
            var guests = await _context.Guests
                .Take(numberOfRooms)
                .Select(g => g.Id)
                .ToListAsync();

            // Get available rooms
            var availableRooms = await _context.Rooms
                .Where(r => r.IsAvailable)
                .Take(numberOfRooms)
                .ToListAsync();

            if (guests.Count < numberOfRooms || availableRooms.Count < numberOfRooms)
            {
                throw new InvalidOperationException($"Not enough guests or rooms for a group of {numberOfRooms}");
            }

            for (int i = 0; i < numberOfRooms; i++)
            {
                reservations.Add(new CreateReservationDto
                {
                    GuestId = guests[i],
                    RoomId = availableRooms[i].Id,
                    CheckInDate = checkInDate,
                    CheckOutDate = checkOutDate,
                    NumberOfGuests = _random.Next(1, 3),
                    SpecialRequests = $"Part of {groupName}. Please allocate rooms on same floor if possible."
                });
            }

            return reservations;
        }

        // Helper methods
        private (DateTime checkIn, DateTime checkOut) GenerateReservationDates(
            DateTime baseDate, 
            DateTime maxDate, 
            string reservationType)
        {
            var daysUntilReservation = reservationType switch
            {
                "immediate" => _random.Next(0, 7),
                "upcoming" => _random.Next(7, 30),
                "future" => _random.Next(30, 90),
                _ => _random.Next(0, 90)
            };

            var checkIn = baseDate.AddDays(daysUntilReservation);
            
            var nights = reservationType switch
            {
                "short" => _random.Next(1, 3),
                "medium" => _random.Next(3, 7),
                "long" => _random.Next(7, 14),
                _ => _random.Next(1, 7)
            };

            var checkOut = checkIn.AddDays(nights);

            // Ensure checkout doesn't exceed max date
            if (checkOut > maxDate)
            {
                checkOut = maxDate;
            }

            return (checkIn, checkOut);
        }

        private int GenerateGuestCount(string roomType)
        {
            return roomType.ToLower() switch
            {
                var type when type.Contains("single") => 1,
                var type when type.Contains("double") => _random.Next(1, 3),
                var type when type.Contains("twin") => _random.Next(1, 3),
                var type when type.Contains("family") => _random.Next(2, 5),
                var type when type.Contains("suite") => _random.Next(1, 4),
                var type when type.Contains("honeymoon") => 2,
                _ => _random.Next(1, 3)
            };
        }

        private string GenerateSpecialRequests()
        {
            var requests = new[]
            {
                "Late check-in requested",
                "Early check-in if possible",
                "High floor room preferred",
                "Quiet room away from elevators",
                "Extra pillows and towels",
                "Celebrating anniversary",
                "Birthday celebration - please prepare cake",
                "Allergic to feathers - synthetic pillows needed",
                "Traveling with infant - need crib",
                "Business trip - need work desk and good WiFi",
                "First time visiting - tourist information appreciated",
                "Dietary restrictions - vegetarian meals only",
                "Airport shuttle service needed",
                "Late checkout requested",
                "Room with bathtub preferred",
                "Connecting rooms if available",
                "Ocean view preferred",
                "Ground floor due to mobility issues",
                "Pet-friendly room needed",
                null // No special requests
            };

            return requests[_random.Next(requests.Length)];
        }

        private string GenerateBusinessRequests()
        {
            var requests = new[]
            {
                "Need conference room access",
                "Early morning meeting - 6am wake-up call",
                "Require printing and scanning services",
                "High-speed internet essential",
                "Quiet room for conference calls",
                "Late checkout due to afternoon meetings",
                "Express laundry service needed",
                "Airport transfer required",
                "Business center access needed",
                "Meeting room for 4 people on arrival day"
            };

            return requests[_random.Next(requests.Length)];
        }

        private string GenerateVacationRequests()
        {
            var requests = new[]
            {
                "Honeymoon package - champagne and flowers",
                "Anniversary celebration",
                "Tourist information and maps needed",
                "Restaurant recommendations appreciated",
                "Pool towels and beach access",
                "Spa appointment booking assistance",
                "Family connecting rooms preferred",
                "Kids club information",
                "Late checkout for evening flight",
                "Room decoration for special occasion",
                "Romantic dinner reservation needed",
                "Day trip and excursion information"
            };

            return requests[_random.Next(requests.Length)];
        }

        private DateTime GetNextWeekday(DateTime date)
        {
            while (date.DayOfWeek == DayOfWeek.Saturday || date.DayOfWeek == DayOfWeek.Sunday)
            {
                date = date.AddDays(1);
            }
            return date;
        }

        private DateTime GetNextWeekend(DateTime date)
        {
            while (date.DayOfWeek != DayOfWeek.Saturday)
            {
                date = date.AddDays(1);
            }
            return date;
        }
    }
}
