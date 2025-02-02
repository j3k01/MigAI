using MigAI.Domain.Entities;

namespace MigAI.Application.Interfaces.Repositories
{
    public interface IUserProgressRepository
    {
        Task<UserProgress?> GetUserProgressAsync(string userId, int lessonId);
        Task<List<UserProgress>> GetAllProgressForUserAsync(string userId);
        Task AddProgressAsync(UserProgress userProgress);
        Task UpdateProgressAsync(UserProgress userProgress);
        Task DeleteProgressAsync(string userId, int lessonId);
    }
}
