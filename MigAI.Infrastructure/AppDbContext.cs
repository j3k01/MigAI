using Microsoft.EntityFrameworkCore;
using MigAI.Domain.Entities;
using System.Security.Cryptography.X509Certificates;

namespace MigAI.Infrastructure
{
    public class AppDbContext(DbContextOptions<AppDbContext> options) : DbContext(options)
    {
        public DbSet<User> Users { get; set; }
        public DbSet<Lesson> Lessons { get; set; }
        public DbSet<Section> Sections { get; set; }
        public DbSet<Sign> Signs { get; set; }
        public DbSet<AIModel> AIModels { get; set; }
        public DbSet<UserProgress> UserProgress { get; set; }

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            modelBuilder.Entity<User>().HasIndex(u => u.UserEmail).IsUnique();
        }
    }
}
