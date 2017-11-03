using BLL.DTO;
using BLL.Services;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace Api.Private
{
    [Authorize]
    [Route("api/[controller]")]
    public class StoragesController : Controller
    {
        private readonly IStoragesService _service;

        public StoragesController(IStoragesService service)
        {
            _service = service;
        }

        [HttpGet]
        public IActionResult Get() => Ok(_service.Get());

        [HttpGet("{id}")]
        public StorageDto Get([FromRoute] string id) => _service.Get(id);

        [HttpPost]
        public IActionResult Post([FromBody] StorageDto value)
        {
            _service.Post(value);
            return Ok();
        }
        

        [HttpPut("{id}")]
        public IActionResult Put(string id, [FromBody] StorageDto value)
        {
            _service.Put(id, value);
            return Ok();
        }

        [HttpDelete("{id}")]
        public IActionResult Delete(string id)
        {
            _service.Delete(id);
            return Ok();
        }
    }
}