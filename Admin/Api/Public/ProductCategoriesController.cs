using Microsoft.AspNetCore.Mvc;
using BLL.Services;

namespace Admin.Api.Public
{
    [Produces("application/json")]
    [Route("api/public/categories")]
    public class ProductCategoriesController : Controller
    {
        private readonly IProductCategoriesService _context;
        public ProductCategoriesController(IProductCategoriesService unitOfWork)
        {
            _context = unitOfWork;
        }

        [HttpGet]
        public IActionResult Get() => Ok(_context.Get());

        [HttpGet("list")]
        public IActionResult GetList() => Ok(_context.GetList());

        [HttpGet("{id}")]
        public IActionResult Get([FromRoute] string id)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            return Ok(_context.Get(id));
        }
    }
}