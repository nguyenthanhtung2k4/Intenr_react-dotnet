using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace Backend.Migrations
{
    /// <inheritdoc />
    public partial class ISDelete_Table : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.RenameColumn(
                name: "IsDelete",
                table: "Bowlers",
                newName: "is_delete");

            migrationBuilder.RenameColumn(
                name: "IsDelete",
                table: "Accounts",
                newName: "is_delete");

            migrationBuilder.AddColumn<bool>(
                name: "is_delete",
                table: "ztblWeeks",
                type: "INTEGER",
                nullable: false,
                defaultValue: false);

            migrationBuilder.AddColumn<bool>(
                name: "is_delete",
                table: "ztblSkipLabels",
                type: "INTEGER",
                nullable: false,
                defaultValue: false);

            migrationBuilder.AddColumn<bool>(
                name: "is_delete",
                table: "ztblBowlerRatings",
                type: "INTEGER",
                nullable: false,
                defaultValue: false);

            migrationBuilder.AddColumn<bool>(
                name: "is_delete",
                table: "Tourney_Matches",
                type: "INTEGER",
                nullable: false,
                defaultValue: false);

            migrationBuilder.AddColumn<bool>(
                name: "is_delete",
                table: "Match_Games",
                type: "INTEGER",
                nullable: false,
                defaultValue: false);

            migrationBuilder.AlterColumn<bool>(
                name: "is_delete",
                table: "Bowlers",
                type: "INTEGER",
                nullable: false,
                defaultValue: false,
                oldClrType: typeof(bool),
                oldType: "INTEGER",
                oldNullable: true);

            migrationBuilder.AddColumn<bool>(
                name: "is_delete",
                table: "Bowler_Scores",
                type: "INTEGER",
                nullable: false,
                defaultValue: false);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "is_delete",
                table: "ztblWeeks");

            migrationBuilder.DropColumn(
                name: "is_delete",
                table: "ztblSkipLabels");

            migrationBuilder.DropColumn(
                name: "is_delete",
                table: "ztblBowlerRatings");

            migrationBuilder.DropColumn(
                name: "is_delete",
                table: "Tourney_Matches");

            migrationBuilder.DropColumn(
                name: "is_delete",
                table: "Match_Games");

            migrationBuilder.DropColumn(
                name: "is_delete",
                table: "Bowler_Scores");

            migrationBuilder.RenameColumn(
                name: "is_delete",
                table: "Bowlers",
                newName: "IsDelete");

            migrationBuilder.RenameColumn(
                name: "is_delete",
                table: "Accounts",
                newName: "IsDelete");

            migrationBuilder.AlterColumn<bool>(
                name: "IsDelete",
                table: "Bowlers",
                type: "INTEGER",
                nullable: true,
                oldClrType: typeof(bool),
                oldType: "INTEGER");
        }
    }
}
