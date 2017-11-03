using System.Collections.Generic;
using BLL.DTO;
using BLL.Services;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace Api.Private
{
    [Authorize]
    [Route("api/[controller]")]
    public class ActivityLogController : Controller
    {
        private readonly IActivityLogService _service;

        public ActivityLogController(IActivityLogService service)
        {
            _service = service;
        }

        [HttpGet]
        public IActionResult Get() => Ok(_service.Get());

        [HttpGet("{id}")]
        public IEnumerable<ActivityLogDto> Get([FromRoute] string id) => _service.Get(id);
    }
}