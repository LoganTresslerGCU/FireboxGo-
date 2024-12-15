using FireboxGo.Models;
using FireboxGo.Services;
using Microsoft.AspNetCore.Mvc;

namespace FireboxGo.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class DocController : ControllerBase
    {
        private DataService dataService;

        public DocController(DataService dataService)
        {
            this.dataService = dataService;
        }

        [HttpGet("user/{userID}/docs")]
        public List<DocModel> GetDocs(int userID)
        {
            return dataService.GetDocsService(userID);
        }

        [HttpGet("user/{userID}/docs/docSearch/{search}")]
        public IActionResult SearchDocs(DocModel docModel)
        {
            bool status = dataService.SearchDocsService(docModel);

            if (status)
            {
                return Ok();
            }
            else
            {
                return BadRequest();
            }
        }

        [HttpPost("createDoc")]
        public IActionResult CreateDoc(DocModel docModel)
        {
            bool status = dataService.CreateDocService(docModel);

            if (status)
            {
                return Ok();
            }
            else
            {
                return BadRequest();
            }
        }

        [HttpDelete("user/{userID}/docs/{docID}")]
        public IActionResult DeleteDoc(DocModel docModel)
        {
            bool status = dataService.DeleteDocService(docModel);

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
