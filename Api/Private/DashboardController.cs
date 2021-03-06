using BLL.Services;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace Api.Private
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