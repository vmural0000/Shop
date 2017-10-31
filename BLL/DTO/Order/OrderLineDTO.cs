namespace BLL.DTO
{
    public class OrderLineDTO
    {
        public string Id { get; set; }
        public decimal UnitPrice { get; set; }
        public int Quantity { get; set; }
        public decimal Discount { get; set; }
        public decimal Amount => UnitPrice * Quantity;
        public string ProductArticle { get; set; }
        public string ProductName { get; set; }
    }
}
