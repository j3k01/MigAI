using Microsoft.AspNetCore.Mvc;
using MigAI.Application.Interfaces.Repositories;

namespace MigAI.API.Controllers
{
    [ApiController]
    [Route("api/userprogress")]
    public class UserProgressController : ControllerBase
    {
        private readonly IUserProgressRepository _repository;
        public UserProgressController(IUserProgressRepository repository) 
        {
            _repository = repository;
        }
        [HttpGet("progress/{id}")]
        public async Task<IActionResult> GetAllProgressForUserAsync([FromRoute] int id)
        {
            var progressForUser = await _repository.GetAllProgressForUserAsync(id);
            if (progressForUser == null)
            {
                return NotFound(new { message = "Brak progresu dla danego  użytkownika!" });
            }
            return Ok(progressForUser);
        }

        [HttpGet("Badges/{id}")]
        public async Task<IActionResult> GetUserBadges([FromRoute] int id)
        {
            var badges = await _repository.GetUserBadgesAsync(id);
            if (badges == null)
            {
                return NotFound(new { message = "Brak odznak dla użytkownika" });
            }

            return Ok(badges);
        }

    }
}
