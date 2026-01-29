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
      public class TournamentsController(IBowlingLeagueRepository repository, ITokenService tokenService) : ControllerBase
      {
            private readonly IBowlingLeagueRepository _repository = repository;
            private readonly ITokenService _tokenService = tokenService;

            [HttpGet]
            [AllowAnonymous]
            public IActionResult GetTournaments()
            {
                  try
                  {
                        var tournaments = _repository.Tournaments
                              .Where(t => t.IsDelete != true)
                              .ToList();

                        return Ok(tournaments);
                  }
                  catch (Exception ex)
                  {
                        return StatusCode(500, $"Lỗi server khi tải danh sách giải đấu: {ex.Message}");
                  }
            }

            [HttpPost]
            [Authorize]
            public IActionResult PostTournament([FromBody] Tournament tournament)
            {
                  try
                  {
                        tournament.CreatedBy = User.FindFirst(System.Security.Claims.ClaimTypes.Email)?.Value;
                        tournament.CreatedAt = DateTime.Now;
                        tournament.IsDelete = false;

                        _repository.CreateTournament(tournament);

                        return CreatedAtAction(nameof(GetTournamentById), new { tournamentId = tournament.TourneyId }, tournament);
                  }
                  catch (Exception ex)
                  {
                        return StatusCode(500, $"Lỗi server khi tạo giải đấu: {ex.Message}");
                  }
            }

            [HttpGet("{tournamentId}")]
            [AllowAnonymous]
            public IActionResult GetTournamentById(int tournamentId)
            {
                  try
                  {
                        var tournament = _repository.Tournaments.FirstOrDefault(t => t.TourneyId == tournamentId);

                        if (tournament == null || tournament.IsDelete == true)
                        {
                              return NotFound(new { message = "Không tìm thấy giải đấu" });
                        }
                        return Ok(tournament);
                  }
                  catch (Exception ex)
                  {
                        return StatusCode(500, $"Lỗi server khi tìm giải đấu: {ex.Message}");
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
                              return BadRequest("Mã giải đấu không khớp (ID mismatch)");
                        }

                        // Lấy giải đấu hiện tại từ DB để cập nhật an toàn
                        var existingTournament = _repository.Tournaments.FirstOrDefault(t => t.TourneyId == tournamentId);

                        if (existingTournament == null)
                        {
                              return NotFound("Không tìm thấy giải đấu để cập nhật.");
                        }

                        var email = User.FindFirst(System.Security.Claims.ClaimTypes.Email)?.Value;

                        // Xử lý Soft Delete
                        if (tournament.IsDelete == true)
                        {
                              existingTournament.IsDelete = true;
                              existingTournament.DeletedAt = DateTime.Now;
                              existingTournament.DeletedBy = email;

                              _repository.Update(existingTournament);
                              return Ok(existingTournament);
                        }

                        existingTournament.TourneyDate = tournament.TourneyDate;
                        existingTournament.TourneyLocation = tournament.TourneyLocation;

                        existingTournament.UpdatedBy = email;
                        existingTournament.UpdatedAt = DateTime.Now;

                        _repository.Update(existingTournament);

                        return Ok(existingTournament);
                  }
                  catch (Exception ex)
                  {
                        return StatusCode(500, $"Lỗi server khi cập nhật giải đấu: {ex.Message}");
                  }
            }

            [HttpGet("tourneymatch")]
            [AllowAnonymous]
            public IActionResult GetTourneyMatch()
            {
                  try
                  {
                        var tournamentMatches = _repository.TourneyMatches.ToList();
                        return Ok(tournamentMatches);
                  }
                  catch (Exception ex)
                  {
                        return StatusCode(500, $"Lỗi server khi tải trận đấu giải: {ex.Message}");
                  }
            }
      }
}
