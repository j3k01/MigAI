namespace MigAI.Application.DTO
{
    public class CommentDto
    {
        public int Id { get; set; }
        public string Content { get; set; } = "";
        public int UserId { get; set; }
        public string DisplayName { get; set; } = "";
        public string UserEmail { get; set; } = "";
        public DateTime CreatedAt { get; set; }
    }
}
