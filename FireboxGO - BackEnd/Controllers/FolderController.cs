using FireboxGo.Models;
using FireboxGo.Services;
using System.Text.Json;
using Microsoft.AspNetCore.Mvc;

namespace FireboxGo.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class FolderController : ControllerBase
    {
        private DataService dataService;

        // Data service instantiation
        public FolderController(DataService dataService)
        {
            this.dataService = dataService;
        }

        // Get all folders by user ID
        [HttpGet("home/{userID}")]
        public IActionResult FolderHome(int userID)
        {
            return Ok(dataService.GetFoldersService(userID));
        }

        // Create a new folder by user ID
        [HttpPost("createFolder/{userID}")]
        public IActionResult CreateFolder(FolderModel newFolder, int userID)
        {
            bool status = dataService.CreateFolderService(newFolder, userID);

            // if-else Creation was successful, pass user ID back
            if (status)
            {
                return Ok(userID);
            }
            else
            {
                return BadRequest();
            }
        }

        // Update a folder by user ID and that folder's ID
        [HttpPut("updateFolder/{userID}/{folderID}")]
        public IActionResult UpdateFolder(FolderModel folder, int userID, int folderID)
        {
            bool status = dataService.UpdateFolderService(folder, userID, folderID);

            // if-else Updating was successful, pass user ID back
            if (status)
            {
                return Ok(userID);
            }
            else
            {
                return BadRequest();
            }
        }

        // Delete a folder by that folder's ID
        [HttpDelete("deleteFolder/{folderID}")]
        public IActionResult DeleteFolder(int folderID)
        {
            bool status = dataService.DeleteFolderService(folderID);

            // if-else Deleting was successful
            if (status)
            {
                return Ok();
            }
            else
            {
                return BadRequest();
            }
        }

        // Get all tags
        [HttpGet("tags")]
        public IActionResult GetTags()
        {
            return Ok(dataService.GetTagsService());
        }
    }
}