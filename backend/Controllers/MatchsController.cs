using Backend.Data;
using Microsoft.AspNetCore.Mvc;

namespace Backend.Controllers
{
    [Route("api/[controler]")]
    [ApiController]
    public class MatchsController : Controller
    {
        private IBowlingLeagueRepository _bowling;

        public MatchsController(IBowlingLeagueRepository _temp)
        {
            _bowling = _temp;
        }

        // GET: Chi  các trânh  đấu
        [HttpGet("tournaments")]
        public ActionResult Tournament()
        {
            return View();
        }

        // GET: Chi các giải đấu 
        [HttpGet("matchs")]
        public ActionResult matchs()
        {
            return View();
        }

        // GET: Chi các Điểm
        [HttpGet("Score")]
        public ActionResult  Score()
        {
            return View();
        }
        
        // GET: Chi các trận đấu và giải đấu  và  điểm cầu thủ 
        [HttpGet("game")]
        public ActionResult game()
        {
            return View();
        }
    }
}
