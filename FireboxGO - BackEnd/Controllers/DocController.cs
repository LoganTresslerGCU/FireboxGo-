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

        // Data service instantiation
        public DocController(DataService dataService)
        {
            this.dataService = dataService;
        }

        // Get all files by user ID
        [HttpGet("{userID}")]
        public IActionResult Files(int userID)
        {
            return Ok(dataService.GetFilesService(userID));
        }

        // Upload a file by user ID
        [HttpPost("upload/{userID}")]
        public IActionResult UploadFile(DocModel newDoc, int userID)
        {
            bool status = dataService.UploadFileService(newDoc, userID);

            // if-else Upload was successful, pass user ID back
            if (status)
            {
                return Ok(userID);
            }
            else
            {
                return BadRequest();
            }
        }

        // Delete a file by that file's ID
        [HttpDelete("deleteDoc/{docID}")]
        public IActionResult DeleteFile(int docID)
        {
            return Ok(dataService.DeleteFileService(docID));
        }
    }
}
