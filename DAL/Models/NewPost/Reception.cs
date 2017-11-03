namespace DAL.Models
{
    public class Reception
    {
        public string Id { get; set; } = SequentialGuidUtils.NewGuid().ToString();
        public string Monday { get; set; }
        public string Tuesday { get; set; }
        public string Wednesday { get; set; }
        public string Thursday { get; set; }
        public string Friday { get; set; }
        public string Saturday { get; set; }
        public string Sunday { get; set; }
    }
}