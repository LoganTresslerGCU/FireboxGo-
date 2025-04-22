using FireboxGo.Models;
using FireboxGo.Services;
using Microsoft.AspNetCore.Mvc;

namespace FireboxGo.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class UserController : ControllerBase
    {
        private DataService dataService;
        private RecoveryService recoveryService;

        // Data service instantiation
        public UserController(DataService dataService, RecoveryService recoveryService)
        {
            this.dataService = dataService;
            this.recoveryService = recoveryService;
        }

        // Process user login
        [HttpPost("login")]
        public IActionResult Login(UserModel userModel)
        {
            int status = dataService.LoginService(userModel);

            // Status 1 is a successful login
            if (status == 1)
            {
                int user = dataService.GetUserIDService(userModel);
                return Ok(user);
            }
            // Status -1 is a unsuccessful login due to password being incorrect
            else if (status == -1)
            {
                return BadRequest(-1);
            }
            // Status -2 is a unsuccessful login due to username being incorrect
            else if (status == -2)
            {
                return BadRequest(-2);
            }
            // Status -3 or otherwise is a server error
            else
            {
                return BadRequest(-3);
            }
        }

        // Process user registration
        [HttpPost("register")]
        public IActionResult Register(UserModel userModel)
        {
            int status = dataService.RegisterService(userModel);

            // Status 1 is a successful register
            if (status == 1)
            {
                int user = dataService.GetUserIDService(userModel);
                return Ok(user);
            }
            // Status -1 is a unsuccessful register due to username being in use
            else if (status == -1)
            {
                return BadRequest(-1);
            }
            // Status -2 is a unsuccessful register due to email being in use
            else if (status == -2)
            {
                return BadRequest(-2);
            }
            // Status -3 is a unsuccessful register due to both username and email being in use
            else if (status == -3)
            {
                return BadRequest(-3);
            }
            // Status -4 or otherwise is a server error
            else
            {
                return BadRequest(-4);
            }
        }

        // Get account information by user ID
        [HttpGet("info/{userID}")]
        public IActionResult AccountInfo(int userID)
        {
            return Ok(dataService.GetAccountInfoService(userID));
        }

        // Get household prices by user ID
        [HttpGet("totals/{userID}")]
        public IActionResult HouseholdTotals(int userID)
        {
            return Ok(dataService.GetHouseholdTotalsService(userID));
        }

        // Get results by name by search string
        [HttpGet("searchName/{search}/{userID}")]
        public IActionResult NameSearchAll(string search, int userID)
        {
            return Ok(dataService.NameSearchAllService(search, userID));
        }

        // Get results by tag by search string
        [HttpGet("searchTags/{search}/{userID}")]
        public IActionResult TagSearchAll(string search, int userID)
        {
            return Ok(dataService.TagSearchAllService(search, userID));
        }

        // Process sending recovery code
        [HttpPost("sendCode/{recipientEmail}")]
        public async Task<IActionResult> CodeGenerate(string recipientEmail)
        {
            var code = await recoveryService.SendCodeAsync(recipientEmail);
            return Ok(code);
        }

        // Update a password by username
        [HttpPut("updatePW")]
        public IActionResult UpdatePW(UserModel user)
        {
            bool status = dataService.UpdatePWService(user);

            // if-else Updating was successful, pass user ID back
            if (status)
            {
                return Ok();
            }
            else
            {
                return BadRequest();
            }
        }
    }
}
