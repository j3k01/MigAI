using MigAI.Domain.Entities;

namespace MigAI.Application.Interfaces.Repositories
{
    public interface ILessonRepository
    {
        Task<Lesson?> GetLessonByIdAsync(int lessonId);
        Task<Lesson?> GetLessonByTitle(string title);
        Task<List<Lesson>> GetAllAsync();
        Task<List<Lesson>> GetLessonsBySectionAsync(int sectionId);
        Task AddLessonAsync(Lesson lesson);
        Task UpdateLessonAsync(Lesson lesson);
        Task DeleteLessonAsync(int lessonId);
    }
}
