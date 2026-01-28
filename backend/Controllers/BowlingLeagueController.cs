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
      public class BowlingLeagueController(IBowlingLeagueRepository temp, ITokenService token) : ControllerBase
      {
            private readonly IBowlingLeagueRepository _bowlingLeagueRepository = temp;
            private readonly ITokenService _tokenService = token;

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
                 if (patchDto.IsDeleted.HasValue)
                  {
                        Data.IsDelete = patchDto.IsDeleted.Value;
                        Data.DeletedAt = DateTime.Now;

                        var userEmail = User.FindFirst(System.Security.Claims.ClaimTypes.Email)?.Value;
                        Data.DeletedBy = userEmail;
                  }


                  try
                  {
                        Data.UpdatedAt = DateTime.Now;
                        Data.UpdatedBy = User.FindFirst(System.Security.Claims.ClaimTypes.Email)?.Value;
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
                              TeamId = newBowler.TeamId,
                              CreatedAt = DateTime.Now,
                              CreatedBy = User.FindFirst(System.Security.Claims.ClaimTypes.Email)?.Value
                        };

                        _bowlingLeagueRepository.CreateBowler(bowler);

                        return CreatedAtAction(nameof(Get), new { id = bowler.BowlerId }, bowler);
                  }
                  catch (Exception e)
                  {
                        return StatusCode(500, $"Lỗi server: {e.Message}");
                  }
            }

            [HttpPost("login")]
            [AllowAnonymous]
            public IActionResult Login([FromBody] loginDto loginDto)
            {
                  if (string.IsNullOrEmpty(loginDto.Email) || string.IsNullOrEmpty(loginDto.Password))
                  {
                        return BadRequest(new { message = "Vui lòng nhập đầy đủ Email và Mật khẩu." });
                  }
                  try
                  {
                        var acc = _bowlingLeagueRepository.Accounts
                            .FirstOrDefault(e => string.Equals(e.Email, loginDto.Email, StringComparison.OrdinalIgnoreCase)
                                                 && !e.IsDelete);
                        if (acc == null)
                        {
                              return Unauthorized(new { message = "Email hoặc mật khẩu không đúng." });
                        }
                        if (acc.Password != loginDto.Password)
                        {
                              return Unauthorized(new { message = "Email hoặc mật khẩu không đúng." });
                        }

                        var userId = acc.Id;
                        var role = acc.Role;
                        var token = _tokenService.GenerateJwtToken(userId, role, acc.Email);

                        return Ok(new
                        {
                              message = "Đăng nhập thành công!",
                              userid = userId,
                              role,
                              token
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
                              IsDelete = accountsDto.IsDelete,
                              CreatedAt = DateTime.Now,
                              CreatedBy = User.FindFirst(System.Security.Claims.ClaimTypes.Email)?.Value
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
                              acc.DeletedAt = DateTime.Now;
                              acc.DeletedBy = User.FindFirst(System.Security.Claims.ClaimTypes.Email)?.Value;
                        }
                        else
                        {
                              acc.UpdatedAt = DateTime.Now;
                              acc.UpdatedBy = User.FindFirst(System.Security.Claims.ClaimTypes.Email)?.Value;
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


            ///////////////////////////////////////////////////////////
            // BOWLER STATS & MATCH SCORES ENDPOINTS
            ///////////////////////////////////////////////////////////

            [HttpGet("bowler-stats")]
            [AllowAnonymous]
            public IActionResult GetBowlerStats()
            {
                  try
                  {
                        var bowlers = _bowlingLeagueRepository.Bowlers
                              .Where(b => b.IsDelete != true)
                              .ToList();
                        var scores = _bowlingLeagueRepository.Scores.ToList();
                        var teams = _bowlingLeagueRepository.Teams.ToList();

                        var stats = bowlers.Select(b =>
                        {
                              var bowlerScores = scores.Where(s => s.BowlerId == b.BowlerId).ToList();
                              var team = teams.FirstOrDefault(t => t.TeamId == b.TeamId);

                              int totalGames = bowlerScores.Count;
                              int totalPins = bowlerScores.Sum(s => s.RawScore ?? 0);
                              int highScore = bowlerScores.Count > 0 ? bowlerScores.Max(s => s.RawScore ?? 0) : 0;
                              double avgScore = totalGames > 0 ? (double)totalPins / totalGames : 0;
                              int gamesWon = bowlerScores.Count(s => s.WonGame);

                              return new BowlerStatsDto
                              {
                                    BowlerId = b.BowlerId,
                                    BowlerName = $"{b.BowlerFirstName} {b.BowlerLastName}",
                                    TeamId = b.TeamId,
                                    TeamName = team?.TeamName,
                                    TotalGames = totalGames,
                                    AverageScore = Math.Round(avgScore, 1),
                                    HighScore = highScore,
                                    TotalPins = totalPins,
                                    GamesWon = gamesWon
                              };
                        }).OrderByDescending(s => s.AverageScore).ToList();

                        return Ok(stats);
                  }
                  catch (Exception ex)
                  {
                        return StatusCode(500, $"Lỗi server: {ex.Message}");
                  }
            }
      }
}
