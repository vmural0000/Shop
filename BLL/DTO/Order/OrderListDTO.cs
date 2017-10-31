using System;
using DAL.Models;

namespace BLL.DTO
{
    public class OrderListDto
    {
        public string Id { get; set; }       
        public string OrderNumber { get; set; }
        public DateTime DateCreated { get; set; }
        public OrderStatus Status { get; set; }
        public string CounterpartyName { get; set; }
        public string CounterpartyPhoneNumber { get; set; }
    }
}
