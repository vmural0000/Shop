using System.Collections.Generic;
using BLL.DTO;

namespace BLL.Services
{
    public interface IStoragesService
    {
        IEnumerable<StorageDto> Get();
        StorageDto Get(string id);
        void Post(StorageDto dto);
        void Put(string id, StorageDto dto);
        bool Delete(string id);
    }
}