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
      public class TournamentsController(IBowlingLeagueRepository temp, ITokenService token) : ControllerBase
      {
            private readonly IBowlingLeagueRepository _bowlingLeagueRepository = temp;
            private readonly ITokenService _tokenService = token;

            [HttpGet]
            [AllowAnonymous]
            public IActionResult GetTournaments()
            {
                  try
                  {
                        var tournaments = _bowlingLeagueRepository.Tournaments.Where(t => t.IsDelete != true).ToList();
                        if (tournaments == null || tournaments.Count == 0)
                        {
                              return Ok(new List<Tournament>());
                        }
                        return Ok(tournaments);
                  }
                  catch (Exception ex)
                  {
                        return StatusCode(500, $"Loi server khi tai turnament: {ex}");
                  }
            }

            [HttpPost]
            [Authorize]
            public IActionResult PostTournament([FromBody] Tournament tournament)
            {
                  try
                  {
                        if (!ModelState.IsValid)
                        {
                              return BadRequest(ModelState);
                        }
                        _bowlingLeagueRepository.CreateTournament(tournament);
                        return Ok(tournament);
                  }
                  catch (Exception ex)
                  {
                        return StatusCode(500, $"Loi server khi tao turnament: {ex}");
                  }
            }

            [HttpGet("{tournamentId}")]
            [AllowAnonymous]
            public IActionResult GetTournamentById(int tournamentId)
            {
                  try
                  {
                        var tournament = _bowlingLeagueRepository.Tournaments.FirstOrDefault(t => t.TourneyId == tournamentId);
                        if (tournament == null || tournament.IsDelete == true)
                        {
                              return NotFound(new { message = "Không tìm thấy giải đấu" });
                        }
                        return Ok(tournament);
                  }
                  catch (Exception ex)
                  {
                        return StatusCode(500, $"Loi server khi tai turnament: {ex}");
                  }
            }

            [HttpPut("{tournamentId}")]
            [Authorize]
            public IActionResult PutTournament(int tournamentId, [FromBody] Tournament tournament)
            {
                  try
                  {
                        if (tournamentId != tournament.TourneyId)
                        {
                              return BadRequest("ID mismatch");
                        }
                        _bowlingLeagueRepository.Update(tournament);
                        return Ok(tournament);
                  }
                  catch (Exception ex)
                  {
                        return StatusCode(500, $"Loi server khi tai turnament: {ex}");
                  }
            }

            [HttpGet("tourneymatch")]
            [AllowAnonymous]
            public IActionResult GetTourneyMatch()
            {
                  try
                  {
                        var tournamentMatches = _bowlingLeagueRepository.TourneyMatches.ToList();
                        if (tournamentMatches == null || tournamentMatches.Count == 0)
                        {
                              return Ok(new List<TourneyMatch>());
                        }
                        return Ok(tournamentMatches);
                  }
                  catch (Exception ex)
                  {
                        return StatusCode(500, $"Loi server khi tai turnament matches: {ex}");
                  }
            }
      }
}
