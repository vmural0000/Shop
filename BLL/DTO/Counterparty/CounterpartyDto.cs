using System.Collections.Generic;

namespace BLL.DTO
{
    public class CounterpartyDto
    {
        public string Id { get; set; }
        public string Name { get; set; }
        public string Email { get; set; }
        public string PhoneNumber { get; set; }
        public string Address { get; set; }
        public string City { get; set; }
        public string Gender { get; set; }

        public ICollection<OrderListDto> Orders { get; set; }
    }
}
