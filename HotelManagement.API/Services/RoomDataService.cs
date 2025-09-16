using HotelManagement.API.Models.DTOs;
using System;
using System.Collections.Generic;
using System.Linq;

namespace HotelManagement.API.Services
{
    public static class RoomDataService
    {
        // Room type definitions with base pricing
        public static class RoomTypes
        {
            public const string Standard = "Standard";
            public const string Deluxe = "Deluxe";
            public const string Suite = "Suite";
            public const string ExecutiveSuite = "Executive Suite";
            public const string PresidentialSuite = "Presidential Suite";
            public const string Single = "Single";
            public const string Double = "Double";
            public const string Twin = "Twin";
            public const string Family = "Family";
            public const string Studio = "Studio";
            public const string Penthouse = "Penthouse";
            public const string JuniorSuite = "Junior Suite";
            public const string Honeymoon = "Honeymoon Suite";
            public const string Accessible = "Accessible Room";
            public const string Economy = "Economy";
        }

        private static readonly Dictionary<string, decimal> RoomBasePrices = new()
        {
            { RoomTypes.Economy, 75m },
            { RoomTypes.Standard, 120m },
            { RoomTypes.Single, 100m },
            { RoomTypes.Double, 150m },
            { RoomTypes.Twin, 140m },
            { RoomTypes.Deluxe, 200m },
            { RoomTypes.Studio, 180m },
            { RoomTypes.Family, 250m },
            { RoomTypes.JuniorSuite, 300m },
            { RoomTypes.Suite, 350m },
            { RoomTypes.Honeymoon, 400m },
            { RoomTypes.ExecutiveSuite, 500m },
            { RoomTypes.Penthouse, 800m },
            { RoomTypes.PresidentialSuite, 1200m },
            { RoomTypes.Accessible, 130m }
        };

        private static readonly Dictionary<string, string> RoomDescriptions = new()
        {
            { RoomTypes.Economy, "Budget-friendly room with essential amenities. Perfect for short stays." },
            { RoomTypes.Standard, "Comfortable room with modern amenities, work desk, and city view." },
            { RoomTypes.Single, "Cozy room with a single bed, ideal for solo travelers." },
            { RoomTypes.Double, "Spacious room with a queen-size bed, perfect for couples." },
            { RoomTypes.Twin, "Room with two single beds, great for friends or colleagues." },
            { RoomTypes.Deluxe, "Luxurious room with premium amenities, king-size bed, and stunning views." },
            { RoomTypes.Studio, "Open-plan room with living area, kitchenette, and workspace." },
            { RoomTypes.Family, "Large room with multiple beds, perfect for families with children." },
            { RoomTypes.JuniorSuite, "Elegant suite with separate seating area and premium amenities." },
            { RoomTypes.Suite, "Spacious suite with separate living room, bedroom, and luxury bathroom." },
            { RoomTypes.Honeymoon, "Romantic suite with champagne, jacuzzi, and breathtaking views." },
            { RoomTypes.ExecutiveSuite, "Premium suite with office space, meeting area, and executive lounge access." },
            { RoomTypes.Penthouse, "Top-floor luxury suite with panoramic views, terrace, and butler service." },
            { RoomTypes.PresidentialSuite, "Ultimate luxury with multiple bedrooms, dining room, kitchen, and private elevator." },
            { RoomTypes.Accessible, "Fully accessible room with wider doorways, grab bars, and roll-in shower." }
        };

        public static List<CreateRoomDto> GenerateFloorRooms(int floorNumber, int roomsPerFloor)
        {
            var rooms = new List<CreateRoomDto>();
            var floorPrefix = floorNumber.ToString();
            
            // Determine room types based on floor
            var roomTypes = GetRoomTypesForFloor(floorNumber);
            
            for (int i = 1; i <= roomsPerFloor; i++)
            {
                var roomNumber = $"{floorPrefix}{i:D2}";
                var roomTypeIndex = (i - 1) % roomTypes.Count;
                var roomType = roomTypes[roomTypeIndex];
                
                // Add some price variation based on room position (corner rooms, etc.)
                var priceMultiplier = 1.0m;
                if (i == 1 || i == roomsPerFloor) // Corner rooms
                {
                    priceMultiplier = 1.1m;
                }
                
                var basePrice = RoomBasePrices[roomType];
                var finalPrice = Math.Round(basePrice * priceMultiplier, 2);
                
                rooms.Add(new CreateRoomDto
                {
                    RoomNumber = roomNumber,
                    RoomType = roomType,
                    PricePerNight = finalPrice,
                    Description = RoomDescriptions[roomType],
                    IsAvailable = true
                });
            }
            
            return rooms;
        }

