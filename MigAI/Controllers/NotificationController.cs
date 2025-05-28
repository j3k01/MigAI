using Microsoft.AspNetCore.Mvc;
using MigAI.API.Models;
using MigAI.Application.DTO;
using MigAI.Application.Interfaces.Repositories;
using MigAI.Domain.Entities;

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
            if (notificationId <= 0)
            {
                return BadRequest(new { message = "Invalid notification ID!" });
            }

            var notification = await _notificationRepository.GetNotificationByIdAsync(notificationId);
            if (notification == null)
            {
                return NotFound(new { message = "Notification not found!" });
            }
            return Ok(notification);
        }

        [HttpGet("ByTitle/{title}")]
        public async Task<IActionResult> GetNotificationByTitleAsync(string title)
        {
            if (string.IsNullOrWhiteSpace(title))
            {
                return BadRequest(new { message = "Title is required!" });
            }
            var notification = await _notificationRepository.GetNotificationByTitleAsync(title);
            if (notification == null)
            {
                return NotFound(new { message = "Notification not found!" });
            }
            return Ok(notification);
        }

        [HttpGet("latest")]
        public async Task<IActionResult> GetLatestNotificationWithDetailsAsync(int count = 10)
        {
            var notifications = await _notificationRepository.GetLatestNotificationWithDetailsAsync(count);
            if (notifications == null || !notifications.Any())
            {
                return NotFound(new { message = "No notifications found!" });
            }
            return Ok(notifications);
        }

        [HttpGet]
        public async Task<IActionResult> GetAllAsync()
        {
            var notifications = await _notificationRepository.GetAllAsync();
            if (notifications == null || !notifications.Any())
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
            if (notification == null)
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

        [HttpGet("{notificationId}/comments")]
        public async Task<IActionResult> GetCommentsAsync(int notificationId)
        {
            if (notificationId <= 0)
            {
                return BadRequest(new { message = "Invalid notification ID!" });
            }
            var comments = await _notificationRepository.GetCommentsAsync(notificationId);
            if (comments == null || !comments.Any())
            {
                return NotFound(new { message = "No comments found for this notification!" });
            }
            return Ok(comments);
        }

        [HttpPost("{notificationId}/comment")]
        public async Task<IActionResult> AddCommentAsync(int notificationId, [FromBody] AddCommentDto dto)
        {
            if(notificationId <= 0 || dto == null)
            {
                return BadRequest(new { message = "Invalid notification ID or comment!" });
            }

            var comment = new Comment
            {
                Content = dto.Content,
                UserId = dto.UserId,
                NotificationId = notificationId,
                CreatedAt = DateTime.UtcNow
            };

            await _notificationRepository.AddCommentAsync(notificationId, comment);

            return Ok(comment);
        }

        [HttpPut("{notificationId}/comment")]
        public async Task<IActionResult> UpdateCommentAsync(int notificationId, [FromBody] Comment comment)
        {
            if(notificationId <= 0 || comment == null)
            {
                return BadRequest(new { message = "Invalid notification ID or comment!" });
            }
            var existingComments = await _notificationRepository.GetCommentsAsync(notificationId);
            if (existingComments == null || !existingComments.Any(c => c.Id == comment.Id))
            {
                return NotFound(new { message = "Comment not found!" });
            }
            await _notificationRepository.UpdateCommentAsync(notificationId, comment);
            return NoContent();
        }

        [HttpDelete("comment/{notificationId:int}/{commentId:int}")]
        public async Task<IActionResult> DeleteCommentAsync(int notificationId, int commentId)
        {
            if (notificationId <= 0 || commentId <= 0)
            {
                return BadRequest(new { message = "Invalid notification ID or comment ID!" });
            }
            await _notificationRepository.DeleteCommentAsync(notificationId, commentId);
            return NoContent();
        }

        //Reactions section
        [HttpGet("{notificationId}/reactions")]
        public async Task<IActionResult> GetReactionCountsAsync(int notificationId)
        {
            if(notificationId <= 0)
            {
                return BadRequest(new { message = "Invalid notificationId!"});
            }

            var reactionCount = await _notificationRepository.GetReactionCountsAsync(notificationId);
            if (reactionCount == null || !reactionCount.Any())
            {
                return NotFound(new { message = "No reactions found for this notification!" });
            }
            return Ok(reactionCount);
        }

        [HttpGet("{notificationId}/reactionsList")]
        public async Task<IActionResult> GetReactionsAsync(int notificationId)
        {
            if(notificationId <= 0)
            {
                return BadRequest(new { message = "Invalid notificationId!" });
            }

            var reactions = await _notificationRepository.GetReactionsAsync(notificationId);
            if (reactions == null || !reactions.Any())
            {
                return NotFound(new { message = "No reactions found for this notification!" });
            }
            return Ok(reactions);
        }

        [HttpPost("{notificationId}/reaction")]
        public async Task<IActionResult> AddReactionAsync(int notificationId, [FromBody] AddReactionDto dto)
        {
            if (notificationId <= 0 || dto == null)
            {
                return BadRequest(new { message = "Invalid notification ID or reaction!" });
            }

            var reaction = new Reaction
            {
                NotificationId = notificationId,
                UserId = dto.UserId,
                Type = dto.Type
            };

            await _notificationRepository.AddReactionAsync(notificationId, reaction);
            return NoContent();
        }

        [HttpDelete("/reaction/{notificationId:int}/{reactionId:int}")]
        public async Task<IActionResult> DeleteReactionAsync(int notificationId, int reactionId)
        {
            if (notificationId <= 0 || reactionId <= 0)
            {
                return BadRequest(new { message = "Invalid notification ID or reaction ID!" });
            }
            await _notificationRepository.DeleteReactionAsync(notificationId, reactionId);
            return NoContent();
        }
    }
}
