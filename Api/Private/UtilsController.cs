using System;
using BLL.Services;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace Api.Private
{
    [Authorize]
    [Route("api/[controller]")]
    public class UtilsController : Controller
    {
        private readonly IUtilsService _service;

        public UtilsController(IUtilsService service)
        {
            _service = service;
        }

        [HttpGet("newGuid")]
        public Guid Get() => _service.GetGuid();
    }
}