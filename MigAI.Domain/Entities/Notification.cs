using System.ComponentModel.DataAnnotations;

namespace MigAI.Domain.Entities
{
    public class Notification
    {
        [Key]
        public int Id { get; set; }

        public string Title { get; set; } = string.Empty;
        public DateTime Date { get; set; }
        public int LikeCount { get; set; }
        public int GCount { get; set; }
        public int POGCount { get; set; }
        public int StinkyCount { get; set; }

        public ICollection<Reaction> Reactions { get; set; } = [];
        public ICollection<Comment> Comments { get; set; } = [];
    }

}
