using MigAI.Domain.Enums;
using System.ComponentModel.DataAnnotations;

namespace MigAI.Domain.Entities
{
    public class User
    {
        [Key]
        public int Id { get; set; }
        public string UserEmail {  get; set; } = string.Empty;
        public string HashedPassword { get; set; } = string.Empty;
        public string DisplayName { get; set; } = string.Empty;
        public Role UserRole { get; set; } = Role.Student;
        public DateTime CreatedDate { get; set; } = DateTime.UtcNow;

        public List<UserProgress> Progress { get; set; } = new();

    }
}
