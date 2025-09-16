using Microsoft.AspNetCore.Mvc;

namespace HotelManagement.API.Controllers
{
    [ApiController]
    public class WelcomeController : ControllerBase
    {
        [HttpGet("/")]
        public IActionResult GetWelcome()
        {
            return Ok(new
            {
                message = "Welcome to Hotel Management API",
                version = "1.0.0",
                endpoints = new
                {
                    guests = "/api/guests",
                    rooms = "/api/rooms",
                    reservations = "/api/reservations",
                    swagger = "/swagger"
                },
                documentation = "Visit /swagger for API documentation"
            });
        }

        [HttpGet("/api")]
        public IActionResult GetApiInfo()
        {
            return Ok(new
            {
                message = "Hotel Management API",
                version = "1.0.0",
                availableEndpoints = new[]
                {
                    "GET /api/guests - Get all guests",
                    "GET /api/guests/{id} - Get guest by ID",
                    "POST /api/guests - Create new guest",
                    "PUT /api/guests/{id} - Update guest",
                    "DELETE /api/guests/{id} - Delete guest",
                    "GET /api/rooms - Get all rooms",
                    "GET /api/rooms/{id} - Get room by ID",
                    "GET /api/rooms/available - Get available rooms",
                    "POST /api/rooms - Create new room",
                    "PUT /api/rooms/{id} - Update room",
                    "DELETE /api/rooms/{id} - Delete room",
                    "GET /api/reservations - Get all reservations",
                    "GET /api/reservations/{id} - Get reservation by ID",
                    "POST /api/reservations - Create new reservation",
                    "PUT /api/reservations/{id} - Update reservation",
                    "DELETE /api/reservations/{id} - Delete reservation"
                }
            });
        }
    }
}
