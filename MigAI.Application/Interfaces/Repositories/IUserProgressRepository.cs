using MigAI.Domain.Entities;

namespace MigAI.Application.Interfaces.Repositories
{
    public interface IUserProgressRepository
    {
        Task<UserProgress?> GetUserProgressForLessonAsync(int userId, int lessonId);
        Task<List<UserProgress>> GetAllProgressForUserAsync(int userId);
        Task AddProgressAsync(UserProgress userProgress);
        Task UpdateProgressAsync(UserProgress userProgress);
        Task DeleteProgressAsync(int userId, int lessonId);
        Task<List<Badge>> GetUserBadgesAsync(int userId);

    }
}
