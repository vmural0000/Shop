namespace DAL.Models
{
    public class SuplieLine
    {
        public string Id { get; set; } = SequentialGuidUtils.NewGuid().ToString();
        public decimal UnitPrice { get; set; }
        public int Quantity { get; set; }


        public string ProductId { get; set; }
        public Product Product { get; set; }

        public string SupplieId { get; set; }
        public Supplie Supplie { get; set; }
    }
}