using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Backend.Data;
using Backend.Dtos;
using Backend.Data.DTO;
using System.Linq.Expressions;
using Backend.Data.Services;
using Microsoft.AspNetCore.Authorization;
// using Microsoft.OpenApi.Validations.Rules;   

namespace Backend.Controllers
{
      [Route("api/[controller]")]
      [ApiController]
      public class TeamsController(IBowlingLeagueRepository temp, ITokenService token) : ControllerBase
      {
            private readonly IBowlingLeagueRepository _bowlingLeagueRepository = temp;
            private readonly ITokenService _tokenService = token;


            [HttpGet]
            [AllowAnonymous]

            public ActionResult<IEnumerable<Team>> GetTeams()
            {
                  var teams = _bowlingLeagueRepository.Teams;
                  try
                  {
                        if (teams == null || !teams.Any())
                        {
                              return NotFound("Không tìm thấy danh sách đội.");
                        }
                        var DES = teams.OrderByDescending(t => t.TeamId).Where(t => t.IsDelete == false).ToList();
                        return Ok(DES);
                  }
                  catch (System.Exception ex)
                  {
                        return StatusCode(500, $"Lỗi server khi tải đội: {ex.Message}");
                  }
            }

            [HttpPost]
            [Authorize]

            public IActionResult PostTeam([FromBody] TeamPostDto newTeamDto)
            {
                  if (!ModelState.IsValid)
                  {
                        return BadRequest(ModelState);
                  }

                  // Validate TeamName is required for creating a new team
                  if (string.IsNullOrEmpty(newTeamDto.TeamName))
                  {
                        return BadRequest(new { message = "TeamName is required." });
                  }

                  try
                  {
                        var team = new Team
                        {
                              TeamName = newTeamDto.TeamName,
                              CaptainId = newTeamDto.CaptainId,
                              IsDelete = false
                        };

                        _bowlingLeagueRepository.CreateTeam(team);

                        return CreatedAtAction(
                            nameof(GetTeams),
                            new { id = team.TeamId },
                            team
                        );
                  }
                  catch (Exception e)
                  {
                        return StatusCode(500, $"Lỗi server khi tạo đội: {e.Message}");
                  }
            }

            [HttpPatch("{teamId}")]
            [Authorize]

            public IActionResult UpdateTeam(int teamId, [FromBody] TeamPostDto teamDto)
            {
                  if (!ModelState.IsValid)
                  {
                        return BadRequest(ModelState);
                  }

                  try
                  {
                        var team = _bowlingLeagueRepository.Teams.FirstOrDefault(t => t.TeamId == teamId);

                        if (team == null)
                        {
                              return NotFound("Không tìm thấy đội để cập nhật.");
                        }

                        // Chỉ cập nhật các trường được gửi lên (không null)
                        if (!string.IsNullOrEmpty(teamDto.TeamName))
                        {
                              team.TeamName = teamDto.TeamName;
                        }

                        if (teamDto.CaptainId.HasValue)
                        {
                              team.CaptainId = teamDto.CaptainId;
                        }

                        // IsDelete luôn được cập nhật vì nó là bool (không nullable trong DTO)
                        team.IsDelete = teamDto.IsDelete;

                        _bowlingLeagueRepository.Update(team);

                        return Ok(team);
                  }
                  catch (Exception e)
                  {
                        return StatusCode(500, $"Lỗi server khi cập nhật đội: {e.Message}");
                  }
            }



            [HttpGet("{teamId}/bowlers")]
            [AllowAnonymous]

            public IActionResult GetBowlerByTeamId(int teamId)
            {
                  try
                  {
                        if (!ModelState.IsValid)
                        {
                              return BadRequest(ModelState);
                        }
                        var data = _bowlingLeagueRepository.Bowlers
                        .Where((e) => e.TeamId == teamId && e.IsDelete != true)
                        .ToList();

                        if (data == null || data.Count == 0)
                        {
                              return Ok(new List<Bowler>());
                        }

                        return Ok(data);

                  }
                  catch (Exception ex)
                  {
                        return StatusCode(500, $" Loi  sercver khi tai  cau thu: {ex}");
                  }
            }
      }
}