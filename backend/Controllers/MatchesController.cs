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
      public class MatchesController(IBowlingLeagueRepository temp, ITokenService token) : ControllerBase
      {
            private readonly IBowlingLeagueRepository _bowlingLeagueRepository = temp;
            private readonly ITokenService _tokenService = token;

            [HttpPost]
            [Authorize(Roles = "Admin")]
            public IActionResult CreateMatch([FromBody] MatchCreateDto matchDto)
            {
                  try
                  {
                        if (!ModelState.IsValid) return BadRequest(ModelState);

                        var match = new TourneyMatch
                        {
                              TourneyId = matchDto.TourneyId,
                              Lanes = matchDto.Lanes,
                              OddLaneTeamId = matchDto.OddLaneTeamId,
                              EvenLaneTeamId = matchDto.EvenLaneTeamId,
                              CreatedAt = DateTime.Now,
                              CreatedBy = User.FindFirst(System.Security.Claims.ClaimTypes.Email)?.Value
                        };

                        _bowlingLeagueRepository.CreateMatch(match);
                        return Ok(new { message = "Lên lịch trận đấu thành công!", matchId = match.MatchId });
                  }
                  catch (Exception ex)
                  {
                        return StatusCode(500, $"Lỗi server: {ex.Message}");
                  }
            }

            [HttpPut("{id}")]
            [Authorize(Roles = "Admin")]
            public IActionResult UpdateMatch(int id, [FromBody] MatchCreateDto matchDto)
            {
                  try
                  {
                        if (!ModelState.IsValid) return BadRequest(ModelState);

                        var match = _bowlingLeagueRepository.TourneyMatches.FirstOrDefault(m => m.MatchId == id);
                        if (match == null) return NotFound("Match not found");

                        match.TourneyId = matchDto.TourneyId;
                        match.Lanes = matchDto.Lanes;
                        match.OddLaneTeamId = matchDto.OddLaneTeamId;
                        match.EvenLaneTeamId = matchDto.EvenLaneTeamId;
                        match.UpdatedAt = DateTime.Now;
                        match.UpdatedBy = User.FindFirst(System.Security.Claims.ClaimTypes.Email)?.Value;
                        
                        if (matchDto.IsDelete)
                        {
                              match.IsDelete = true;
                              match.DeletedAt = DateTime.Now;
                              match.DeletedBy = User.FindFirst(System.Security.Claims.ClaimTypes.Email)?.Value;
                        }else
                        {
                              match.IsDelete = false;
                              match.DeletedAt = null;
                              match.DeletedBy = null;
                        }

                        _bowlingLeagueRepository.Update(match);
                        return Ok(new { message = "Cập nhật trận đấu thành công!", matchId = match.MatchId });
                  }
                  catch (Exception ex)
                  {
                        return StatusCode(500, $"Lỗi server: {ex.Message}");
                  }
            }

            // [HttpDelete("{id}")]
            // [Authorize(Roles = "Admin")]
            // public IActionResult DeleteMatch(int id)
            // {
            //       try
            //       {
            //             _bowlingLeagueRepository.DeleteMatch(id);
            //             return Ok(new { message = "Xóa trận đấu thành công!" });
            //       }
            //       catch (Exception ex)
            //       {
            //             return StatusCode(500, $"Lỗi server: {ex.Message}");
            //       }
            // }

            [HttpGet]
            [AllowAnonymous]
            public IActionResult GetMatches()
            {
                  try
                  {
                        var matchGames = _bowlingLeagueRepository.MatchGames.ToList();
                        var scores = _bowlingLeagueRepository.Scores.ToList();
                        var bowlers = _bowlingLeagueRepository.Bowlers.Where(b => b.IsDelete != true).ToList();

                        var matches = _bowlingLeagueRepository.TourneyMatches.Select(m =>
                        {
                              var games = matchGames.Where(mg => mg.MatchId == m.MatchId).ToList();

                              int oddLaneWins = 0;
                              int evenLaneWins = 0;

                              var matchScores = scores.Where(s => s.MatchId == m.MatchId).ToList();

                              // We assume 3 games usually
                              var gameNumbers = games.Select(g => g.GameNumber).Union(matchScores.Select(s => s.GameNumber)).Distinct();

                              foreach (var gameNum in gameNumbers)
                              {
                                    var gameScores = matchScores.Where(s => s.GameNumber == gameNum).ToList();

                                    if (gameScores.Count > 0)
                                    {
                                          // Calculate based on scores
                                          // Need bowler team info
                                          // Odd Team Score
                                          long oddScore = gameScores
                                                .Where(s => bowlers.Any(b => b.BowlerId == s.BowlerId && b.TeamId == m.OddLaneTeamId))
                                                .Sum(s => (long)((s.RawScore ?? 0) + (s.HandiCapScore ?? 0)));

                                          long evenScore = gameScores
                                                .Where(s => bowlers.Any(b => b.BowlerId == s.BowlerId && b.TeamId == m.EvenLaneTeamId))
                                                .Sum(s => (long)((s.RawScore ?? 0) + (s.HandiCapScore ?? 0)));

                                          if (oddScore > evenScore) oddLaneWins++;
                                          else if (evenScore > oddScore) evenLaneWins++;
                                    }
                                    else
                                    {
                                          // Fallback to existing MatchGame record
                                          var mg = games.FirstOrDefault(g => g.GameNumber == gameNum);
                                          if (mg != null)
                                          {
                                                if (mg.WinningTeamId == m.OddLaneTeamId) oddLaneWins++;
                                                else if (mg.WinningTeamId == m.EvenLaneTeamId) evenLaneWins++;
                                          }
                                    }
                              }

                              // Determine overall match winner (who won more games)
                              int? winningTeamId = null;
                              string? winningTeamName = null;

                              if (oddLaneWins > evenLaneWins)
                              {
                                    winningTeamId = m.OddLaneTeamId;
                                    winningTeamName = m.OddLaneTeam?.TeamName;
                              }
                              else if (evenLaneWins > oddLaneWins)
                              {
                                    winningTeamId = m.EvenLaneTeamId;
                                    winningTeamName = m.EvenLaneTeam?.TeamName;
                              }

                              return new MatchListDto
                              {
                                    MatchId = m.MatchId,
                                    TourneyLocation = m.Tourney?.TourneyLocation,
                                    TourneyDate = m.Tourney?.TourneyDate,
                                    OddLaneTeam = m.OddLaneTeam?.TeamName,
                                    EvenLaneTeam = m.EvenLaneTeam?.TeamName,
                                    Lanes = m.Lanes,
                                    TourneyId = m.TourneyId,
                                    OddLaneTeamId = m.OddLaneTeamId,
                                    EvenLaneTeamId = m.EvenLaneTeamId,
                                    HasResult = games.Count > 0 || matchScores.Count > 0,
                                    WinningTeamId = winningTeamId,
                                    WinningTeamName = winningTeamName,
                                    OddLaneWins = oddLaneWins,
                                    EvenLaneWins = evenLaneWins
                              };
                        }).ToList();

                        return Ok(matches);
                  }
                  catch (Exception ex)
                  {
                        return StatusCode(500, $"Internal Server Error: {ex.Message}");
                  }
            }

            [HttpGet("{matchId}/scores")]
            [AllowAnonymous]
            public IActionResult GetMatchScores(int matchId)
            {
                  try
                  {
                        var match = _bowlingLeagueRepository.TourneyMatches
                              .FirstOrDefault(m => m.MatchId == matchId);

                        if (match == null)
                              return NotFound(new { message = "Không tìm thấy match" });

                        var scores = _bowlingLeagueRepository.Scores
                              .Where(s => s.MatchId == matchId)
                              .ToList();
                        var bowlers = _bowlingLeagueRepository.Bowlers.ToList();
                        var teams = _bowlingLeagueRepository.Teams.ToList();

                        // Get bowler IDs for each team
                        var oddTeamBowlerIds = bowlers
                              .Where(b => b.TeamId == match.OddLaneTeamId)
                              .Select(b => b.BowlerId)
                              .ToList();
                        var evenTeamBowlerIds = bowlers
                              .Where(b => b.TeamId == match.EvenLaneTeamId)
                              .Select(b => b.BowlerId)
                              .ToList();

                        // Group scores by game number
                        var gameNumbers = scores.Select(s => s.GameNumber).Distinct().OrderBy(g => g);
                        var games = gameNumbers.Select(gameNum =>
                        {
                              var gameScores = scores.Where(s => s.GameNumber == gameNum).ToList();

                              int oddTeamTotal = gameScores
                                    .Where(s => oddTeamBowlerIds.Contains(s.BowlerId))
                                    .Sum(s => (s.RawScore ?? 0) + (s.HandiCapScore ?? 0));
                              int evenTeamTotal = gameScores
                                    .Where(s => evenTeamBowlerIds.Contains(s.BowlerId))
                                    .Sum(s => (s.RawScore ?? 0) + (s.HandiCapScore ?? 0));

                              int? winningTeamId = null;
                              if (oddTeamTotal > evenTeamTotal) winningTeamId = match.OddLaneTeamId;
                              else if (evenTeamTotal > oddTeamTotal) winningTeamId = match.EvenLaneTeamId;

                              var bowlerScoreDtos = gameScores.Select(s =>
                              {
                                    var bowler = bowlers.FirstOrDefault(b => b.BowlerId == s.BowlerId);
                                    return new BowlerGameScoreDto
                                    {
                                          BowlerId = s.BowlerId,
                                          BowlerName = bowler != null ? $"{bowler.BowlerFirstName} {bowler.BowlerLastName}" : "Unknown",
                                          TeamId = bowler?.TeamId,
                                          RawScore = s.RawScore ?? 0,
                                          HandicapScore = s.HandiCapScore,
                                          WonGame = s.WonGame
                                    };
                              }).ToList();

                              return new GameScoreDto
                              {
                                    GameNumber = gameNum,
                                    OddTeamTotalScore = oddTeamTotal,
                                    EvenTeamTotalScore = evenTeamTotal,
                                    WinningTeamId = winningTeamId,
                                    BowlerScores = bowlerScoreDtos
                              };
                        }).ToList();

                        var oddTeam = teams.FirstOrDefault(t => t.TeamId == match.OddLaneTeamId);
                        var evenTeam = teams.FirstOrDefault(t => t.TeamId == match.EvenLaneTeamId);

                        var result = new MatchScoreDetailDto
                        {
                              MatchId = matchId,
                              OddLaneTeam = oddTeam?.TeamName,
                              EvenLaneTeam = evenTeam?.TeamName,
                              OddLaneTeamId = match.OddLaneTeamId,
                              EvenLaneTeamId = match.EvenLaneTeamId,
                              Games = games
                        };

                        return Ok(result);
                  }
                  catch (Exception ex)
                  {
                        return StatusCode(500, $"Lỗi server: {ex.Message}");
                  }
            }

            [HttpPost("match-scores")]
            [Authorize(Roles = "Admin")]
            public IActionResult PostMatchScores([FromBody] MatchScoreInputDto dto)
            {
                  try
                  {
                        if (!ModelState.IsValid)
                              return BadRequest(ModelState);

                        var match = _bowlingLeagueRepository.TourneyMatches
                              .FirstOrDefault(m => m.MatchId == dto.MatchId);

                        if (match == null)
                              return NotFound(new { message = "Không tìm thấy match" });

                        var bowlers = _bowlingLeagueRepository.Bowlers.ToList();

                        // Get bowler IDs for each team
                        var oddTeamBowlerIds = bowlers
                              .Where(b => b.TeamId == match.OddLaneTeamId)
                              .Select(b => b.BowlerId)
                              .ToList();
                        var evenTeamBowlerIds = bowlers
                              .Where(b => b.TeamId == match.EvenLaneTeamId)
                              .Select(b => b.BowlerId)
                              .ToList();

                        // Calculate team totals to determine winner
                        int oddTeamTotal = dto.Scores
                              .Where(s => oddTeamBowlerIds.Contains(s.BowlerId))
                              .Sum(s => s.RawScore + (s.HandicapScore ?? 0));
                        int evenTeamTotal = dto.Scores
                              .Where(s => evenTeamBowlerIds.Contains(s.BowlerId))
                              .Sum(s => s.RawScore + (s.HandicapScore ?? 0));

                        int? winningTeamId = null;
                        if (oddTeamTotal > evenTeamTotal) winningTeamId = match.OddLaneTeamId;
                        else if (evenTeamTotal > oddTeamTotal) winningTeamId = match.EvenLaneTeamId;

                        // Create BowlerScore entries
                        foreach (var scoreEntry in dto.Scores)
                        {
                              var bowler = bowlers.FirstOrDefault(b => b.BowlerId == scoreEntry.BowlerId);
                              if (bowler == null) continue;

                              bool wonGame = bowler.TeamId == winningTeamId;

                              var bowlerScore = new BowlerScore
                              {
                                    MatchId = dto.MatchId,
                                    GameNumber = dto.GameNumber,
                                    BowlerId = scoreEntry.BowlerId,
                                    RawScore = scoreEntry.RawScore,
                                    HandiCapScore = scoreEntry.HandicapScore,
                                    WonGame = wonGame,
                                    CreatedAt = DateTime.Now,
                                    CreatedBy = User.FindFirst(System.Security.Claims.ClaimTypes.Email)?.Value
                              };

                              _bowlingLeagueRepository.CreateBowlerScore(bowlerScore);
                        }

                        // Also update/create MatchGame entry
                        _bowlingLeagueRepository.CreateOrUpdateMatchGame(dto.MatchId, dto.GameNumber, winningTeamId);

                        return Ok(new
                        {
                              message = "Nhập điểm thành công!",
                              matchId = dto.MatchId,
                              gameNumber = dto.GameNumber,
                              oddTeamTotal,
                              evenTeamTotal,
                              winningTeamId
                        });
                  }
                  catch (Exception ex)
                  {
                        return StatusCode(500, $"Lỗi server: {ex.Message}");
                  }
            }
      }
}
