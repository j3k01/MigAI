using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace MigAI.Domain.Entities
{
    public class Comment
    {
        [Key]
        public int Id { get; set; }

        [MaxLength(2048)]
        public string Content { get; set; } = string.Empty;

        [ForeignKey("Notification")]
        public int NotificationId { get; set; }
        public Notification Notification { get; set; } = null!;

        [ForeignKey("User")]
        public int UserId { get; set; }
        public User User { get; set; } = null!;

        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
    }
}
