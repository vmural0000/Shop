using BLL.DTO;
using BLL.DTO.ProductCategory;
using BLL.Services;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace Api.Private
{
    [Authorize]
    [Produces("application/json")]
    [Route("api/[controller]")]
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

        [HttpPut("{id}")]
        public IActionResult Put([FromRoute] string id, [FromBody] EditProductCategoryDto productCategory)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            _context.Put(id, productCategory);

            return NoContent();
        }

        [HttpPost]
        public IActionResult Post([FromBody] CreateProductCategoryDto productCategory)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            return Ok(_context.Post(productCategory));
        }

        [HttpDelete("{id}")]
        public IActionResult Delete([FromRoute] string id)
        {
            var result = _context.Delete(id);
            if (result == false)
            {
                return BadRequest();
            }
            return Ok();
        }
    }
}