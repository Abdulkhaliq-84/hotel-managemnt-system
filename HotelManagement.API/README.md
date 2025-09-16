# Hotel Management API

A comprehensive ASP.NET Core Web API for managing hotel reservations, guests, and rooms.

## Features

- **Guest Management**: Create, read, update, and delete guest information
- **Room Management**: Manage room types, availability, and pricing
- **Reservation System**: Handle bookings with date validation and conflict checking
- **Swagger Documentation**: Interactive API documentation
- **PostgreSQL Database**: Robust data storage with Entity Framework Core

## Getting Started

### Prerequisites

- .NET 9.0 SDK
- PostgreSQL database
- pgAdmin (optional, for database management)

### Setup

1. **Update Connection String**
   - Open `appsettings.json`
   - Update the `DefaultConnection` string with your PostgreSQL credentials:
   ```json
   "DefaultConnection": "Host=localhost;Database=HotelManagementDB;Username=postgres;Password=YOUR_PASSWORD"
   ```

2. **Create Database**
   - Run the migration to create the database schema:
   ```bash
   dotnet ef database update
   ```

3. **Seed Initial Data** (Optional)
   - Start the application
   - Make a POST request to `/api/seeddata` to populate sample rooms

4. **Run the Application**
   ```bash
   dotnet run
   ```

5. **Access Swagger UI**
   - Navigate to `https://localhost:5001/swagger` (or the port shown in console)

## API Endpoints

### Guests
- `GET /api/guests` - Get all guests
- `GET /api/guests/{id}` - Get guest by ID
- `POST /api/guests` - Create new guest
- `PUT /api/guests/{id}` - Update guest
- `DELETE /api/guests/{id}` - Delete guest

### Rooms
- `GET /api/rooms` - Get all rooms
- `GET /api/rooms/{id}` - Get room by ID
- `GET /api/rooms/available` - Get available rooms
- `POST /api/rooms` - Create new room
- `PUT /api/rooms/{id}` - Update room
- `DELETE /api/rooms/{id}` - Delete room

### Reservations
- `GET /api/reservations` - Get all reservations (summary view)
- `GET /api/reservations/{id}` - Get reservation by ID (detailed view)
- `POST /api/reservations` - Create new reservation
- `PUT /api/reservations/{id}` - Update reservation
- `DELETE /api/reservations/{id}` - Delete reservation

### Seed Data
- `POST /api/seeddata` - Create sample room data

## Data Models

### Guest
- `Id` (int) - Primary key
- `Name` (string, required) - Guest's full name
- `Email` (string, required, unique) - Email address
- `Phone` (string, required) - Phone number
- `CreatedAt` (DateTime) - Creation timestamp
- `UpdatedAt` (DateTime) - Last update timestamp

### Room
- `Id` (int) - Primary key
- `RoomNumber` (string, required, unique) - Room identifier
- `RoomType` (string, required) - Type of room (e.g., "Single Room", "Double Room", "Suite")
- `PricePerNight` (decimal) - Cost per night
- `Description` (string, optional) - Room description
- `IsAvailable` (bool) - Availability status
- `CreatedAt` (DateTime) - Creation timestamp
- `UpdatedAt` (DateTime) - Last update timestamp

### Reservation
- `Id` (int) - Primary key
- `GuestId` (int, required) - Foreign key to Guest
- `RoomId` (int, required) - Foreign key to Room
- `CheckInDate` (DateTime, required) - Check-in date
- `CheckOutDate` (DateTime, required) - Check-out date
- `NumberOfGuests` (int, required, 1-10) - Number of guests
- `SpecialRequests` (string, optional) - Special requests or notes
- `Status` (enum) - Reservation status (Pending, Confirmed, CheckedIn, CheckedOut, Cancelled)
- `PaymentStatus` (enum) - Payment status (Pending, Paid, Failed, Refunded)
- `TotalPrice` (decimal) - Calculated total price
- `CreatedAt` (DateTime) - Creation timestamp
- `UpdatedAt` (DateTime) - Last update timestamp

## Example Usage

### Create a Guest
```json
POST /api/guests
{
  "name": "John Doe",
  "email": "john.doe@example.com",
  "phone": "+1234567890"
}
```

### Create a Reservation
```json
POST /api/reservations
{
  "guestId": 1,
  "roomId": 1,
  "checkInDate": "2024-01-15T00:00:00Z",
  "checkOutDate": "2024-01-17T00:00:00Z",
  "numberOfGuests": 2,
  "specialRequests": "Late checkout requested"
}
```

## Validation Rules

- Guest email must be unique
- Room number must be unique
- Check-out date must be after check-in date
- Number of guests must be between 1 and 10
- Room must be available for the selected dates
- Total price is automatically calculated based on room price and number of nights

## Error Handling

The API returns appropriate HTTP status codes:
- `200 OK` - Successful GET/PUT/DELETE
- `201 Created` - Successful POST
- `400 Bad Request` - Validation errors or business logic violations
- `404 Not Found` - Resource not found
- `500 Internal Server Error` - Server errors

Error responses include detailed messages to help with debugging.
