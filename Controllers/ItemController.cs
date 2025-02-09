using FireboxGo.Models;
using FireboxGo.Services;
using Microsoft.AspNetCore.Mvc;

namespace FireboxGo.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class ItemController : ControllerBase
    {
        private DataService dataService;

        // Data service instantiation
        public ItemController(DataService dataService)
        {
            this.dataService = dataService;
        }

        // Get all items by user ID and by folder ID
        [HttpGet("{userID}/{folderID}")]
        public IActionResult FolderItems(int userID, int folderID)
        {
            return Ok(dataService.GetItemsService(userID, folderID));
        }

        // Create a new item by user ID
        [HttpPost("createItem/{userID}")]
        public IActionResult CreateItem(ItemModel newItem, int userID)
        {
            bool status = dataService.CreateItemService(newItem, userID);

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

        // Update a folder by user ID and that item's ID
        [HttpPut("updateItem/{userID}/{itemID}")]
        public IActionResult UpdateItem(ItemModel item, int userID, int itemID)
        {
            bool status = dataService.UpdateItemService(item, userID, itemID);

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

        // Delete a folder by that item's ID
        [HttpDelete("deleteItem/{itemID}")]
        public IActionResult DeleteItem(int itemID)
        {
            bool status = dataService.DeleteItemService(itemID);

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

        // Get total value of all items in a given folder
        [HttpGet("value/{folderID}")]
        public IActionResult GetRoomValue(int folderID)
        {
            return Ok(dataService.GetRoomValueService(folderID));
        }
    }
}
