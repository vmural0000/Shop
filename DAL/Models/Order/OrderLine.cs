namespace DAL.Models
{
    public class OrderLine
    {
        public string Id { get; set; } = SequentialGuidUtils.NewGuid().ToString();
        public decimal UnitPrice { get; set; }
        public int Quantity { get; set; }
        public decimal Discount { get; set; }


        public string ProductId { get; set; }
        public Product Product { get; set; }

        public string OrderId { get; set; }
        public Order Order { get; set; }
    }
}