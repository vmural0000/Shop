using System;
using System.Collections.Generic;
using System.Linq;
using DAL.Models;

namespace BLL.DTO
{
    public class ShipmentDto
    {
        public string Id { get; set; }
        public string ShipmentNumber { get; set; }
        public DateTime Time { get; set; }
        public bool Conducted { get; set; }
        public string OrderOrderNumber { get; set; }
        public PaymentMethod OrderPaymentMethod { get; set; }
        public string OrderElectronicInvoice { get; set; }
        public string OrderCustomerName { get; set; }
        public string OrderCustomerEmail { get; set; }
        public string OrderCustomerPhoneNumber { get; set; }
        public string OrderCustomerAddress { get; set; }
        public string OrderCustomerCity { get; set; }
        public string StorageName { get; set; }
        public string StorageAdress { get; set; }
        public string ManagerFullName { get; set; }

        public ICollection<OrderLineDTO> OrderLines { get; set; }

        public decimal TotalPrice => OrderLines.Sum(i => (i.UnitPrice * i.Quantity)); /*- Discount*/
    }
}
