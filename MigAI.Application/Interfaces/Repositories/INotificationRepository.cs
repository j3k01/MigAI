using MigAI.Domain.Entities;

namespace MigAI.Application.Interfaces.Repositories
{
    public interface INotificationRepository
    {
        //Notifications section
        Task<Notification?> GetNotificationByIdAsync(int id);
        Task<Notification?> GetNotificationByTitleAsync(string title);
        Task<List<Notification>> GetAllAsync();
        Task<IEnumerable<Notification>> GetLatestNotificationWithDetailsAsync(int count = 10);
        Task<Notification> CreateNotificationAsync(Notification notification);
        Task UpdateNotificationAsync(Notification notification);
        Task DeleteNotificationAsync(int id);

        //Comments section
        Task AddCommentAsync(int notificationId, Comment comment);
        Task<IEnumerable<Comment>> GetCommentsAsync(int notificationId);
        Task UpdateCommentAsync(int notificationId, Comment comment);
        Task DeleteCommentAsync(int notificationId, int commentId);

        //Reactions section
        Task AddReactionAsync(int notificationId, Reaction reaction);
        //Task<IEnumerable<Reaction>> GetReactionsAsync(int notificationId); is it even useful? I need to re-think this one
        Task<Dictionary<ReactionType, int>> GetReactionCountsAsync(int notificationId);
        Task DeleteReactionAsync(int notificationId, int reactionId);
    }
}
