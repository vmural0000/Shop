using System;
using DAL;

namespace BLL.Services
{
    public interface IUtilsService
    {
        Guid GetGuid();
    }

    public class UtilsService : IUtilsService
    {
        public Guid GetGuid()
        {
            return SequentialGuidUtils.NewGuid();
        }
    }
}