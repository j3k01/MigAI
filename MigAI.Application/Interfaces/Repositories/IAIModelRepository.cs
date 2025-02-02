using MigAI.Domain.Entities;

namespace MigAI.Application.Interfaces.Repositories
{
    public interface IAIModelRepository
    {
        Task<AIModel?> GetActiveModelAsync();
        Task<List<AIModel>> GetAllModelsAsync();
        Task AddAsync(AIModel aIModel);
        Task UpdateAsync(AIModel aIModel);
        Task DeleteAsync(int modelId);
    }
}
