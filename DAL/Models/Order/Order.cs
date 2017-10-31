using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;

namespace DAL.Models
{
    public class Order : BaseModel
    {
        [Required]
        public string OrderNumber { get; set; }

        [Required]
        public OrderStatus Status { get; set; }

        [StringLength(200)]
        public string Comments { get; set; }

        public DateTime? DeliveryDate { get; set; }

        public DeliveryType DeliveryType { get; set; }

        [StringLength(20)]
        public string ElectronicInvoice { get; set; }

        public PaymentMethod PaymentMethod { get; set; }

        public decimal AmountPaid { get; set; }
        public decimal AmountDue { get; set; }





        [Required]
        public string ManagerId { get; set; }
        [Required]
        public string CounterpartyId { get; set; }


        public ICollection<OrderLine> OrderLines { get; set; }




        public virtual ApplicationUser Manager { get; set; }
        public virtual Counterparty Counterparty { get; set; }
    }
}
