using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Text;

namespace DAL.Models
{
    public class Warehouse
    {
        [Key]
        public string SiteKey { get; set; }
        public string Description { get; set; }
        public string DescriptionRu { get; set; }
        public string Phone { get; set; }
        public string TypeOfWarehouse { get; set; }
        public string Ref { get; set; }
        public string Number { get; set; }
        public string CityRef { get; set; }
        public string CityDescription { get; set; }
        public string CityDescriptionRu { get; set; }
        public string Longitude { get; set; }
        public string Latitude { get; set; }
        public string PostFinance { get; set; }
        public string BicycleParking { get; set; }
        public string POSTerminal { get; set; }
        public string InternationalShipping { get; set; }
        public int TotalMaxWeightAllowed { get; set; }
        public int PlaceMaxWeightAllowed { get; set; }


        public string ReceptionId { get; set; }
        public string DeliveryId { get; set; }
        public string ScheduleId { get; set; }


        public Reception Reception { get; set; }
        public Delivery Delivery { get; set; }
        public Schedule Schedule { get; set; }
    }
}
