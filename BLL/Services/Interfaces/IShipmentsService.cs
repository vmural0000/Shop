using System.Collections.Generic;
using System.Threading.Tasks;
using BLL.DTO;

namespace BLL.Services
{
    public interface IShipmentsService
    {
        IEnumerable<ShipmentDto> Get();
        ShipmentDto Get(string id);
        ShipmentDto Create(string orderId);
        Task<ShipmentDto> GetConducted(string id);
        void Put(string id, ShipmentDto dto);
        bool Delete(string id);
    }
}