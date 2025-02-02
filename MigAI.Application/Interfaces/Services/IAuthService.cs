namespace MigAI.Application.Interfaces.Services
{
    public interface IAuthService
    {
        Task<string> AuthenticateAsync(string email, string password);
    }
}
