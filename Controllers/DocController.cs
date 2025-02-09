using FireboxGo.Models;
using FireboxGo.Services;
using Microsoft.AspNetCore.Mvc;

namespace FireboxGo.Controllers
{
    // To be expanded in future sprints

    [Route("api/[controller]")]
    [ApiController]
    public class DocController : ControllerBase
    {
        private DataService dataService;

        public DocController(DataService dataService)
        {
            this.dataService = dataService;
        }
    }
}
