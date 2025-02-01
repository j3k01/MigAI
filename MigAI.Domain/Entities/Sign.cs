using System.ComponentModel.DataAnnotations.Schema;

namespace MigAI.Domain.Entities
{
    public class Sign
    {
        public int Id { get; set; }
        public string Name { get; set; } = string.Empty;
        public string VideoUrl { get; set; } = string.Empty;
        public string HandCoordinates { get; set; } = string.Empty;
        [ForeignKey("Lesson")]
        public int LessonId { get; set; }
        public Lesson Lesson { get; set; }
    }
}
