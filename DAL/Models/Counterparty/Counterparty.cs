using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;

namespace DAL.Models
{
    public class Counterparty
    {
        [Key]
        public string Id { get; set; } = SequentialGuidUtils.NewGuid().ToString();

        public string Name { get; set; }
        public string Email { get; set; }
        public string PhoneNumber { get; set; }
        public string Address { get; set; }
        public string City { get; set; }
        public Gender Gender { get; set; }
        
        public ICollection<Order> Orders { get; set; }
    }
}
