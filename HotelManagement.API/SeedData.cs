using Microsoft.EntityFrameworkCore;
using HotelManagement.API.Models;

namespace HotelManagement.API
{
    public static class SeedData
    {
        public static async Task SeedAsync(HotelManagementDbContext context)
        {
            // Check if data already exists
            if (await context.Rooms.AnyAsync())
            {
                return; // Data already seeded
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

            context.Rooms.AddRange(rooms);

            // Seed Guests
            var guests = new List<Guest>
            {
                new Guest
                {
                    Name = "John Smith",
                    Email = "john.smith@email.com",
                    Phone = "+1-555-0123",
                    CreatedAt = DateTime.UtcNow,
                    UpdatedAt = DateTime.UtcNow
                },
                new Guest
                {
                    Name = "Sarah Johnson",
                    Email = "sarah.j@email.com",
                    Phone = "+1-555-0456",
                    CreatedAt = DateTime.UtcNow,
                    UpdatedAt = DateTime.UtcNow
                },
                new Guest
                {
                    Name = "Mike Wilson",
                    Email = "mike.wilson@email.com",
                    Phone = "+1-555-0789",
                    CreatedAt = DateTime.UtcNow,
                    UpdatedAt = DateTime.UtcNow
                }
            };

            context.Guests.AddRange(guests);
            await context.SaveChangesAsync();

            // Create some sample reservations
            var sampleReservations = new List<Reservation>
            {
                new Reservation
                {
                    GuestId = guests[0].Id,
                    RoomId = rooms[0].Id,
                    CheckInDate = DateTime.UtcNow.AddDays(1),
                    CheckOutDate = DateTime.UtcNow.AddDays(3),
                    NumberOfGuests = 1,
                    SpecialRequests = "Early check-in preferred",
                    Status = ReservationStatus.Confirmed,
                    PaymentStatus = PaymentStatus.Paid,
                    TotalPrice = 200, // 2 nights * $100
                    CreatedAt = DateTime.UtcNow,
                    UpdatedAt = DateTime.UtcNow
                },
                new Reservation
                {
                    GuestId = guests[1].Id,
                    RoomId = rooms[2].Id,
                    CheckInDate = DateTime.UtcNow.AddDays(5),
                    CheckOutDate = DateTime.UtcNow.AddDays(8),
                    NumberOfGuests = 2,
                    SpecialRequests = "Extra towels needed",
                    Status = ReservationStatus.Pending,
                    PaymentStatus = PaymentStatus.Pending,
                    TotalPrice = 450, // 3 nights * $150
                    CreatedAt = DateTime.UtcNow,
                    UpdatedAt = DateTime.UtcNow
                }
            };

            context.Reservations.AddRange(sampleReservations);
            await context.SaveChangesAsync();
        }
    }
}
