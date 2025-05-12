using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace MigAI.Domain.Entities
{
    public enum ReactionType
    {
        Like,
        G,
        POG,
        Stinky
    }
    public class Reaction
    {
        [Key]
        public int Id { get; set; }
        public ReactionType Type { get; set; }

        [ForeignKey("Notification")]
        public int NotificationId { get; set; }
        public Notification Notification { get; set; } = null!;

        [ForeignKey("User")]
        public int UserId { get; set; }
        public User User { get; set; } = null!;
    }
}
