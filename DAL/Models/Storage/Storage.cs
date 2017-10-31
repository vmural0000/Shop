using System.ComponentModel.DataAnnotations;

namespace DAL.Models
{
    public class Storage
    {
        [Key]
        public string Id { get; set; } = SequentialGuidUtils.NewGuid().ToString();

        public string Name { get; set; }
        public string Adress { get; set; }
        public string Description { get; set; }
    }
}