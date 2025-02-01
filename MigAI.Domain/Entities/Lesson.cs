using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace MigAI.Domain.Entities
{
    public class Lesson
    {
        [Key]
        public int Id { get; set; }
        public string Title { get; set; } = string.Empty;
        public string Description {  get; set; } = string.Empty;
        public string VideoUrl {  get; set; } = string.Empty;
        public int Order {  get; set; }
        [ForeignKey("Section")]
        public int SectionId { get; set; }
        public Section Section { get; set; }

        public List<Sign> Signs { get; set; } = new();
    }
}
