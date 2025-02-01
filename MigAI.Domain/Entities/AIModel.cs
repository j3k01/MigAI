namespace MigAI.Domain.Entities
{
    public class AIModel
    {
        public int Id { get; set; }
        public string Name { get; set; } = string.Empty;
        public string FilePath { get; set; } = string.Empty;
        public DateTime DateTrained { get; set; }
        public float Accurary { get; set; }
        public bool IsActive { get; set; }
    }
}
