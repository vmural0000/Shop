using System;

namespace BLL.DTO
{
    public class ProductEditDto
    {
        public string Id { get; set; }
        public string BarCode { get; set; }
        public string Name { get; set; }
        public string Brand { get; set; }
        public string Manufactures { get; set; }
        public string ShortDescription { get; set; }
        public string Description { get; set; }
        public string Image { get; set; }
        public bool Published { get; set; }
        public decimal Price { get; set; }
        public bool Discount { get; set; }
        public DateTime DiscountToDateTime { get; set; }
        public int DiscountPrice { get; set; }
        public bool DiscountAllowed { get; set; }
        public int MaxDiscountPercentage { get; set; }
        public string MetaTitle { get; set; }
        public string MetaDescription { get; set; }
        public string MetaKeywords { get; set; }
        public double Width { get; set; }
        public double Height { get; set; }
        public double Length { get; set; }
        public double Weight { get; set; }
        public string ProductCategoryId { get; set; }
    }
}
