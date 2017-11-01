using Microsoft.AspNetCore.Mvc;
using BLL.Services;
using Microsoft.AspNetCore.Authorization;

namespace Api.Api.Private
{
    [Authorize]
    [Produces("application/json")]
    [Route("api/[controller]")]
    public class DashboardController : Controller
    {
        private readonly IDashboardService _service;
        public DashboardController(IDashboardService service)
        {
            _service = service;
        }

        [HttpGet]
        public IActionResult GetDashboard() => Ok();
    }
}