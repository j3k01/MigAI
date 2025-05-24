using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Logging;
using MigAI.Application.DTO;
using MigAI.Application.Interfaces.Repositories;
using MigAI.Domain.Entities;

namespace MigAI.Infrastructure.Repositories
{
    public class NotificationRepository : INotificationRepository
    {
        private readonly AppDbContext _context;
        private readonly ILogger<NotificationRepository> _logger;

        public NotificationRepository(AppDbContext context, ILogger<NotificationRepository> logger)
        {
            _context = context;
            _logger = logger;
        }

        //Notifications section
        public async Task<Notification?> GetNotificationByIdAsync(int id)
        {
            return await _context.Notifications.FindAsync(id);
        }

        public async Task<Notification?> GetNotificationByTitleAsync(string title)
        {
            return await _context.Notifications.FirstOrDefaultAsync(n => n.Title == title);

        }

        public async Task<IEnumerable<Notification>> GetLatestNotificationWithDetailsAsync(int count = 10)
        {
            return await _context.Notifications
                .Include(n => n.Comments)
                .Include(n => n.Reactions)
                .AsNoTracking()
                .OrderByDescending(n => n.Date)
                .Take(count)
                .ToListAsync();
        }

        public async Task<List<Notification>> GetAllAsync()
        {
            return await _context.Notifications.AsNoTracking().ToListAsync();
        }
        public async Task<Notification> CreateNotificationAsync(Notification notification)
        {
            await _context.Notifications.AddAsync(notification);
            await _context.SaveChangesAsync();
            return notification;
        }

        public async Task UpdateNotificationAsync(Notification notification)
        {
            var existing = await _context.Notifications.FindAsync(notification.Id);
            if (existing == null)
                throw new KeyNotFoundException($"Notification {notification.Id} not found!");

            existing.Title = notification.Title;
            existing.Comments = notification.Comments;
            existing.Date = notification.Date;
            existing.Reactions = notification.Reactions;
            existing.LikeCount = notification.LikeCount;
            existing.GCount = notification.GCount;
            existing.POGCount = notification.POGCount;
            existing.StinkyCount = notification.StinkyCount;

            await _context.SaveChangesAsync();
        }

        public async Task DeleteNotificationAsync(int id)
        {
            var notification = await _context.Notifications.FindAsync(id);
            if (notification != null)
            {
                _context.Notifications.Remove(notification);
                await _context.SaveChangesAsync();
            }
        }

        //Comments section
        public async Task<IEnumerable<CommentDto>> GetCommentsAsync(int notificationId)
        {
            return await _context.Comments
                .Where(c => c.NotificationId == notificationId)
                .AsNoTracking()
                .Select(c => new CommentDto
                {
                    Id = c.Id,
                    Content = c.Content,
                    UserEmail = c.User.UserEmail,
                    CreatedAt = c.CreatedAt,
                    DisplayName = c.User.DisplayName
                })
                .ToListAsync();
        }
        public async Task AddCommentAsync(int notificationId, Comment comment)
        {
            comment.NotificationId = notificationId;
            await _context.Comments.AddAsync(comment);
            await _context.SaveChangesAsync();
        }
        public async Task UpdateCommentAsync(int notificationId, Comment comment)
        {
            comment.NotificationId = notificationId;
            _context.Comments.Update(comment);
            await _context.SaveChangesAsync();

        }

        public async Task DeleteCommentAsync(int notificationId, int commentId)
        {
            var comment = await _context.Comments
                .FirstOrDefaultAsync(c => c.Id == commentId && c.NotificationId == notificationId) 
                ?? throw new KeyNotFoundException($"Comment {commentId} not found for notification {notificationId}");
            _context.Comments.Remove(comment);
            await _context.SaveChangesAsync();
        }

        //Reactions section
        public async Task<Dictionary<ReactionType, int>> GetReactionCountsAsync(int notificationId)
        {
            return await _context.Reactions
                .Where(r => r.NotificationId == notificationId)
                .GroupBy(r => r.Type)
                .Select(g => new { g.Key, Count = g.Count() })
                .ToDictionaryAsync(k => k.Key, v => v.Count);
        }

        //public Task<IEnumerable<Reaction>> GetReactionsAsync(int notificationId)
        //{
        //    throw new NotImplementedException();
        //}

        public async Task AddReactionAsync(int notificationId, Reaction reaction)
        {
            reaction.NotificationId = notificationId;

            var existing = await _context.Reactions
                .FirstOrDefaultAsync(r => r.NotificationId == notificationId
                                       && r.UserId == reaction.UserId);

            if (existing != null)
            {
                existing.Type = reaction.Type;
            }
            else
            {
                await _context.Reactions.AddAsync(reaction);
            }

            await _context.SaveChangesAsync();
        }

        public async Task DeleteReactionAsync(int notificationId, int reactionId)
        {
            var reaction = await _context.Reactions
                .FirstOrDefaultAsync(r =>
                    r.Id == reactionId &&
                    r.NotificationId == notificationId);

            if (reaction != null)
            {
                _context.Reactions.Remove(reaction);
                await _context.SaveChangesAsync();
            }
        }
    }
}
