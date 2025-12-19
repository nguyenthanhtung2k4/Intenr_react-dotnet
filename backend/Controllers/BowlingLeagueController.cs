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
                var DES = teams.OrderByDescending(t => t.TeamId).ToList();
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

            try
            {
                var team = new Team
                {
                    TeamName = newTeamDto.TeamName,
                    CaptainId = newTeamDto.CaptainId
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
        public IActionResult GetTournaments()
        {
            try
            {
                var tournaments = _bowlingLeagueRepository.tournaments
                if (tournaments == null || tournaments.Count == 0 && tournaments.IsDelete != true)
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
        public IActionResult PostTournament([FromBody] Tournament tournament)
        {
            try
            {
                data = _bowlingLeagueRepository.tournaments.Add(tournament);
                if(data == null)
                {
                    return BadRequest(ModelState);
                }
                return Ok(data);    
            }
            catch (Exception ex)
            {
                return StatusCode(500, $"Loi server khi tao turnament: {ex}");
            }
        }

        [HttpGet("tournaments/{tournamentId}")]
        public IActionResult GetTournamentById(int tournamentId)
        {
            try
            {
                var tournament = _bowlingLeagueRepository.tournaments
                if (tournament == null || tournament.IsDelete != true)
                {
                    return Ok(new Tournament());
                }
                return Ok(tournament);
            }
            catch (Exception ex)
            {
                return StatusCode(500, $"Loi server khi tai turnament: {ex}");
            }
        }   

        [HttpPut("tournaments/{tournamentId}")]
        public IActionResult PutTournament(int tournamentId, [FromBody] Tournament tournament)
        {
            try
            {
                var tournament = _bowlingLeagueRepository.tournaments
                if (tournament == null)
                {
                    return Ok(new Tournament());
                }   
                tournament.Update(tournament);
                return Ok(tournament);  
            }
            catch (Exception ex)
            {
                return StatusCode(500, $"Loi server khi tai turnament: {ex}");
            }
        }       

        [HttpGet("tourneymatch")]
        public IActionResult GetTourneyMatch()
        {
            try
            {
                var tournamentMatches = _bowlingLeagueRepository.TourneyMatch
                if (tournamentMatches == null || tournamentMatches.IsDelete != true)
                {
                    return Ok(new TourneyMatch());
                }
                return Ok(tournamentMatches);
            }
            catch (Exception ex)
            {
                return StatusCode(500, $"Loi server khi tai turnament matches: {ex}");
            }
        }

        



///////////////////////////////////////////////////////////
///////////////////////////////////////////////////////////
///////////////////////////////////////////////////////////

        [HttpPost("login")]
        [AllowAnonymous]
        public async Task<IActionResult> Login([FromBody] loginDto loginDto)
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
                var token = _tokenService.GenerateJwtToken(userId); // Sử dụng Id của tài khoản

                return Ok(new
                {
                    message = "Đăng nhập thành công!",
                    userid = userId,
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
        [Authorize]
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
            return Ok(new
            {
                isAuthenticated = true,
                userId = userIdClaim?.Value
            });
        }
    }
}
