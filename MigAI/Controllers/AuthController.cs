using MigAI.Application.Interfaces.Services;
using Microsoft.AspNetCore.Mvc;

namespace MigAI.API.Controllers
{
    [Route("api/auth")]
    [ApiController]
    public class AuthController : ControllerBase
    {
        private readonly IAuthService _authService;

        public AuthController(IAuthService authService)
        {
            _authService = authService;
        }

        [HttpPost("login")]
        public async Task<IActionResult> Login([FromBody] LoginRequest request)
        {
            var token = await _authService.AuthenticateAsync(request.Email, request.Password);
            if (token == null)
            {
                return Unauthorized(new { message = "Invalid credentials" });
            }

            return Ok(new { token });
        }
    }
    public record LoginRequest(string Email, string Password);
}
