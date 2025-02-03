using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using MigAI.Application.Interfaces.Repositories;
using MigAI.Domain.Entities;
using System.Security.Claims;

namespace MigAI.API.Controllers
{
    [Route("api/user")]
    [ApiController]
    public class UserController : ControllerBase
    {
        private readonly IUserRepository _userRepository;

        public UserController(IUserRepository userRepository)
        {
            _userRepository = userRepository;
        }

        [HttpPost("register")]
        public async Task<IActionResult> Register([FromBody] User user)
        {
            if (string.IsNullOrWhiteSpace(user.UserEmail) || string.IsNullOrWhiteSpace(user.HashedPassword))
            {
                return BadRequest(new { message = "Email and password are required!" });
            }

            var existingUser = await _userRepository.GetUserByEmailAsync(user.UserEmail);
            if (existingUser != null)
            {
                return Conflict(new { message = "User already exists!" });
            }

            user.HashedPassword = BCrypt.Net.BCrypt.HashPassword(user.HashedPassword);
            await _userRepository.AddAsync(user);

            return Ok(new { message = "User registered successfully!" });
        }

        [Authorize]
        [HttpGet("getByEmail/{email}")]
        public async Task<IActionResult> GetUserByEmail([FromRoute] string email)
        {
            if (string.IsNullOrWhiteSpace(email))
            {
                return BadRequest(new { message = "Email is required!" });
            }

            var user = await _userRepository.GetUserByEmailAsync(email);
            if (user == null)
            {
                return NotFound(new { message = "User not found!" });
            }

            return Ok(user);
        }

        [Authorize]
        [HttpGet("getById/{id}")]
        public async Task<IActionResult> GetUserById([FromRoute] int id)
        {
            if (id <= 0)
            {
                return BadRequest(new { message = "Invalid user ID!" });
            }

            var user = await _userRepository.GetUserByIdAsync(id);
            if (user == null)
            {
                return NotFound(new { message = "User not found!" });
            }

            return Ok(user);
        }


        [Authorize]
        [HttpPut("update")]
        public async Task<IActionResult> UpdateUser([FromBody] User user)
        {
            if (user == null || user.Id == 0)
            {
                return BadRequest(new { message = "Invalid user data!" });
            }

            var existingUser = await _userRepository.GetUserByIdAsync(user.Id);
            if (existingUser == null)
            {
                return NotFound(new { message = "User not found!" });
            }

            existingUser.UserEmail = user.UserEmail;
            existingUser.DisplayName = user.DisplayName;

            if (!string.IsNullOrWhiteSpace(user.HashedPassword))
            {
                existingUser.HashedPassword = BCrypt.Net.BCrypt.HashPassword(user.HashedPassword);
            }

            await _userRepository.UpdateAsync(existingUser);
            return Ok(new { message = "User updated successfully!" });
        }


        [Authorize]
        [HttpDelete("delete/{id}")]
        public async Task<IActionResult> Delete([FromRoute] int id)
        {
            if (id <= 0)
            {
                return BadRequest(new { message = "Invalid user ID!" });
            }

            var existingUser = await _userRepository.GetUserByIdAsync(id);
            if (existingUser == null)
            {
                return NotFound(new { message = "User not found!" });
            }

            var loggedInUserId = int.Parse(User.FindFirst(ClaimTypes.NameIdentifier)?.Value!);
            if (loggedInUserId != id)
            {
                return Forbid();
            }

            await _userRepository.DeleteAsync(id);
            return Ok(new { message = "User deleted successfully!" });
        }

    }
}
