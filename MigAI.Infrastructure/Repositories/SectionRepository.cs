using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Logging;
using MigAI.Application.Interfaces.Repositories;
using MigAI.Domain.Entities;

namespace MigAI.Infrastructure.Repositories
{
    public class SectionRepository : ISectionRepository
    {
        private readonly AppDbContext _context;
        private readonly Logger<SectionRepository> _logger;

        public SectionRepository(AppDbContext context, Logger<SectionRepository> logger) 
        {
            _context = context;
            _logger = logger;
        }

        public async Task AddAsync(Section section)
        {
            await _context.Sections.AddAsync(section);
            await _context.SaveChangesAsync();
        }

        public async Task DeleteAsync(int sectionId)
        {
            var section = await _context.Sections.FindAsync(sectionId);
            if (section != null)
            {
                _context.Sections.Remove(section);
                await _context.SaveChangesAsync();
            }
        }

        public async Task<List<Section>> GetAllAsync()
        {
            try
            {
                return await _context.Sections
                    .AsNoTracking()
                    .ToListAsync();
            }
            catch (Exception ex) {
                _logger.LogError(ex, "Błąd podczas pobierania wszystkich rozdziałów z bazy danych.");
                return [];
            }
        }

        public async Task<Section?> GetSectionAsync(int sectionId)
        {
            return await _context.Sections.FindAsync(sectionId);
        }

        public async Task UpdateAsync(Section section)
        {
            _context.Sections.Update(section);
            await _context.SaveChangesAsync();
        }
    }
}
