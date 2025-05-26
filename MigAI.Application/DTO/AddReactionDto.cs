using MigAI.Domain.Entities;
using System.ComponentModel.DataAnnotations;

namespace MigAI.API.Models
{
    public class AddReactionDto
    {
        [Required]
        public ReactionType Type { get; set; }

        [Required]
        public int UserId { get; set; }
    }
}
