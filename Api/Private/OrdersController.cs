using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using BLL.Services;
using Microsoft.AspNetCore.Authorization;
using BLL.DTO;
using BLL.Policies;
using Microsoft.AspNetCore.JsonPatch;

namespace Api.Api.Private
{
    [Authorize]
    [Produces("application/json")]
    [Route("api/[controller]")]
    public class OrdersController : Controller
    {
        private readonly IOrdersService _orders;

        public OrdersController(IOrdersService orders)
        {
            _orders = orders;
        }

        [HttpGet, Authorize(AuthPolicies.CanReadOrderPolicy)]
        public async Task<IActionResult> GetOrders() => Ok(await _orders.GetOrdersAsync());

        [HttpGet("{id}"), Authorize(AuthPolicies.CanReadOrderPolicy)]
        public async Task<IActionResult> GetOrder([FromRoute] string id) => Ok(await _orders.GetOrderAsync(id));


        [HttpPost("accept"), Authorize(AuthPolicies.CanUpdateOrderPolicy)]
        public async Task<IActionResult> Accept([FromBody]string id) => Ok(await _orders.AcceptAsync(id));

        [HttpPost, Authorize(AuthPolicies.CanCreateOrderPolicy)]
        public async Task<IActionResult> PostOrderAsync([FromBody]OrderEditDto model)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }
            return Ok(await _orders.PostOrderAsync(model));
        }

        [HttpPut("{id}"), Authorize(AuthPolicies.CanUpdateOrderPolicy)]
        public async Task<IActionResult> PutOrderAsync([FromRoute]string id, [FromBody]OrderEditDto model)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            var order = await _orders.PutOrderAsync(id, model);

            if (order == null)
            {
                return BadRequest(ModelState);
            }

            return Ok(order);
        }

        [HttpPatch("{id}"), Authorize(AuthPolicies.CanUpdateOrderPolicy)]
        public async Task<IActionResult> PatchAsync([FromRoute] string id, [FromBody] JsonPatchDocument<OrderEditDto> model)
        {
            if (model == null)
                return NotFound();

            await _orders.PatchOrderAsync(id, model);
            return Accepted();
        }

        [HttpDelete("{id}"), Authorize(AuthPolicies.CanDeleteOrderPolicy)]
        public async Task<IActionResult> DeleteAsync([FromRoute] string id)
        {
            await _orders.DeleteAsync(id);
            return Ok();
        }
    }
}