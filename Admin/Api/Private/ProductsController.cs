using System;
using System.Collections.Generic;
using System.Diagnostics;
using System.Text;
using System.Threading;
using System.Threading.Tasks;
using BLL.DTO;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Authorization;
using BLL.Policies;
using Microsoft.AspNetCore.JsonPatch;
using BLL.Services;
using Microsoft.AspNetCore.Http;

namespace Admin.Api.Private
{
    [Authorize]
    [Produces("application/json")]
    [Route("api/[controller]")]
    public class ProductsController : Controller
    {
        private readonly IProductsService _service;

        public ProductsController(IProductsService service)
        {
            _service = service;
        }

        [Authorize(AuthPolicies.CanReadProductPolicy)]
        [Produces(typeof(IEnumerable<ProductListDto>))]
        [HttpGet]
        public IActionResult Get() => Ok(_service.Get());


        [HttpGet("page/{page}:int/{limit}:int")]
        [Authorize(AuthPolicies.CanReadProductPolicy)]
        [Produces(typeof(IEnumerable<ProductListDto>))]
        public async Task<IActionResult> Get([FromRoute]int page, [FromRoute]int limit)
        {
            var model = await _service.GetAsync(page, limit);
            Response.Headers.Add("x-total-count", model.Item1.ToString());
            return Ok(model.Item2);
        }


        [Authorize(AuthPolicies.CanReadProductPolicy)]
        [Produces(typeof(ProductDetailsDto))]
        [HttpGet("{id}")]
        public IActionResult Get([FromRoute] string id) => Ok(_service.Get(id));


        //[Authorize(AuthPolicies.CanReadProductPolicy)]
        //[Produces(typeof(IEnumerable<ProductDetailsDto>))]
        //[HttpGet("category/{id}")]
        //public IActionResult GetByCategory([FromRoute] string id) => Ok(_service.GetByCategory(id));


        [Authorize(AuthPolicies.CanReadProductPolicy)]
        [Produces(typeof(ProductDetailsDto))]
        [HttpGet("barcode/{article}")]
        public IActionResult GetProductByArtcile([FromRoute] string article) => Ok(_service.GetProductByArticle(article));


        [Authorize(AuthPolicies.CanCreateProductPolicy)]
        [Produces(typeof(ProductDetailsDto))]
        [HttpPost]
        public IActionResult Post([FromBody] ProductEditDto product)
        {
            var model = _service.Post(product);
            return Created($"api/product/{product.Id}", model);
        }


        [Authorize(AuthPolicies.CanUpdateProductPolicy)]
        [Produces(typeof(ProductEditDto))]
        [HttpPatch("{id}")]
        public IActionResult Patch([FromRoute] string id, [FromBody] JsonPatchDocument<ProductEditDto> product)
        {
            //_context.Patch(id, product);
            return Accepted();
        }


        [Authorize(AuthPolicies.CanUpdateProductPolicy)]
        [HttpPut("{id}")]
        public IActionResult Put([FromRoute] string id, [FromBody] ProductEditDto product)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }
            _service.Put(id, product);

            return Accepted();
        }


        [Authorize(AuthPolicies.CanDeleteProductPolicy)]
        [HttpDelete("{id}")]
        public IActionResult Delete([FromRoute] string id)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }
            _service.Delete(id);
            return NoContent();
        }


        [Authorize(AuthPolicies.CanUpdateProductPolicy)]
        [HttpGet("exportToJson")]
        public IActionResult ExportToJson(string id = null)
        {
            HttpContext.Response.ContentType = "application/pdf";
            var s = _service.ExportToJson(id);
            var str = Encoding.UTF8.GetBytes(s);
            FileContentResult result = new FileContentResult(str, "application/pdf")
            {
                FileDownloadName = $"export_Products_{Guid.NewGuid()}.json"
            };

            return result;
        }


        [Authorize(AuthPolicies.CanUpdateProductPolicy)]
        [HttpPost("import")]
        public IActionResult ImportFromJson(IFormCollection file)
        {
            _service.ImportFromJson(file);
            return Ok();
        }


        [Authorize(AuthPolicies.CanUpdateProductPolicy)]
        [Authorize(AuthPolicies.CanCreateProductPolicy)]
        [HttpPost("image/{id}")]
        public IActionResult Upload([FromRoute] string id, IFormCollection files)
        {
            _service.Upload(id, files);
            return Ok();
        }

        [Authorize(AuthPolicies.CanUpdateProductPolicy)]
        [Authorize(AuthPolicies.CanCreateProductPolicy)]
        [HttpDelete("image/{id}/{name}")]
        public IActionResult DeleteImage([FromRoute] string id, [FromRoute] string name)
        {
            _service.DeleteImage(id, name);
            return Ok();
        }
    }
}
