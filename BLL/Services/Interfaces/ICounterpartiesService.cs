using System.Collections.Generic;
using System.Threading.Tasks;
using BLL.DTO;
using DAL.Models;

namespace BLL.Services
{
    public interface ICounterpartiesService
    {
        Task<IEnumerable<CounterpartyDto>> Get();
        CounterpartyDto Get(string id);
        IEnumerable<CounterpartyDto> GetFromPhoneNumber(string phoneNumber);
        IEnumerable<string> GetFromName(string name);
        Task<IEnumerable<Settlement>> GetCities(string city);
        Task<IEnumerable<Warehouse>> GetWarehouses(string city);
        CounterpartyDto Post(CounterpartyDto dto);
        void Put(string id, CounterpartyDto dto);
        bool Delete(string id);
    }
}