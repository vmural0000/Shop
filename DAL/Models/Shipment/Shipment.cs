namespace DAL.Models
{
    public class Shipment : BaseModel
    {
        public string ShipmentNumber { get; set; }

        public string OrderId { get; set; }
        public string StorageId { get; set; }
        public string ManagerId { get; set; }
        
        public virtual Order Order { get; set; }
        public virtual Storage Storage { get; set; }
        public virtual ApplicationUser Manager { get; set; }
    }
}
