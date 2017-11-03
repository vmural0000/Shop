using System;
using System.Collections.Generic;
using System.Threading.Tasks;
using BLL.DTO;
using BLL.Services.Public;
using Microsoft.AspNetCore.Mvc;
using Workers.Messaging;

namespace Api.Public
{
    [Produces("application/json")]
    [Route("api/public/products")]
    public class ProductsController : Controller
    {
        private readonly IProductsService _service;

        public ProductsController(IProductsService service)
        {
            _service = service;
        }

        [Produces(typeof(IEnumerable<ProductListDto>))]
        [HttpGet]
        public IActionResult Get()
        {
            return Ok(_service.Get());
        }

        [Produces(typeof(IEnumerable<ProductListDto>))]
        [HttpGet("getlatest")]
        public IActionResult GetLatestProducts() => Ok(_service.GetLatestProducts());

        [Produces(typeof(IEnumerable<ProductListDto>))]
        [HttpGet("getpopular")]
        public IActionResult GetPopularProducts() => Ok(_service.GetPopularProducts());

        [Produces(typeof(ProductListDto))]
        [HttpGet("getoffer")]
        public IActionResult GetOfferProduct() => Ok(_service.GetOfferProduct());

        [HttpGet("{page:int}/{pageSize:int}")]
        [Produces(typeof(IEnumerable<ProductListDto>))]
        public async Task<IActionResult> Get(int page, int pageSize)
        {
            var model = await _service.GetAsync(page, pageSize);
            Response.Headers.Add("x-total-count", model.Item1.ToString());
            return Ok(model.Item2);
        }

        [Produces(typeof(ProductDetailsDto))]
        [HttpGet("{article}")]
        public IActionResult Get([FromRoute] string article) => Ok(_service.Get(article));

        [Produces(typeof(IEnumerable<ProductDetailsDto>))]
        [HttpGet("category/{id}/{page:int}/{pageSize:int}")]
        public async Task<IActionResult> GetByCategoryAsync([FromRoute] string id, int page, int pageSize)
        {
            var model = await _service.GetByCategory(id, page, pageSize);
            Response.Headers.Add("x-total-count", model.Item1.ToString());
            return Ok(model.Item2);
        }
    }
}
