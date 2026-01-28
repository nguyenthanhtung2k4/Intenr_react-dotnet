using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace Backend.Migrations
{
    /// <inheritdoc />
    public partial class AddAuditFields : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<DateTime>(
                name: "created_at",
                table: "ztblWeeks",
                type: "TEXT",
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "created_by",
                table: "ztblWeeks",
                type: "TEXT",
                nullable: true);

            migrationBuilder.AddColumn<DateTime>(
                name: "deleted_at",
                table: "ztblWeeks",
                type: "TEXT",
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "deleted_by",
                table: "ztblWeeks",
                type: "TEXT",
                nullable: true);

            migrationBuilder.AddColumn<DateTime>(
                name: "updated_at",
                table: "ztblWeeks",
                type: "TEXT",
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "updated_by",
                table: "ztblWeeks",
                type: "TEXT",
                nullable: true);

            migrationBuilder.AddColumn<DateTime>(
                name: "created_at",
                table: "ztblSkipLabels",
                type: "TEXT",
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "created_by",
                table: "ztblSkipLabels",
                type: "TEXT",
                nullable: true);

            migrationBuilder.AddColumn<DateTime>(
                name: "deleted_at",
                table: "ztblSkipLabels",
                type: "TEXT",
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "deleted_by",
                table: "ztblSkipLabels",
                type: "TEXT",
                nullable: true);

            migrationBuilder.AddColumn<DateTime>(
                name: "updated_at",
                table: "ztblSkipLabels",
                type: "TEXT",
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "updated_by",
                table: "ztblSkipLabels",
                type: "TEXT",
                nullable: true);

            migrationBuilder.AddColumn<DateTime>(
                name: "created_at",
                table: "ztblBowlerRatings",
                type: "TEXT",
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "created_by",
                table: "ztblBowlerRatings",
                type: "TEXT",
                nullable: true);

            migrationBuilder.AddColumn<DateTime>(
                name: "deleted_at",
                table: "ztblBowlerRatings",
                type: "TEXT",
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "deleted_by",
                table: "ztblBowlerRatings",
                type: "TEXT",
                nullable: true);

            migrationBuilder.AddColumn<DateTime>(
                name: "updated_at",
                table: "ztblBowlerRatings",
                type: "TEXT",
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "updated_by",
                table: "ztblBowlerRatings",
                type: "TEXT",
                nullable: true);

            migrationBuilder.AddColumn<DateTime>(
                name: "created_at",
                table: "Tourney_Matches",
                type: "TEXT",
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "created_by",
                table: "Tourney_Matches",
                type: "TEXT",
                nullable: true);

            migrationBuilder.AddColumn<DateTime>(
                name: "deleted_at",
                table: "Tourney_Matches",
                type: "TEXT",
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "deleted_by",
                table: "Tourney_Matches",
                type: "TEXT",
                nullable: true);

            migrationBuilder.AddColumn<DateTime>(
                name: "updated_at",
                table: "Tourney_Matches",
                type: "TEXT",
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "updated_by",
                table: "Tourney_Matches",
                type: "TEXT",
                nullable: true);

            migrationBuilder.AddColumn<DateTime>(
                name: "created_at",
                table: "Tournaments",
                type: "TEXT",
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "created_by",
                table: "Tournaments",
                type: "TEXT",
                nullable: true);

            migrationBuilder.AddColumn<DateTime>(
                name: "deleted_at",
                table: "Tournaments",
                type: "TEXT",
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "deleted_by",
                table: "Tournaments",
                type: "TEXT",
                nullable: true);

            migrationBuilder.AddColumn<DateTime>(
                name: "updated_at",
                table: "Tournaments",
                type: "TEXT",
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "updated_by",
                table: "Tournaments",
                type: "TEXT",
                nullable: true);

            migrationBuilder.AddColumn<DateTime>(
                name: "created_at",
                table: "Teams",
                type: "TEXT",
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "created_by",
                table: "Teams",
                type: "TEXT",
                nullable: true);

            migrationBuilder.AddColumn<DateTime>(
                name: "deleted_at",
                table: "Teams",
                type: "TEXT",
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "deleted_by",
                table: "Teams",
                type: "TEXT",
                nullable: true);

            migrationBuilder.AddColumn<DateTime>(
                name: "updated_at",
                table: "Teams",
                type: "TEXT",
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "updated_by",
                table: "Teams",
                type: "TEXT",
                nullable: true);

            migrationBuilder.AddColumn<DateTime>(
                name: "created_at",
                table: "Match_Games",
                type: "TEXT",
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "created_by",
                table: "Match_Games",
                type: "TEXT",
                nullable: true);

            migrationBuilder.AddColumn<DateTime>(
                name: "deleted_at",
                table: "Match_Games",
                type: "TEXT",
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "deleted_by",
                table: "Match_Games",
                type: "TEXT",
                nullable: true);

            migrationBuilder.AddColumn<DateTime>(
                name: "updated_at",
                table: "Match_Games",
                type: "TEXT",
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "updated_by",
                table: "Match_Games",
                type: "TEXT",
                nullable: true);

            migrationBuilder.AddColumn<DateTime>(
                name: "created_at",
                table: "Bowlers",
                type: "TEXT",
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "created_by",
                table: "Bowlers",
                type: "TEXT",
                nullable: true);

            migrationBuilder.AddColumn<DateTime>(
                name: "deleted_at",
                table: "Bowlers",
                type: "TEXT",
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "deleted_by",
                table: "Bowlers",
                type: "TEXT",
                nullable: true);

            migrationBuilder.AddColumn<DateTime>(
                name: "updated_at",
                table: "Bowlers",
                type: "TEXT",
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "updated_by",
                table: "Bowlers",
                type: "TEXT",
                nullable: true);

            migrationBuilder.AddColumn<DateTime>(
                name: "created_at",
                table: "Bowler_Scores",
                type: "TEXT",
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "created_by",
                table: "Bowler_Scores",
                type: "TEXT",
                nullable: true);

            migrationBuilder.AddColumn<DateTime>(
                name: "deleted_at",
                table: "Bowler_Scores",
                type: "TEXT",
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "deleted_by",
                table: "Bowler_Scores",
                type: "TEXT",
                nullable: true);

            migrationBuilder.AddColumn<DateTime>(
                name: "updated_at",
                table: "Bowler_Scores",
                type: "TEXT",
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "updated_by",
                table: "Bowler_Scores",
                type: "TEXT",
                nullable: true);

            migrationBuilder.AddColumn<DateTime>(
                name: "created_at",
                table: "Accounts",
                type: "TEXT",
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "created_by",
                table: "Accounts",
                type: "TEXT",
                nullable: true);

            migrationBuilder.AddColumn<DateTime>(
                name: "deleted_at",
                table: "Accounts",
                type: "TEXT",
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "deleted_by",
                table: "Accounts",
                type: "TEXT",
                nullable: true);

            migrationBuilder.AddColumn<DateTime>(
                name: "updated_at",
                table: "Accounts",
                type: "TEXT",
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "updated_by",
                table: "Accounts",
                type: "TEXT",
                nullable: true);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "created_at",
                table: "ztblWeeks");

            migrationBuilder.DropColumn(
                name: "created_by",
                table: "ztblWeeks");

            migrationBuilder.DropColumn(
                name: "deleted_at",
                table: "ztblWeeks");

            migrationBuilder.DropColumn(
                name: "deleted_by",
                table: "ztblWeeks");

            migrationBuilder.DropColumn(
                name: "updated_at",
                table: "ztblWeeks");

            migrationBuilder.DropColumn(
                name: "updated_by",
                table: "ztblWeeks");

            migrationBuilder.DropColumn(
                name: "created_at",
                table: "ztblSkipLabels");

            migrationBuilder.DropColumn(
                name: "created_by",
                table: "ztblSkipLabels");

            migrationBuilder.DropColumn(
                name: "deleted_at",
                table: "ztblSkipLabels");

            migrationBuilder.DropColumn(
                name: "deleted_by",
                table: "ztblSkipLabels");

            migrationBuilder.DropColumn(
                name: "updated_at",
                table: "ztblSkipLabels");

            migrationBuilder.DropColumn(
                name: "updated_by",
                table: "ztblSkipLabels");

            migrationBuilder.DropColumn(
                name: "created_at",
                table: "ztblBowlerRatings");

            migrationBuilder.DropColumn(
                name: "created_by",
                table: "ztblBowlerRatings");

            migrationBuilder.DropColumn(
                name: "deleted_at",
                table: "ztblBowlerRatings");

            migrationBuilder.DropColumn(
                name: "deleted_by",
                table: "ztblBowlerRatings");

            migrationBuilder.DropColumn(
                name: "updated_at",
                table: "ztblBowlerRatings");

            migrationBuilder.DropColumn(
                name: "updated_by",
                table: "ztblBowlerRatings");

            migrationBuilder.DropColumn(
                name: "created_at",
                table: "Tourney_Matches");

            migrationBuilder.DropColumn(
                name: "created_by",
                table: "Tourney_Matches");

            migrationBuilder.DropColumn(
                name: "deleted_at",
                table: "Tourney_Matches");

            migrationBuilder.DropColumn(
                name: "deleted_by",
                table: "Tourney_Matches");

            migrationBuilder.DropColumn(
                name: "updated_at",
                table: "Tourney_Matches");

            migrationBuilder.DropColumn(
                name: "updated_by",
                table: "Tourney_Matches");

            migrationBuilder.DropColumn(
                name: "created_at",
                table: "Tournaments");

            migrationBuilder.DropColumn(
                name: "created_by",
                table: "Tournaments");

            migrationBuilder.DropColumn(
                name: "deleted_at",
                table: "Tournaments");

            migrationBuilder.DropColumn(
                name: "deleted_by",
                table: "Tournaments");

            migrationBuilder.DropColumn(
                name: "updated_at",
                table: "Tournaments");

            migrationBuilder.DropColumn(
                name: "updated_by",
                table: "Tournaments");

            migrationBuilder.DropColumn(
                name: "created_at",
                table: "Teams");

            migrationBuilder.DropColumn(
                name: "created_by",
                table: "Teams");

            migrationBuilder.DropColumn(
                name: "deleted_at",
                table: "Teams");

            migrationBuilder.DropColumn(
                name: "deleted_by",
                table: "Teams");

            migrationBuilder.DropColumn(
                name: "updated_at",
                table: "Teams");

            migrationBuilder.DropColumn(
                name: "updated_by",
                table: "Teams");

            migrationBuilder.DropColumn(
                name: "created_at",
                table: "Match_Games");

            migrationBuilder.DropColumn(
                name: "created_by",
                table: "Match_Games");

            migrationBuilder.DropColumn(
                name: "deleted_at",
                table: "Match_Games");

            migrationBuilder.DropColumn(
                name: "deleted_by",
                table: "Match_Games");

            migrationBuilder.DropColumn(
                name: "updated_at",
                table: "Match_Games");

            migrationBuilder.DropColumn(
                name: "updated_by",
                table: "Match_Games");

            migrationBuilder.DropColumn(
                name: "created_at",
                table: "Bowlers");

            migrationBuilder.DropColumn(
                name: "created_by",
                table: "Bowlers");

            migrationBuilder.DropColumn(
                name: "deleted_at",
                table: "Bowlers");

            migrationBuilder.DropColumn(
                name: "deleted_by",
                table: "Bowlers");

            migrationBuilder.DropColumn(
                name: "updated_at",
                table: "Bowlers");

            migrationBuilder.DropColumn(
                name: "updated_by",
                table: "Bowlers");

            migrationBuilder.DropColumn(
                name: "created_at",
                table: "Bowler_Scores");

            migrationBuilder.DropColumn(
                name: "created_by",
                table: "Bowler_Scores");

            migrationBuilder.DropColumn(
                name: "deleted_at",
                table: "Bowler_Scores");

            migrationBuilder.DropColumn(
                name: "deleted_by",
                table: "Bowler_Scores");

            migrationBuilder.DropColumn(
                name: "updated_at",
                table: "Bowler_Scores");

            migrationBuilder.DropColumn(
                name: "updated_by",
                table: "Bowler_Scores");

            migrationBuilder.DropColumn(
                name: "created_at",
                table: "Accounts");

            migrationBuilder.DropColumn(
                name: "created_by",
                table: "Accounts");

            migrationBuilder.DropColumn(
                name: "deleted_at",
                table: "Accounts");

            migrationBuilder.DropColumn(
                name: "deleted_by",
                table: "Accounts");

            migrationBuilder.DropColumn(
                name: "updated_at",
                table: "Accounts");

            migrationBuilder.DropColumn(
                name: "updated_by",
                table: "Accounts");
        }
    }
}
