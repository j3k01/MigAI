using MigAI.Domain.Entities;

namespace MigAI.Application.Interfaces.Repositories
{
    public interface ISectionRepository
    {
        Task<Section?> GetSectionAsync(int sectionId);
        Task<List<Section>> GetAllAsync();
        Task AddAsync(Section section);
        Task UpdateAsync(Section section);
        Task DeleteAsync(int sectionId);

    }
}