        private static List<string> GetRoomTypesForFloor(int floorNumber)
        {
            return floorNumber switch
            {
                1 => new List<string> { RoomTypes.Economy, RoomTypes.Standard, RoomTypes.Accessible },
                2 => new List<string> { RoomTypes.Standard, RoomTypes.Single, RoomTypes.Twin },
                3 => new List<string> { RoomTypes.Double, RoomTypes.Twin, RoomTypes.Standard },
                4 => new List<string> { RoomTypes.Deluxe, RoomTypes.Double, RoomTypes.Studio },
                5 => new List<string> { RoomTypes.Deluxe, RoomTypes.Family, RoomTypes.Studio },
                6 => new List<string> { RoomTypes.JuniorSuite, RoomTypes.Deluxe, RoomTypes.Family },
                7 => new List<string> { RoomTypes.Suite, RoomTypes.JuniorSuite, RoomTypes.Honeymoon },
                8 => new List<string> { RoomTypes.ExecutiveSuite, RoomTypes.Suite },
                9 => new List<string> { RoomTypes.ExecutiveSuite, RoomTypes.Penthouse },
                10 => new List<string> { RoomTypes.PresidentialSuite, RoomTypes.Penthouse },
                _ => new List<string> { RoomTypes.Standard, RoomTypes.Double, RoomTypes.Deluxe }
            };
        }

        public static List<CreateRoomDto> GenerateStandardHotelRooms()
        {
            var rooms = new List<CreateRoomDto>();
            
            // Generate rooms for floors 1-5 (10 rooms per floor)
            for (int floor = 1; floor <= 5; floor++)
            {
                rooms.AddRange(GenerateFloorRooms(floor, 10));
            }
            
            return rooms;
        }

        public static List<CreateRoomDto> GenerateLuxuryHotelRooms()
        {
            var rooms = new List<CreateRoomDto>();
            
            // Generate rooms for floors 1-10 (fewer rooms per floor for luxury)
            for (int floor = 1; floor <= 10; floor++)
            {
                int roomsPerFloor = floor <= 5 ? 8 : 4; // Fewer rooms on higher floors
                rooms.AddRange(GenerateFloorRooms(floor, roomsPerFloor));
            }
            
            return rooms;
        }

        public static List<CreateRoomDto> GenerateBoutiqueHotelRooms()
        {
            var rooms = new List<CreateRoomDto>();
            
            // Boutique hotels have unique room names instead of numbers
            var boutiqueRooms = new List<(string name, string type, decimal price, string description)>
            {
                ("Garden View", RoomTypes.Deluxe, 220m, "Charming room overlooking our private garden with French doors to a juliet balcony."),
                ("Ocean Breeze", RoomTypes.Suite, 380m, "Coastal-themed suite with panoramic ocean views and private balcony."),
                ("Mountain Lodge", RoomTypes.Family, 280m, "Rustic yet luxurious family room with mountain views and fireplace."),
                ("Artist's Loft", RoomTypes.Studio, 200m, "Creative space with local artwork, high ceilings, and abundant natural light."),
                ("Zen Retreat", RoomTypes.Double, 180m, "Minimalist design with Japanese influences, includes meditation space."),
                ("Victorian Rose", RoomTypes.Honeymoon, 420m, "Romantic room with vintage decor, four-poster bed, and clawfoot tub."),
                ("Library Suite", RoomTypes.Suite, 350m, "Book lover's paradise with private library, reading nooks, and fireplace."),
                ("Skylight Studio", RoomTypes.Studio, 190m, "Top floor studio with skylights and telescope for stargazing."),
                ("Secret Garden", RoomTypes.JuniorSuite, 320m, "Hidden gem with private garden access and outdoor shower."),
                ("Wine Cellar", RoomTypes.ExecutiveSuite, 450m, "Sophisticated suite with wine collection and tasting area."),
                ("Treehouse", RoomTypes.Deluxe, 260m, "Elevated room with tree canopy views and nature-inspired design."),
                ("Moonlight Terrace", RoomTypes.Penthouse, 680m, "Rooftop suite with private terrace and outdoor jacuzzi."),
                ("Poet's Corner", RoomTypes.Single, 120m, "Cozy retreat with writing desk and inspiring literary quotes."),
                ("Sunset Boulevard", RoomTypes.Double, 200m, "West-facing room with spectacular sunset views and Art Deco styling."),
                ("The Observatory", RoomTypes.Suite, 400m, "Astronomy-themed suite with dome ceiling and professional telescope.")
            };
            
            foreach (var room in boutiqueRooms)
            {
                rooms.Add(new CreateRoomDto
                {
                    RoomNumber = room.name,
                    RoomType = room.type,
                    PricePerNight = room.price,
                    Description = room.description,
                    IsAvailable = true
                });
            }
            
            return rooms;
        }

