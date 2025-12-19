using Backend.Data;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace Backend.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class MatchsController : Controller
    {
        private IBowlingLeagueRepository _bowling;

        public MatchsController(IBowlingLeagueRepository _temp)
        {
            _bowling = _temp;
        }

        // GET: api/Matchs/matches
        // Fetches list of Matches (Fixtures)
        [HttpGet("matches")]
        public IActionResult GetMatches()
        {
            try 
            {
                var matches = _bowling.TourneyMatches
                    .Select(m => new 
                    {
                        m.MatchId,
                        m.TourneyId,
                        TourneyLocation = m.Tourney != null ? m.Tourney.TourneyLocation : "Unknown",
                        TourneyDate = m.Tourney != null ? m.Tourney.TourneyDate : null,
                        m.Lanes,
                        OddLaneTeam = m.OddLaneTeam != null ? m.OddLaneTeam.TeamName : "TBD",
                        EvenLaneTeam = m.EvenLaneTeam != null ? m.EvenLaneTeam.TeamName : "TBD",
                        Winner = "TBD" // Placeholder for now
                    })
                    .ToList();

                return Ok(matches);
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { message = "Error fetching matches", error = ex.Message });
            }
        }

        // GET: api/Matchs/standings
        // Calculates Standings based on Match Results (simplified logic for now)
        [HttpGet("standings")]
        public IActionResult GetStandings()
        {
            try
            {
                // Simple logic: Count Matches Won per Team from MatchGames
                var matchGames = _bowling.MatchGames.ToList();
                var teams = _bowling.Teams.ToList();

                var standings = teams.Select(t => new 
                {
                    TeamId = t.TeamId,
                    TeamName = t.TeamName,
                    Played = matchGames.Count(mg => mg.WinningTeamId == t.TeamId || (mg.Match != null && (mg.Match.OddLaneTeamId == t.TeamId || mg.Match.EvenLaneTeamId == t.TeamId))), 
                    Won = matchGames.Count(mg => mg.WinningTeamId == t.TeamId),
                    Points = matchGames.Count(mg => mg.WinningTeamId == t.TeamId) * 3 // Example: 3 pts per win
                })
                .OrderByDescending(s => s.Points)
                .ToList();

                return Ok(standings);
            }
             catch (Exception ex)
            {
                 // Fallback if MatchGames is empty or complex joins fail
                return StatusCode(500, new { message = "Error fetching standings", error = ex.Message });
            }
        }
    }
}
