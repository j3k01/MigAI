using System.ComponentModel.DataAnnotations.Schema;

namespace MigAI.Domain.Entities
{
    public class UserProgress
    {
        public int Id { get; set; }
        public float Score {  get; set; }
        public bool Completed { get; set; } = false;
        public DateTime CompletedDate {  get; set; }

        [ForeignKey("User")]
        public int UserId { get; set; }
        public User User { get; set; }
        [ForeignKey("Lesson")]
        public int LessonId {  get; set; }
        public Lesson Lesson { get; set; }
        [ForeignKey("Badge")]
        public int? BadgeId {  get; set; }
        public Badge Badge { get; set; }

    }
}
