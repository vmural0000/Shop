using System;
using DAL.Models;

namespace BLL.DTO
{
    public class ActivityLogDto
    {
        public string Id { get; set; }
        public string UserId { get; set; }
        public string ResourceId { get; set; }
        public DateTime TimeStamp { get; set; }
        public string RemoteIp { get; set; }
        public string Path { get; set; }
        public string HttpRefer { get; set; }
        public ActivityType Type { get; set; }
        public string UserJobTitle { get; set; }
        public string UserFullName { get; set; }
    }
}
