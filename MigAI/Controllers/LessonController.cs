using Microsoft.AspNetCore.Mvc;
using MigAI.Application.Interfaces.Repositories;

namespace MigAI.API.Controllers
{
    [Route("api/lesson")]
    [ApiController]
    public class LessonController : ControllerBase
    {
        private readonly ILessonRepository _lessonRepository;

        public LessonController(ILessonRepository lessonRepository)
        {
            _lessonRepository = lessonRepository;
        }

        [HttpGet("{lessonId}")]
        public async Task<IActionResult> GetLesson([FromRoute] int lessonId)
        {
            var lessons = new List<object>
        {
            new { Id = 1, Title = "Nauka A", Description = "Uczymy się litery A", VideoUrl = "https://www.youtube.com/watch?v=xvFZjo5PgG0", Signs = new[] { "A" }, Model = "modelA" },
            new { Id = 2, Title = "Nauka B", Description = "Uczymy się litery B", VideoUrl = "https://www.youtube.com/watch?v=xvFZjo5PgG0", Signs = new[] { "B" }, Model = "modelB" }
        };

            if (lessonId <= 0)
            {
                return BadRequest(new { message = "Invalid lesson ID!" });
            }

            var lesson = await _lessonRepository.GetLessonByIdAsync(lessonId);

            if (lesson == null)
            {
                return BadRequest(new { message = "Lesson not found!" });
            }

            return Ok(lesson);
        }
    }
}
