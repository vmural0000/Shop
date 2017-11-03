using System.Collections.Generic;
using System.Threading.Tasks;
using BLL.DTO;
using DAL.Models;

namespace BLL.Services
{
    public interface IActivityLogService
    {
        IEnumerable<ActivityLogDto> Get();
        IEnumerable<ActivityLogDto> Get(string resourceId);
        Task Post(string resourceId, ActivityType type = ActivityType.ReadItem);
    }
}