using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Logging;
using MigAI.Application.Interfaces.Repositories;
using MigAI.Domain.Entities;

namespace MigAI.Infrastructure.Repositories
{
    public class UserProgressRepository : IUserProgressRepository
    {
        private readonly AppDbContext _context;
        private readonly ILogger<UserProgressRepository> _logger;
        public UserProgressRepository(AppDbContext context, ILogger<UserProgressRepository> logger) 
        {
            _context = context;
            _logger = logger;
        }
        public async Task AddProgressAsync(UserProgress userProgress)
        {
            await _context.UserProgress.AddAsync(userProgress);
            _context.SaveChanges();
        }

        public async Task DeleteProgressAsync(int userId, int lessonId)
        {
            var progress = await _context.UserProgress.Where(c => c.UserId == userId && c.LessonId == lessonId).FirstAsync();
            if (progress != null)
            {
                _context.UserProgress.Remove(progress);
                await _context.SaveChangesAsync();
            }
        }

        public async Task<List<UserProgress>> GetAllProgressForUserAsync(int userId)
        {
            return await _context.UserProgress
                .Where(c => c.UserId == userId)
                .AsNoTracking()
                .ToListAsync();
        }

        public async Task<UserProgress?> GetUserProgressForLessonAsync(int userId, int lessonId)
        {
            return await _context.UserProgress
                .Where(c => c.UserId == userId && c.LessonId == lessonId)
                .AsNoTracking()
                .FirstOrDefaultAsync();
        }

        public async Task UpdateProgressAsync(UserProgress userProgress)
        {
            _context.UserProgress.Update(userProgress);
            await _context.SaveChangesAsync();
        }
        public async Task<List<Badge>> GetUserBadgesAsync(int userId)
        {
            return await _context.UserProgress
                .Where(up => up.UserId == userId && up.BadgeId != null)
                .Select(up => up.Badge!)
                .AsNoTracking()
                .ToListAsync();
        }
    }
}
