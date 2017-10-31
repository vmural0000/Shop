namespace BLL.DTO
{
    public class ProductListDto
    {
        public string Id { get; set; }
        public string Article { get; set; }
        public string Name { get; set; }
        public bool Published { get; set; }
        public decimal Price { get; set; }
        public int UnitsInStock { get; set; }
        public bool Discount { get; set; }
        public int DiscountPrice { get; set; }
        public string Image { get; set; }
        public string ProductCategoryName { get; set; }
    }
}
