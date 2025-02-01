namespace MigAI.Domain.Entities
{
    public class Section
    {
        public int Id { get; set; }
        public string Title { get; set; } = string.Empty;
        public string Description { get; set; } = string.Empty;
        public int Order { get; set; }
        public DateTime TimeToFinish { get; set; }

        public List<Lesson> Lessons { get; set; } = new();
    }
}