        public static List<CreateRoomDto> GenerateEconomyHotelRooms()
        {
            var rooms = new List<CreateRoomDto>();
            
            // Economy hotels - 3 floors, 15 rooms per floor
            for (int floor = 1; floor <= 3; floor++)
            {
                for (int i = 1; i <= 15; i++)
                {
                    var roomNumber = $"{floor}{i:D2}";
                    var roomType = i % 3 == 0 ? RoomTypes.Double : 
                                  i % 3 == 1 ? RoomTypes.Single : 
                                  RoomTypes.Twin;
                    
                    var basePrice = roomType switch
                    {
                        RoomTypes.Single => 65m,
                        RoomTypes.Double => 85m,
                        RoomTypes.Twin => 80m,
                        _ => 75m
                    };
                    
                    rooms.Add(new CreateRoomDto
                    {
                        RoomNumber = roomNumber,
                        RoomType = roomType,
                        PricePerNight = basePrice,
                        Description = $"Clean and comfortable {roomType.ToLower()} with all basic amenities.",
                        IsAvailable = true
                    });
                }
            }
            
            return rooms;
        }

        public static List<CreateRoomDto> GenerateBusinessHotelRooms()
        {
            var rooms = new List<CreateRoomDto>();
            
            // Business hotels focus on executive rooms and suites
            var businessRoomConfigs = new List<(int floor, string prefix, string type, decimal price)>
            {
                // Floor 1-2: Standard business rooms
                (1, "B", RoomTypes.Standard, 140m),
                (2, "B", RoomTypes.Standard, 140m),
                
                // Floor 3-4: Deluxe business rooms
                (3, "D", RoomTypes.Deluxe, 190m),
                (4, "D", RoomTypes.Deluxe, 190m),
                
                // Floor 5-6: Executive rooms
                (5, "E", RoomTypes.ExecutiveSuite, 280m),
                (6, "E", RoomTypes.ExecutiveSuite, 280m),
                
                // Floor 7: Conference suites
                (7, "C", RoomTypes.Suite, 350m),
                
                // Floor 8: Premium suites
                (8, "P", RoomTypes.PresidentialSuite, 550m)
            };
            
            foreach (var config in businessRoomConfigs)
            {
                int roomCount = config.floor <= 4 ? 12 : config.floor <= 6 ? 8 : 4;
                
                for (int i = 1; i <= roomCount; i++)
                {
                    var roomNumber = $"{config.prefix}{config.floor}{i:D2}";
                    var description = config.type switch
                    {
                        RoomTypes.Standard => "Business room with ergonomic workspace, high-speed WiFi, and meeting capabilities.",
                        RoomTypes.Deluxe => "Premium business room with lounge area, mini-bar, and conference call setup.",
                        RoomTypes.ExecutiveSuite => "Executive suite with boardroom table, premium amenities, and lounge access.",
                        RoomTypes.Suite => "Conference suite with meeting room, presentation equipment, and catering area.",
                        RoomTypes.PresidentialSuite => "Premium suite with private office, meeting rooms, and concierge service.",
                        _ => "Professional room with business amenities."
                    };
                    
                    rooms.Add(new CreateRoomDto
                    {
                        RoomNumber = roomNumber,
                        RoomType = config.type,
                        PricePerNight = config.price,
                        Description = description,
                        IsAvailable = true
                    });
                }
            }
            
            return rooms;
        }

