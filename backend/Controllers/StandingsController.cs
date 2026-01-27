using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Backend.Data;
using Backend.Dtos;
using Backend.Data.DTO;
using System.Linq.Expressions;
using Backend.Data.Services;
using Microsoft.AspNetCore.Authorization;

namespace Backend.Controllers
{
      [Route("api/[controller]")]
      [ApiController]
      public class StandingsController(IBowlingLeagueRepository temp, ITokenService token) : ControllerBase
      {
            private readonly IBowlingLeagueRepository _bowlingLeagueRepository = temp;
            private readonly ITokenService _tokenService = token;

            [HttpGet]
            [AllowAnonymous]
            public IActionResult GetStandings()
            {
                  try
                  {
                        var teams = _bowlingLeagueRepository.Teams.Where(t => !t.IsDelete).ToList();
                        var standings = new List<StandingDto>();

                        var matchGames = _bowlingLeagueRepository.MatchGames.ToList();
                        var tourneyMatches = _bowlingLeagueRepository.TourneyMatches.ToList();
                        var scores = _bowlingLeagueRepository.Scores.ToList();
                        var bowlers = _bowlingLeagueRepository.Bowlers.ToList();

                        foreach (var team in teams)
                        {
                              int actualPlayed = tourneyMatches.Count(m => m.OddLaneTeamId == team.TeamId || m.EvenLaneTeamId == team.TeamId);
                              int actualWon = matchGames.Count(mg => mg.WinningTeamId == team.TeamId);
                              int actualLost = actualPlayed - actualWon;
                              var teamMatchIds = tourneyMatches
                                    .Where(m => m.OddLaneTeamId == team.TeamId || m.EvenLaneTeamId == team.TeamId)
                                    .Select(m => m.MatchId)
                                    .ToList();

                              var teamGames = matchGames.Where(mg => teamMatchIds.Contains(mg.MatchId)).ToList();

                              int gamesPlayed = teamGames.Count;
                              int gamesWon = teamGames.Count(mg => mg.WinningTeamId == team.TeamId);
                              int gamesLost = gamesPlayed - gamesWon;
                              int points = gamesWon * 2;

                              // 2. Calculate Stats from BowlerScores (Total Pins)
                              var teamBowlerIds = bowlers.Where(b => b.TeamId == team.TeamId).Select(b => b.BowlerId).ToList();
                              var teamScores = scores.Where(s => teamBowlerIds.Contains(s.BowlerId)).ToList();

                              long totalPins = teamScores.Sum(s => (long)(s.RawScore ?? 0));
                              double average = gamesPlayed > 0 ? (double)totalPins / gamesPlayed : 0;
                              int totalBowlerGames = teamScores.Count;
                              double teamAverage = totalBowlerGames > 0 ? (double)totalPins / totalBowlerGames : 0;
                              double averagePerGame = gamesPlayed > 0 ? (double)totalPins / gamesPlayed : 0;

                              standings.Add(new StandingDto
                              {
                                    TeamId = team.TeamId,
                                    TeamName = team.TeamName ?? "Unknown",
                                    Played = gamesPlayed,
                                    Won = gamesWon,
                                    Lost = gamesLost,
                                    Points = points,
                                    TotalPins = (int)totalPins,
                                    Average = Math.Round(averagePerGame, 1)
                              });
                        }

                        return Ok(standings.OrderByDescending(s => s.Points).ThenByDescending(s => s.TotalPins));
                  }
                  catch (Exception ex)
                  {
                        return StatusCode(500, $"Internal Server Error: {ex.Message}");
                  }
            }



            [HttpPut("{teamId}")]
            [Authorize(Roles = "Admin")]
            public IActionResult UpdateStanding(int teamId, [FromBody] UpdateStandingDto dto)
            {
                  try
                  {
                        var team = _bowlingLeagueRepository.Teams.FirstOrDefault(t => t.TeamId == teamId);
                        if (team == null || team.IsDelete)
                        {
                              return NotFound(new { message = "Không tìm thấy đội" });
                        }

                        // Update manual override fields
                        team.ManualWins = dto.ManualWins;
                        team.ManualLosses = dto.ManualLosses;
                        team.ManualPoints = dto.ManualPoints;

                        _bowlingLeagueRepository.Update(team);

                        return Ok(new { message = "Cập nhật điểm thành công", team });
                  }
                  catch (Exception ex)
                  {
                        return StatusCode(500, $"Lỗi server: {ex.Message}");
                  }
            }
      }
}
