using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace Backend.Migrations
{
    /// <inheritdoc />
    public partial class FixedSQLiteAutoIncrement : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.CreateTable(
                name: "Teams",
                columns: table => new
                {
                    TeamID = table.Column<int>(type: "INTEGER", nullable: false)
                        .Annotation("Sqlite:Autoincrement", true),
                    TeamName = table.Column<string>(type: "nvarchar (50)", nullable: true),
                    CaptainID = table.Column<int>(type: "INT", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Teams", x => x.TeamID);
                });

            migrationBuilder.CreateTable(
                name: "Tournaments",
                columns: table => new
                {
                    TourneyID = table.Column<int>(type: "INTEGER", nullable: false)
                        .Annotation("Sqlite:Autoincrement", true),
                    TourneyDate = table.Column<DateOnly>(type: "date", nullable: true),
                    TourneyLocation = table.Column<string>(type: "nvarchar (50)", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Tournaments", x => x.TourneyID);
                });

            migrationBuilder.CreateTable(
                name: "ztblBowlerRatings",
                columns: table => new
                {
                    BowlerRating = table.Column<string>(type: "nvarchar (15)", nullable: false),
                    BowlerLowAvg = table.Column<short>(type: "smallint", nullable: true),
                    BowlerHighAvg = table.Column<short>(type: "smallint", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_ztblBowlerRatings", x => x.BowlerRating);
                });

            migrationBuilder.CreateTable(
                name: "ztblSkipLabels",
                columns: table => new
                {
                    LabelCount = table.Column<int>(type: "INT", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_ztblSkipLabels", x => x.LabelCount);
                });

            migrationBuilder.CreateTable(
                name: "ztblWeeks",
                columns: table => new
                {
                    WeekStart = table.Column<DateOnly>(type: "date", nullable: false),
                    WeekEnd = table.Column<DateOnly>(type: "date", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_ztblWeeks", x => x.WeekStart);
                });

            migrationBuilder.CreateTable(
                name: "Bowlers",
                columns: table => new
                {
                    BowlerID = table.Column<int>(type: "INTEGER", nullable: false)
                        .Annotation("Sqlite:Autoincrement", true),
                    BowlerFirstName = table.Column<string>(type: "nvarchar (50)", nullable: false),
                    BowlerLastName = table.Column<string>(type: "nvarchar (50)", nullable: false),
                    BowlerMiddleInit = table.Column<string>(type: "nvarchar (1)", nullable: true),
                    BowlerAddress = table.Column<string>(type: "nvarchar (50)", nullable: true),
                    BowlerCity = table.Column<string>(type: "nvarchar (50)", nullable: true),
                    BowlerState = table.Column<string>(type: "nvarchar (2)", nullable: true),
                    BowlerZip = table.Column<string>(type: "nvarchar (10)", nullable: true),
                    BowlerPhoneNumber = table.Column<string>(type: "nvarchar (14)", nullable: true),
                    IsDelete = table.Column<bool>(type: "INTEGER", nullable: true),
                    TeamID = table.Column<int>(type: "INT", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Bowlers", x => x.BowlerID);
                    table.ForeignKey(
                        name: "FK_Bowlers_Teams_TeamID",
                        column: x => x.TeamID,
                        principalTable: "Teams",
                        principalColumn: "TeamID");
                });

            migrationBuilder.CreateTable(
                name: "Tourney_Matches",
                columns: table => new
                {
                    MatchID = table.Column<int>(type: "INTEGER", nullable: false)
                        .Annotation("Sqlite:Autoincrement", true),
                    TourneyID = table.Column<int>(type: "INT", nullable: true, defaultValue: 0),
                    Lanes = table.Column<string>(type: "nvarchar (5)", nullable: true),
                    OddLaneTeamID = table.Column<int>(type: "INT", nullable: true, defaultValue: 0),
                    EvenLaneTeamID = table.Column<int>(type: "INT", nullable: true, defaultValue: 0)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Tourney_Matches", x => x.MatchID);
                    table.ForeignKey(
                        name: "FK_Tourney_Matches_Teams_EvenLaneTeamID",
                        column: x => x.EvenLaneTeamID,
                        principalTable: "Teams",
                        principalColumn: "TeamID");
                    table.ForeignKey(
                        name: "FK_Tourney_Matches_Teams_OddLaneTeamID",
                        column: x => x.OddLaneTeamID,
                        principalTable: "Teams",
                        principalColumn: "TeamID");
                    table.ForeignKey(
                        name: "FK_Tourney_Matches_Tournaments_TourneyID",
                        column: x => x.TourneyID,
                        principalTable: "Tournaments",
                        principalColumn: "TourneyID");
                });

            migrationBuilder.CreateTable(
                name: "Bowler_Scores",
                columns: table => new
                {
                    MatchID = table.Column<int>(type: "INT", nullable: false),
                    GameNumber = table.Column<short>(type: "smallint", nullable: false),
                    BowlerID = table.Column<int>(type: "INT", nullable: false),
                    RawScore = table.Column<short>(type: "smallint", nullable: true, defaultValue: (short)0),
                    HandiCapScore = table.Column<short>(type: "smallint", nullable: true, defaultValue: (short)0),
                    WonGame = table.Column<bool>(type: "bit", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Bowler_Scores", x => new { x.MatchID, x.GameNumber, x.BowlerID });
                    table.ForeignKey(
                        name: "FK_Bowler_Scores_Bowlers_BowlerID",
                        column: x => x.BowlerID,
                        principalTable: "Bowlers",
                        principalColumn: "BowlerID");
                });

            migrationBuilder.CreateTable(
                name: "Match_Games",
                columns: table => new
                {
                    MatchID = table.Column<int>(type: "INT", nullable: false),
                    GameNumber = table.Column<short>(type: "smallint", nullable: false),
                    WinningTeamID = table.Column<int>(type: "INT", nullable: true, defaultValue: 0)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Match_Games", x => new { x.MatchID, x.GameNumber });
                    table.ForeignKey(
                        name: "FK_Match_Games_Tourney_Matches_MatchID",
                        column: x => x.MatchID,
                        principalTable: "Tourney_Matches",
                        principalColumn: "MatchID");
                });

            migrationBuilder.CreateIndex(
                name: "BowlerID",
                table: "Bowler_Scores",
                column: "BowlerID");

            migrationBuilder.CreateIndex(
                name: "MatchGamesBowlerScores",
                table: "Bowler_Scores",
                columns: new[] { "MatchID", "GameNumber" });

            migrationBuilder.CreateIndex(
                name: "BowlerLastName",
                table: "Bowlers",
                column: "BowlerLastName");

            migrationBuilder.CreateIndex(
                name: "BowlersTeamID",
                table: "Bowlers",
                column: "TeamID");

            migrationBuilder.CreateIndex(
                name: "Team1ID",
                table: "Match_Games",
                column: "WinningTeamID");

            migrationBuilder.CreateIndex(
                name: "TourneyMatchesMatchGames",
                table: "Match_Games",
                column: "MatchID");

            migrationBuilder.CreateIndex(
                name: "TeamID",
                table: "Teams",
                column: "TeamID",
                unique: true);

            migrationBuilder.CreateIndex(
                name: "Tourney_MatchesEven",
                table: "Tourney_Matches",
                column: "EvenLaneTeamID");

            migrationBuilder.CreateIndex(
                name: "TourneyMatchesOdd",
                table: "Tourney_Matches",
                column: "OddLaneTeamID");

            migrationBuilder.CreateIndex(
                name: "TourneyMatchesTourneyID",
                table: "Tourney_Matches",
                column: "TourneyID");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "Bowler_Scores");

            migrationBuilder.DropTable(
                name: "Match_Games");

            migrationBuilder.DropTable(
                name: "ztblBowlerRatings");

            migrationBuilder.DropTable(
                name: "ztblSkipLabels");

            migrationBuilder.DropTable(
                name: "ztblWeeks");

            migrationBuilder.DropTable(
                name: "Bowlers");

            migrationBuilder.DropTable(
                name: "Tourney_Matches");

            migrationBuilder.DropTable(
                name: "Teams");

            migrationBuilder.DropTable(
                name: "Tournaments");
        }
    }
}
