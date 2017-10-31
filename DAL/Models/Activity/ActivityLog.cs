using System;

namespace DAL.Models
{
    public class ActivityLog
    {
        public string Id { get; set; } = SequentialGuidUtils.NewGuid().ToString();

        public string UserId { get; set; }
        public string ResourceId { get; set; }
        public DateTime TimeStamp { get; set; } = DateTime.Now;
        public ActivityType Type { get; set; }

        public string RemoteIp { get; set; }
        public string Path { get; set; }
        public string HttpRefer { get; set; }


        public virtual ApplicationUser User { get; set; }
    }
}
