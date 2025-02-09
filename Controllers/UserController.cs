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

        // Data service instantiation
        public UserController(DataService dataService)
        {
            this.dataService = dataService;
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
                return Ok();
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
    }
}
