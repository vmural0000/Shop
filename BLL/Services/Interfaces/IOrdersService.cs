using System.Collections.Generic;
using System.Threading.Tasks;
using BLL.DTO;
using Microsoft.AspNetCore.JsonPatch;

namespace BLL.Services
{
    public interface IOrdersService
    {
        Task<IEnumerable<OrderListDto>> GetOrdersAsync();
        Task<OrderEditDto> GetOrderAsync(string id);
        Task<OrderEditDto> PostOrderAsync(OrderEditDto model);
        Task<OrderEditDto> PostOrderFromSite(OrderEditDto model);
        Task<OrderEditDto> PutOrderAsync(string id, OrderEditDto model);
        Task<OrderEditDto> PatchOrderAsync(string id, JsonPatchDocument<OrderEditDto> model);
        Task<OrderEditDto> AcceptAsync(string id);
        Task DeleteAsync(string id);
    }
}