        public static List<CreateRoomDto> GenerateResortRooms()
        {
            var rooms = new List<CreateRoomDto>();
            
            // Beach resort style rooms
            var resortRooms = new List<(string number, string type, decimal price, string description)>
            {
                // Beachfront Villas
                ("Villa-01", RoomTypes.Suite, 450m, "Beachfront villa with private pool and direct beach access."),
                ("Villa-02", RoomTypes.Suite, 450m, "Beachfront villa with private pool and direct beach access."),
                ("Villa-03", RoomTypes.Honeymoon, 550m, "Romantic beachfront villa with private pool and couples spa."),
                ("Villa-04", RoomTypes.PresidentialSuite, 850m, "Luxury villa with private beach, pool, and butler service."),
                
                // Ocean View Rooms
                ("Ocean-101", RoomTypes.Deluxe, 280m, "Deluxe ocean view room with balcony and sunset views."),
                ("Ocean-102", RoomTypes.Deluxe, 280m, "Deluxe ocean view room with balcony and sunset views."),
                ("Ocean-103", RoomTypes.Family, 350m, "Family suite with ocean view, kids area, and connecting rooms."),
                ("Ocean-104", RoomTypes.Family, 350m, "Family suite with ocean view, kids area, and connecting rooms."),
                
                // Garden Bungalows
                ("Garden-A", RoomTypes.Standard, 180m, "Tropical garden bungalow with outdoor shower and hammock."),
                ("Garden-B", RoomTypes.Standard, 180m, "Tropical garden bungalow with outdoor shower and hammock."),
                ("Garden-C", RoomTypes.Double, 220m, "Garden room with private patio and tropical landscaping."),
                ("Garden-D", RoomTypes.Double, 220m, "Garden room with private patio and tropical landscaping."),
                
                // Pool Access Rooms
                ("Pool-201", RoomTypes.Deluxe, 320m, "Swim-up room with direct pool access from terrace."),
                ("Pool-202", RoomTypes.Deluxe, 320m, "Swim-up room with direct pool access from terrace."),
                ("Pool-203", RoomTypes.Suite, 420m, "Pool suite with private cabana and poolside service."),
                
                // Overwater Bungalows
                ("Water-01", RoomTypes.Honeymoon, 680m, "Overwater bungalow with glass floor and private deck."),
                ("Water-02", RoomTypes.Honeymoon, 680m, "Overwater bungalow with glass floor and private deck."),
                ("Water-03", RoomTypes.PresidentialSuite, 980m, "Luxury overwater villa with infinity pool and underwater bedroom."),
                
                // Spa Retreats
                ("Spa-101", RoomTypes.Suite, 380m, "Wellness suite with in-room massage area and meditation space."),
                ("Spa-102", RoomTypes.Suite, 380m, "Wellness suite with in-room massage area and meditation space.")
            };
            
            foreach (var room in resortRooms)
            {
                rooms.Add(new CreateRoomDto
                {
                    RoomNumber = room.number,
                    RoomType = room.type,
                    PricePerNight = room.price,
                    Description = room.description,
                    IsAvailable = true
                });
            }
            
            return rooms;
        }

        public static List<CreateRoomDto> GetAllSampleRooms()
        {
            // Return a mix of different room types (limited set for demo)
            var rooms = new List<CreateRoomDto>();
            
            // Add a selection from each category
            rooms.AddRange(GenerateFloorRooms(1, 5)); // Floor 1 economy/standard
            rooms.AddRange(GenerateFloorRooms(2, 5)); // Floor 2 standard/single
            rooms.AddRange(GenerateFloorRooms(3, 5)); // Floor 3 double/twin
            rooms.AddRange(GenerateFloorRooms(4, 5)); // Floor 4 deluxe
            rooms.AddRange(GenerateFloorRooms(5, 5)); // Floor 5 family/studio
            
            return rooms;
        }

        public static List<CreateRoomDto> GenerateCustomRooms(int count, string roomTypeFilter = null)
        {
            var rooms = new List<CreateRoomDto>();
            var random = new Random();
            var availableTypes = string.IsNullOrEmpty(roomTypeFilter) 
                ? RoomBasePrices.Keys.ToList() 
                : RoomBasePrices.Keys.Where(k => k.Contains(roomTypeFilter, StringComparison.OrdinalIgnoreCase)).ToList();
            
            if (!availableTypes.Any())
            {
                availableTypes = RoomBasePrices.Keys.ToList();
            }
            
            for (int i = 0; i < count; i++)
            {
                var floor = random.Next(1, 11);
                var roomNum = random.Next(1, 21);
                var roomNumber = $"{floor}{roomNum:D2}";
                var roomType = availableTypes[random.Next(availableTypes.Count)];
                
                // Add some random price variation (-10% to +20%)
                var basePrice = RoomBasePrices[roomType];
                var variation = (decimal)(random.NextDouble() * 0.3 - 0.1);
                var finalPrice = Math.Round(basePrice * (1 + variation), 2);
                
                rooms.Add(new CreateRoomDto
                {
                    RoomNumber = roomNumber,
                    RoomType = roomType,
                    PricePerNight = finalPrice,
                    Description = RoomDescriptions[roomType],
                    IsAvailable = random.Next(100) > 10 // 90% chance of being available
                });
            }
            
            return rooms;
        }
    }
}
