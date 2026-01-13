using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Backend.Data;
using Backend.Dtos;
using Backend.Data.DTO;
using System.Linq.Expressions;
using Backend.Data.Services;
using Microsoft.AspNetCore.Authorization;
using Microsoft.OpenApi.Validations.Rules;

namespace Backend.Controllers
{
      [Route("api/[controller]")]
      [ApiController]
      public class BowlingLeagueController : ControllerBase
      {
            private IBowlingLeagueRepository _bowlingLeagueRepository;
            private ITokenService _tokenService;
            public BowlingLeagueController(IBowlingLeagueRepository temp, ITokenService token)
            {
                  _bowlingLeagueRepository = temp;
                  _tokenService = token;
            }

            [HttpGet]
            [AllowAnonymous] // cho phep xem cong khai
            public IEnumerable<Bowler> Get()
            {
                  var bowlingLeagueData = _bowlingLeagueRepository.Bowlers
                  .Where((e) => e.IsDelete != true)
                  .OrderByDescending((e) => e.BowlerId)
                  .ToArray();

                  return bowlingLeagueData;
            }

            [HttpGet("{id}")]
            [AllowAnonymous]

            public ActionResult<Bowler> Get(int id)
            {
                  var bowler = _bowlingLeagueRepository.Bowlers
                      // Thêm .Include(b => b.Team) nếu bạn cần lấy thông tin Team
                      .FirstOrDefault(b => b.BowlerId == id);

                  if (bowler == null)
                  {
                        return NotFound();
                  }

                  return Ok(bowler);
            }


            [HttpPatch("{id}")]
            [Authorize]
            public IActionResult Patch(int id, [FromBody] BowlerPatchDto patchDto)
            {
                  var Data = _bowlingLeagueRepository.Bowlers
                  .FirstOrDefault((b) => b.BowlerId == id);

                  if (Data == null) { return NotFound(); }

                  if (patchDto.BowlerFirstName != null)
                  {
                        Data.BowlerFirstName = patchDto.BowlerFirstName;
                  }

                  if (patchDto.BowlerLastName != null)
                  {
                        Data.BowlerLastName = patchDto.BowlerLastName;
                  }

                  if (patchDto.BowlerAddress != null)
                  {
                        Data.BowlerAddress = patchDto.BowlerAddress;
                  }
                  if (patchDto.BowlerPhoneNumber != null)
                  {
                        Data.BowlerPhoneNumber = patchDto.BowlerPhoneNumber;
                  }


                  // 2. TÍCH HỢP LOGIC XÓA MỀM (Soft Delete)
                  // Kiểm tra xem client có gửi trường IsDeleted lên hay không
                  if (patchDto.IsDeleted.HasValue)
                  {
                        // Áp dụng giá trị được gửi lên (true để xóa, false để khôi phục)
                        Data.IsDelete = patchDto.IsDeleted.Value;
                  }

                  try
                  {
                        // Gọi phương thức Repository đã được triển khai
                        _bowlingLeagueRepository.UpdateBowler(Data);

                        return Ok(Data);
                  }
                  catch (Exception ex)
                  {
                        return NotFound(ex);
                  }
            }


            [HttpPost]
            [Authorize]
            public IActionResult Post([FromBody] BowlerPostDto newBowler)
            {
                  if (!ModelState.IsValid)
                  {
                        return BadRequest(ModelState);
                  }

                  try
                  {
                        var bowler = new Bowler
                        {
                              BowlerFirstName = newBowler.BowlerFirstName,
                              BowlerLastName = newBowler.BowlerLastName,
                              BowlerMiddleInit = newBowler.BowlerMiddleInit,
                              BowlerAddress = newBowler.BowlerAddress,
                              BowlerCity = newBowler.BowlerCity,
                              BowlerState = newBowler.BowlerState,
                              BowlerZip = newBowler.BowlerZip,
                              BowlerPhoneNumber = newBowler.BowlerPhoneNumber,
                              TeamId = newBowler.TeamId
                        };

                        _bowlingLeagueRepository.CreateBowler(bowler);

                        return CreatedAtAction(nameof(Get), new { id = bowler.BowlerId }, bowler);
                  }
                  catch (Exception e)
                  {
                        return StatusCode(500, $"Lỗi server: {e.Message}");
                  }
            }

