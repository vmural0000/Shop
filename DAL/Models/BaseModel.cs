using System;
using System.ComponentModel.DataAnnotations;

namespace DAL.Models
{
    public class BaseModel
    {
        [Key]
        public string Id { get; set; } = SequentialGuidUtils.NewGuid().ToString();

        public DateTime DateCreated { get; set; }

        public bool Conducted { get; set; }
    }
}
