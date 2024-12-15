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

        public ItemController(DataService dataService)
        {
            this.dataService = dataService;
        }

        [HttpGet("user/{userID}/folders/{folderID}/item")]
        public IActionResult GetItems(ItemModel itemModel)
        {
            bool status = dataService.GetItemsService(itemModel);

            if (status)
            {
                return Ok();
            }
            else
            {
                return BadRequest();
            }
        }

        [HttpGet("user/{userID}/folders/{folderID}/item/itemSearch/{search}")]
        public IActionResult SearchItem(ItemModel itemModel)
        {
            bool status = dataService.SearchItemsService(itemModel);

            if (status)
            {
                return Ok();
            }
            else
            {
                return BadRequest();
            }
        }

        [HttpPost("createItem")]
        public IActionResult CreateItem(ItemModel itemModel)
        {
            bool status = dataService.CreateItemService(itemModel);

            if (status)
            {
                return Ok();
            }
            else
            {
                return BadRequest();
            }
        }

        [HttpPut("updateItem")]
        public IActionResult UpdateItem(ItemModel itemModel)
        {
            bool status = dataService.UpdateItemService(itemModel);

            if (status)
            {
                return Ok();
            }
            else
            {
                return BadRequest();
            }
        }

        [HttpDelete("user/{userID}/folders/{folderID}/items/{itemID}")]
        public IActionResult DeleteItem(ItemModel itemModel)
        {
            bool status = dataService.DeleteItemService(itemModel);

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
