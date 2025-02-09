using MigAI.Domain.Entities;
using MigAI.Application.Interfaces.Repositories;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Logging;

namespace MigAI.Infrastructure.Repositories
{
    public class LessonRepository : ILessonRepository
    {
        private readonly AppDbContext _context;
        private readonly ILogger<LessonRepository> _logger;

        public LessonRepository(AppDbContext context, ILogger<LessonRepository> logger)
        {
            _context = context;
            _logger = logger;
        }

        public async Task AddLessonAsync(Lesson lesson)
        {
            await _context.Lessons.AddAsync(lesson);
            await _context.SaveChangesAsync();
        }

        public async Task DeleteLessonAsync(int lessonId)
        {
            var lesson = await _context.Lessons.FindAsync(lessonId);
            if (lesson != null)
            {
                _context.Lessons.Remove(lesson);
                await _context.SaveChangesAsync();
            }
        }

        public async Task<List<Lesson>> GetAllAsync()
        {
            try
            {
                return await _context.Lessons
                    .AsNoTracking()
                    .ToListAsync();
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Błąd podczas pobierania wszystkich lekcji z bazy danych.");
                return [];
            }
        }

        public async Task<Lesson?> GetLessonByIdAsync(int lessonId)
        {
            return await _context.Lessons.FindAsync(lessonId);
        }

        public async Task<Lesson?> GetLessonByTitle(string title)
        {
            return await _context.Lessons.FirstOrDefaultAsync(c => c.Title == title);
        }

        public async Task<List<Lesson>> GetLessonsBySectionAsync(int sectionId)
        {
            throw new NotImplementedException();
        }

        public async Task UpdateLessonAsync(Lesson lesson)
        {
            _context.Lessons.Update(lesson);
            await _context.SaveChangesAsync();
        }
    }
}
