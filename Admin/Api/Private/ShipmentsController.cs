using System;
using System.Collections.Generic;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using BLL.Services;
using BLL.DTO;
using Microsoft.AspNetCore.Authorization;

namespace Admin.Api.Private
{
    [Authorize]
    [Route("api/[controller]")]
    public class ShipmentsController : Controller
    {
        private readonly IShipmentsService _service;

        public ShipmentsController(IShipmentsService service)
        {
            _service = service;
        }

        [HttpGet]
        public IActionResult Get() => Ok(_service.Get());

        [HttpGet("{id}")]
        public ShipmentDto Get([FromRoute] string id) => _service.Get(id);

        [HttpGet("create/{orderId}")]
        public IActionResult Create([FromRoute] string orderId)
        {
            var model =  _service.Create(orderId);
            return Created($"api/shipments/{model.Id}", model);
        }

        [HttpGet("accept/{id}")]
        public async Task<IActionResult> Accept([FromRoute] string id)
        {
            var model = await _service.GetConducted(id);
            return Created($"api/shipments/{model.Id}", model);
        }


        [HttpPut("{id}")]
        public IActionResult Put(string id, [FromBody] ShipmentDto value)
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