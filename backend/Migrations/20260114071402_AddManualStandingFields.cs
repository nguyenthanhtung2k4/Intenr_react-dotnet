using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace Backend.Migrations
{
    /// <inheritdoc />
    public partial class AddManualStandingFields : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<int>(
                name: "ManualLosses",
                table: "Teams",
                type: "INTEGER",
                nullable: true);

            migrationBuilder.AddColumn<int>(
                name: "ManualPoints",
                table: "Teams",
                type: "INTEGER",
                nullable: true);

            migrationBuilder.AddColumn<int>(
                name: "ManualWins",
                table: "Teams",
                type: "INTEGER",
                nullable: true);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "ManualLosses",
                table: "Teams");

            migrationBuilder.DropColumn(
                name: "ManualPoints",
                table: "Teams");

            migrationBuilder.DropColumn(
                name: "ManualWins",
                table: "Teams");
        }
    }
}
