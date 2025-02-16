using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace MigAI.Infrastructure.Migrations
{
    /// <inheritdoc />
    public partial class AddBadgeModel : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<int>(
                name: "BadgeId",
                table: "UserProgress",
                type: "int",
                nullable: true);

            migrationBuilder.CreateTable(
                name: "Badge",
                columns: table => new
                {
                    Id = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    Name = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    Description = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    Icon = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    RequiredScore = table.Column<float>(type: "real", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Badge", x => x.Id);
                });

            migrationBuilder.CreateIndex(
                name: "IX_UserProgress_BadgeId",
                table: "UserProgress",
                column: "BadgeId");

            migrationBuilder.AddForeignKey(
                name: "FK_UserProgress_Badge_BadgeId",
                table: "UserProgress",
                column: "BadgeId",
                principalTable: "Badge",
                principalColumn: "Id");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_UserProgress_Badge_BadgeId",
                table: "UserProgress");

            migrationBuilder.DropTable(
                name: "Badge");

            migrationBuilder.DropIndex(
                name: "IX_UserProgress_BadgeId",
                table: "UserProgress");

            migrationBuilder.DropColumn(
                name: "BadgeId",
                table: "UserProgress");
        }
    }
}
