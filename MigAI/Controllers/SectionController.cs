using Microsoft.AspNetCore.Mvc;
using MigAI.Application.Interfaces.Repositories;
using MigAI.Domain.Entities;

namespace MigAI.API.Controllers
{
    [Route("api/section")]
    [ApiController]
    public class SectionController : ControllerBase
    {
        private readonly ILogger<SectionController> _logger;
        private readonly ISectionRepository _sectionRepository;
        public SectionController(ILogger<SectionController> logger, ISectionRepository sectionRepository)
        {
            _logger = logger ?? throw new ArgumentNullException(nameof(logger));
            _sectionRepository = sectionRepository;
        }
        [HttpGet("{sectionId}")]
        public async Task<IActionResult> GetSectionAsync(int sectionId)
        {
            if (sectionId <= 0) 
            {
                return BadRequest(new { message = "Invalid section ID!" });
            }
            var section = await _sectionRepository.GetSectionAsync(sectionId);
            if (section == null)
            {
                return NotFound(new { message = "Section not found!" });
            }
            return Ok(section);
        }
        [HttpGet("all")]
        public async Task<IActionResult> GetAllAsync()
        {
            var sections = await _sectionRepository.GetAllAsync();
            if(sections == null)
            {
                return NotFound(new { message = "Sections not found!" });
            }
            return Ok(sections);
        }
        [HttpPost]
        public async Task<IActionResult> AddAsync(Section section)
        {
            if (section == null)
            {
                return NotFound(new { message = "Sections not found!" });
            }
            await AddAsync(section);
            return Ok();
        }

        [HttpPut]
        public async Task<IActionResult> UpdateAsync(Section section)
        {
            if (section == null)
            {
                return NotFound(new { message = "Sections not found!" });
            }
            await UpdateAsync(section);
            return Ok();
        }

        [HttpDelete]
        public async Task<IActionResult> DeleteAsync(int sectionId)
        {
            if (sectionId <= 0)
            {
                return BadRequest(new { message = "Invalid notification ID!" });
            }
            await DeleteAsync(sectionId);
            return Ok();
        }
    }
}
