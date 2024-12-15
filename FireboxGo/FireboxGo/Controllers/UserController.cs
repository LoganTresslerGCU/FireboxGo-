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

        public UserController(DataService dataService)
        {
            this.dataService = dataService;
        }

        [HttpPost("login")]
        public IActionResult Login(UserModel userModel)
        {
            bool status = dataService.LoginService(userModel);

            if (status)
            {
                return Ok();
            }
            else
            {
                return BadRequest();
            }
        }

        [HttpPost("register")]
        public IActionResult Register(UserModel userModel)
        {
            bool status = dataService.RegisterService(userModel);

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
