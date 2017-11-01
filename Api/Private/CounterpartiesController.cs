using System.Collections.Generic;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using BLL.DTO;
using BLL.Services;
using DAL.Models;
using Microsoft.AspNetCore.Authorization;

namespace Api.Api.Private
{
    [Authorize]
    [Route("api/[controller]")]
    public class CounterpartiesController : Controller
    {
        private readonly ICounterpartiesService _service;

        public CounterpartiesController(ICounterpartiesService service)
        {
            _service = service;
        }

        [HttpGet]
        public async Task<IActionResult> Get() => Ok(await _service.Get());

        [HttpGet("{id}")]
        public CounterpartyDto Get([FromRoute]string id) => _service.Get(id);

        [HttpGet("phoneNumber/{phoneNumber}")]
        public IEnumerable<CounterpartyDto> GetFromPhoneNumber([FromRoute]string phoneNumber) => _service.GetFromPhoneNumber(phoneNumber);

        [HttpGet("name/{name}")]
        public IEnumerable<string> GetFromName([FromRoute]string name) => _service.GetFromName(name);

        [HttpGet("city/{city}")]
        public Task<IEnumerable<Settlement>> GetCities([FromRoute]string city) => _service.GetCities(city);

        [HttpGet("city/{city}/warehouses")]
        public Task<IEnumerable<Warehouse>> GetWarehouses([FromRoute]string city) => _service.GetWarehouses(city);

        [HttpPost]
        public IActionResult Post([FromBody]CounterpartyDto value)
        {
            _service.Post(value);
            return Ok();
        }

        [HttpPut("{id}")]
        public IActionResult Put(string id, [FromBody]CounterpartyDto value)
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
