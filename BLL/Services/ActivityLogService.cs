using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using DAL;
using BLL.DTO;
using AutoMapper;
using Microsoft.Extensions.Logging;
using BLL.Helpers;
using DAL.Models;
using Microsoft.AspNetCore.Http;
using Microsoft.EntityFrameworkCore;

namespace BLL.Services
{
    public interface IActivityLogService
    {
        IEnumerable<ActivityLogDto> Get();
        IEnumerable<ActivityLogDto> Get(string resourceId);
        Task Post(string resourceId, ActivityType type = ActivityType.ReadItem);
    }

    public class ActivityLogService : IActivityLogService
    {
        private readonly ApplicationDbContext _unitOfWork;
        readonly ILogger _logger;
        private readonly IHttpContextAccessor _httpContextAccessor;


        public ActivityLogService(ApplicationDbContext unitOfWork, ILogger<StoragesService> logger,
            IHttpContextAccessor httpContextAccessor)
        {
            _unitOfWork = unitOfWork;
            _logger = logger;
            _httpContextAccessor = httpContextAccessor;
        }

        public IEnumerable<ActivityLogDto> Get()
        {
            var model = _unitOfWork.ActivityLogs.Include(i => i.User).OrderByDescending(o => o.TimeStamp);
            return Mapper.Map<IEnumerable<ActivityLogDto>>(model);
        }

        public IEnumerable<ActivityLogDto> Get(string resourceId)
        {
            var model = _unitOfWork.ActivityLogs.Include(i => i.User).Where(w => w.ResourceId == resourceId).OrderByDescending(o => o.TimeStamp);
            return Mapper.Map<IEnumerable<ActivityLogDto>>(model);
        }

        public async Task Post(string resourceId, ActivityType type = ActivityType.ReadItem)
        {
            var userId = Utilities.GetUserId(_httpContextAccessor.HttpContext.User);
            var activity = new ActivityLog
            {
                ResourceId = resourceId,
                Type = type,
                UserId = userId,
                Path = _httpContextAccessor.HttpContext.Request.Path,
                HttpRefer = _httpContextAccessor.HttpContext.Request.Headers["Referer"].ToString(),
                RemoteIp = _httpContextAccessor.HttpContext.Connection.RemoteIpAddress.ToString()
            };

            _unitOfWork.ActivityLogs.Add(activity);
            _unitOfWork.SaveChanges();
        }
    }
}