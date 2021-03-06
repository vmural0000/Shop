using System.Threading.Tasks;
using BLL.Helpers;
using BLL.Services;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Logging;

namespace Api.Public
{
    //[Produces("application/json")]
    [Route("api/public/orders")]
    public class OrdersController : Controller
    {
        private readonly IOrdersService _orders;
        private readonly ILogger _logger;
        public OrdersController(IOrdersService orders, ILoggerFactory loggerFactory)
        {
            _orders = orders;
            _logger = loggerFactory.CreateLogger<OrdersController>();
        }

        [HttpPost]
        public async Task<IActionResult> PostOrderFromSiteAsync([FromBody]Model model)
        {
            _logger.LogError(Utilities.ModelToJson(model));

            //var order = new Order()
            //{
                
            //};
            //await _orders.PostOrderFromSite(model);

            return Ok();
            //_logger.LogError(Utilities.ModelToJson(model));
            //if (!ModelState.IsValid)
            //{
            //    return BadRequest(ModelState);
            //}
            //return Ok(await _orders.PostOrderFromSite(model));
        }
    }

    public class Model
    {
        public string Name { get; set; }
        public string Phone { get; set; }
    }
}