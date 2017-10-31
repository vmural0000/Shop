using System;
using System.Collections.Generic;
using System.Linq;
using DAL.Models;

namespace BLL.DTO
{
    public class OrderEditDto
    {
        public string Id { get; set; }
        public DateTime DateCreated { get; set; }
        public bool Conducted { get; set; }

        public string OrderNumber { get; set; }
        public OrderStatus Status { get; set; }
        public string Comments { get; set; }

        public DateTime? DeliveryDate { get; set; }
        public DeliveryType DeliveryType { get; set; }
        public string ElectronicInvoice { get; set; }

        public PaymentMethod PaymentMethod { get; set; }
        public decimal AmountPaid { get; set; }
        public decimal AmountDue { get; set; }

        public string ManagerFullName { get; set; }
        public string CounterpartyName { get; set; }
        public string CounterpartyEmail { get; set; }
        public string CounterpartyPhoneNumber { get; set; }
        public string CounterpartyAddress { get; set; }
        public string CounterpartyCity { get; set; }

        public IEnumerable<OrderLineDTO> OrderLines { get; set; }

        public decimal TotalPrice => OrderLines.Sum(i => i.UnitPrice * i.Quantity - i.Discount);

        public IEnumerable<OrderListDto> Orders { get; set; }
    }
}
