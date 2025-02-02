using MigAI.Domain.Entities;

namespace MigAI.Application.Interfaces.Repositories
{
    public interface ISignRepository
    {
        Task<Sign?> GetSignAsync(string id);
        Task<List<Sign>> GetAllAsync();
        Task<List<Sign>> GetSignsByLessonAsync(int lessonId);
        Task AddAsync(Sign sign);
        Task UpdateAsync(Sign sign);
        Task DeleteAsync(string id);
    }
}