            [HttpGet("teams")]
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

            [HttpPost("teams")]
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

            [HttpPatch("teams/{teamId}")]
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



            [HttpGet("teams/{teamId}/bowlers")]
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


            ///////////////////////////////////////////////////////////
            ///////////////////////////////////////////////////////////
            ///////////////////////////////////////////////////////////


            [HttpGet("tournaments")]
            [AllowAnonymous]
            public IActionResult GetTournaments()
            {
                  try
                  {
                        var tournaments = _bowlingLeagueRepository.Tournaments.Where(t => t.IsDelete != true).ToList();
                        if (tournaments == null || !tournaments.Any())
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

            [HttpPost("tournaments")]
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

            [HttpGet("tournaments/{tournamentId}")]
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

            [HttpPut("tournaments/{tournamentId}")]
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
                        if (tournamentMatches == null || !tournamentMatches.Any())
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


            [HttpPost("matches")]
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
                              EvenLaneTeamId = matchDto.EvenLaneTeamId
                        };

                        _bowlingLeagueRepository.CreateMatch(match);
                        return Ok(new { message = "Lên lịch trận đấu thành công!", matchId = match.MatchId });
                  }
                  catch (Exception ex)
                  {
                        return StatusCode(500, $"Lỗi server: {ex.Message}");
                  }
            }

            [HttpPut("matches/{id}")]
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

