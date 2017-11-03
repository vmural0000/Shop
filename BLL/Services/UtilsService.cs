using System;
using DAL;

namespace BLL.Services
{
    public class UtilsService : IUtilsService
    {
        public Guid GetGuid()
        {
            return SequentialGuidUtils.NewGuid();
        }
    }
}