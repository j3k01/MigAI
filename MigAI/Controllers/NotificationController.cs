using Microsoft.AspNetCore.Mvc;
using MigAI.Application.Interfaces.Repositories;
using MigAI.Domain.Entities;
using MigAI.Infrastructure.Repositories;

namespace MigAI.API.Controllers
{
    [Route("api/notification")]
    [ApiController]
    public class NotificationController : ControllerBase
    {
        private readonly INotificationRepository _notificationRepository;
        public NotificationController(INotificationRepository notificationRepository)
        {
            _notificationRepository = notificationRepository;
        }

        //Notifications section
        [HttpGet("{notificationId}")]
        public async Task<IActionResult> GetNotificationByIdAsync(int notificationId)
        {
            if(notificationId <= 0)
            {
                return BadRequest(new { message = "Invalid notification ID!" });
            }

            var notification = await _notificationRepository.GetNotificationByIdAsync(notificationId);
            if(notification == null)
            {
                return NotFound(new { message = "Notification not found!" });
            }
            return Ok(notification);
        }

        [HttpGet("ByTitle/{title}")]
        public async Task<IActionResult> GetNotificationByTitleAsync(string title)
        {
            if(string.IsNullOrWhiteSpace(title))
            {
                return BadRequest(new { message = "Title is required!" });
            }
            var notification = await _notificationRepository.GetNotificationByTitleAsync(title);
            if(notification == null)
            {
                return NotFound(new { message = "Notification not found!" });
            }
            return Ok(notification);
        }

        [HttpGet("latest")]
        public async Task<IActionResult> GetLatestNotificationWithDetailsAsync(int count = 10)
        { 
            var notifications = await _notificationRepository.GetLatestNotificationWithDetailsAsync(count);
            if(notifications == null || !notifications.Any())
            {
                return NotFound(new { message = "No notifications found!" });
            }
            return Ok(notifications);
        }

        [HttpGet]
        public async Task<IActionResult> GetAllAsync()
        {
            var notifications = await _notificationRepository.GetAllAsync();
            if(notifications == null || !notifications.Any())
            {
                return NotFound(new { message = "No notifications found!" });
            }
            return Ok(notifications);
        }

        [HttpPost]
        public async Task<IActionResult> CreateNotificationAsync([FromBody] Notification notification)
        {
            if (notification == null)
                return BadRequest(new { message = "Notifications not found, bad request!" });
            var createdNotification = await _notificationRepository.CreateNotificationAsync(notification);
            if (createdNotification == null)
                return BadRequest(new { message = "Failed to create notification!" });

            return NoContent();
        }


        [HttpPut]
        public async Task<IActionResult> UpdateNotificationAsync([FromBody] Notification notification)
        {
            if(notification == null)
            {
               return BadRequest(new { message = "Notifications not found, bad request!" });
            }
            var existing = await _notificationRepository.GetNotificationByIdAsync(notification.Id);
            if (existing == null)
                return NotFound(new { message = "Notification not found!" });
            await _notificationRepository.UpdateNotificationAsync(notification);
            return NoContent();
        }

        [HttpDelete("{notificationId:int}")]
        public async Task<IActionResult> DeleteNotificationAsync(int notificationId)
        {
            if (notificationId <= 0)
            {
                return BadRequest(new { message = "Invalid notification ID!" });
            }
            await _notificationRepository.DeleteNotificationAsync(notificationId);
            return NoContent();
        }

        //Comments section
    }
}