                        _bowlingLeagueRepository.Update(match);
                        return Ok(new { message = "Cập nhật trận đấu thành công!", matchId = match.MatchId });
                  }
                  catch (Exception ex)
                  {
                        return StatusCode(500, $"Lỗi server: {ex.Message}");
                  }
            }

            [HttpDelete("matches/{id}")]
            [Authorize(Roles = "Admin")]
            public IActionResult DeleteMatch(int id)
            {
                  try
                  {
                        _bowlingLeagueRepository.DeleteMatch(id);
                        return Ok(new { message = "Xóa trận đấu thành công!" });
                  }
                  catch (Exception ex)
                  {
                        return StatusCode(500, $"Lỗi server: {ex.Message}");
                  }
            }

            [HttpGet("matches")]
            [AllowAnonymous]
            public IActionResult GetMatches()
            {
                  try
                  {
                        var matches = _bowlingLeagueRepository.TourneyMatches.Select(m => new MatchListDto
                        {
                              MatchId = m.MatchId,
                              TourneyLocation = m.Tourney?.TourneyLocation,
                              TourneyDate = m.Tourney?.TourneyDate,
                              OddLaneTeam = m.OddLaneTeam?.TeamName,
                              EvenLaneTeam = m.EvenLaneTeam?.TeamName,
                              Lanes = m.Lanes,
                              TourneyId = m.TourneyId,
                              OddLaneTeamId = m.OddLaneTeamId,
                              EvenLaneTeamId = m.EvenLaneTeamId
                        }).ToList();

                        return Ok(matches);
                  }
                  catch (Exception ex)
                  {
                        return StatusCode(500, $"Internal Server Error: {ex.Message}");
                  }
            }

            [HttpGet("standings")]
            [AllowAnonymous]
            public IActionResult GetStandings()
            {
                  try
                  {
                        var teams = _bowlingLeagueRepository.Teams.ToList();
                        var standings = new List<StandingDto>();

                        var matchGames = _bowlingLeagueRepository.MatchGames.ToList();
                        var tourneyMatches = _bowlingLeagueRepository.TourneyMatches.ToList();

                        foreach (var team in teams)
                        {
                              // Played: Number of TourneyMatches where this team is Odd or Even
                              int played = tourneyMatches.Count(m => m.OddLaneTeamId == team.TeamId || m.EvenLaneTeamId == team.TeamId);

                              // Won: Number of MatchGames where WinningTeamId == TeamId
                              int won = matchGames.Count(mg => mg.WinningTeamId == team.TeamId);

                              standings.Add(new StandingDto
                              {
                                    TeamId = team.TeamId,
                                    TeamName = team.TeamName ?? "Unknown",
                                    Played = played,
                                    Won = won,
                                    Points = won * 2
                              });
                        }

                        return Ok(standings.OrderByDescending(s => s.Points).ThenByDescending(s => s.Won));
                  }
                  catch (Exception ex)
                  {
                        return StatusCode(500, $"Internal Server Error: {ex.Message}");
                  }
            }



            ///////////////////////////////////////////////////////////
            ///////////////////////////////////////////////////////////
            ///////////////////////////////////////////////////////////

            [HttpPost("login")]
            [AllowAnonymous]
            public IActionResult Login([FromBody] loginDto loginDto)
            {
                  // 1. Kiểm tra dữ liệu đầu vào cơ bản
                  if (string.IsNullOrEmpty(loginDto.Email) || string.IsNullOrEmpty(loginDto.Password))
                  {
                        return BadRequest(new { message = "Vui lòng nhập đầy đủ Email và Mật khẩu." });
                  }

                  try
                  {
                        var acc = _bowlingLeagueRepository.Accounts
                            .FirstOrDefault(e => e.Email.ToLower() == loginDto.Email.ToLower() && !e.IsDelete);

                        // 3. Kiểm tra tài khoản tồn tại và Mật khẩu (Sử dụng HASH)
                        if (acc == null)
                        {
                              return Unauthorized(new { message = "Email hoặc mật khẩu không đúng." });
                        }

                        // 4. KIỂM TRA MẬT KHẨU (SỬ DỤNG HASHING)
                        // ** SỬ DỤNG HASHING **
                        // if (!PasswordHasher.VerifyPasswordHash(loginDto.Password, acc.PasswordHash, acc.PasswordSalt)) 
                        // {
                        //     return Unauthorized(new { message = "Email hoặc mật khẩu không đúng." });
                        // }

                        if (acc.Password != loginDto.Password)
                        {
                              return Unauthorized(new { message = "Email hoặc mật khẩu không đúng." });
                        }

                        var userId = acc.Id;
                        var role = acc.Role;
                        var token = _tokenService.GenerateJwtToken(userId, role); // Sử dụng Id và Role của tài khoản

                        return Ok(new
                        {
                              message = "Đăng nhập thành công!",
                              userid = userId,
                              role = role,
                              token = token
                        });
                  }
                  catch (Exception ex)
                  {
                        return StatusCode(500, new { message = "Lỗi máy chủ (Server Error). Vui lòng thử lại sau.", ex });
                  }
            }

            // Lấy danh sách accounts (chỉ lấy những account chưa bị xóa mềm)
            [HttpGet("accounts")]
            [Authorize]
            public IActionResult GetAccounts()
            {
                  try
                  {
                        var acc = _bowlingLeagueRepository.Accounts
                            .Where(e => !e.IsDelete)
                            .OrderByDescending(e => e.Id)
                            .ToList();

                        return Ok(acc);
                  }
                  catch (Exception ex)
                  {
                        return StatusCode(500, new { message = "Lỗi server!", detail = ex.Message });
                  }
            }


            // Tạo mới account
            [HttpPost("accounts")]
            [AllowAnonymous]
            public IActionResult CreateAccount([FromBody] AccountsDto accountsDto)
            {
                  try
                  {
                        if (!ModelState.IsValid)
                        {
                              return BadRequest(ModelState);
                        }

                        var emailExists = _bowlingLeagueRepository.Accounts
                            .Any(a => !a.IsDelete && a.Email == accountsDto.Email);

                        if (emailExists)
                        {
                              return Conflict(new { status = 409, message = "Email đã tồn tại!" });
                        }

                        var account = new Accounts
                        {
                              Email = accountsDto.Email,
                              Password = accountsDto.Password,
                              Role = accountsDto.Role,
                              IsDelete = accountsDto.IsDelete
                        };

                        _bowlingLeagueRepository.CreateAcounts(account);

                        return Ok(new
                        {
                              status = 200,
                              message = "Đã thêm tài khoản thành công",
                              data = account
                        });
                  }
                  catch (Exception ex)
                  {
                        return StatusCode(500, new { message = "Lỗi server", detail = ex.Message });
                  }
            }


            // Cập nhật account
            [HttpPost("accounts/{id}")]
            [Authorize]
            public IActionResult UpdateAccount(int id, [FromBody] AccountsDto accountsDto)
            {
                  try
                  {
                        if (!ModelState.IsValid)
                        {
                              return BadRequest(ModelState);
                        }

                        var acc = _bowlingLeagueRepository.Accounts
                            .FirstOrDefault(e => e.Id == id);

                        if (acc == null)
                        {
                              return NotFound(new { status = 404, message = "Không tìm thấy tài khoản" });
                        }

                        if (!string.IsNullOrEmpty(accountsDto.Email))
                        {
                              var emailExists = _bowlingLeagueRepository.Accounts
                                  .Any(a => !a.IsDelete &&
                                            a.Email == accountsDto.Email &&
                                            a.Id != id);

                              if (emailExists)
                              {
                                    return BadRequest(new
                                    {
                                          status = 400,
                                          message = "Email đã tồn tại!"
                                    });
                              }

                              acc.Email = accountsDto.Email;
                        }

                        if (!string.IsNullOrEmpty(accountsDto.Password))
                        {
                              acc.Password = accountsDto.Password;
                        }

                        if (!string.IsNullOrEmpty(accountsDto.Role))
                        {
                              acc.Role = accountsDto.Role;
                        }

                        // Xóa mềm nếu gửi IsDelete = true
                        if (accountsDto.IsDelete == true)
                        {
                              acc.IsDelete = true;
                        }

                        _bowlingLeagueRepository.UpdateAccounts(acc);

                        return Ok(new
                        {
                              status = 200,
                              message = "Cập nhật tài khoản thành công",
                              data = acc
                        });
                  }
                  catch (Exception ex)
                  {
                        return StatusCode(500, new { message = "Lỗi server", detail = ex.Message });
                  }
            }


            // Lấy chi tiết 1 tài khoản
            [HttpGet("accounts/details/{id}")]
            [Authorize]
            public IActionResult GetAccountDetails(int id)
            {
                  try
                  {
                        var dataAcc = _bowlingLeagueRepository.Accounts
                            .Where(e => !e.IsDelete)
                            .FirstOrDefault(e => e.Id == id);

                        if (dataAcc == null)
                        {
                              return NotFound(new { status = 404, message = "Không tìm thấy tài khoản" });
                        }

                        return Ok(dataAcc);
                  }
                  catch (Exception ex)
                  {
                        return StatusCode(500, new { message = "Lỗi server", detail = ex.Message });
                  }
            }


            [HttpPost("Logout")]
            [AllowAnonymous] // Có thể để [Authorize] hoặc [AllowAnonymous] tùy thuộc vào thiết kế. Để [AllowAnonymous] cho đơn giản.
            public IActionResult Logout()
            {
                  return Ok(new { message = "Đăng xuất thành công!" });
            }

            [HttpGet("is-authenticated")]
            [Authorize]
            public IActionResult IsAuthenticated()
            {
                  // Lấy ID từ Claims (Payload của JWT)
                  var userIdClaim = User.FindFirst("Id");
                  var roleClaim = User.FindFirst(System.Security.Claims.ClaimTypes.Role);
                  return Ok(new
                  {
                        isAuthenticated = true,
                        userId = userIdClaim?.Value,
                        role = roleClaim?.Value
                  });
            }
      }
}
