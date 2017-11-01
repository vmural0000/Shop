using System;
using System.ComponentModel.DataAnnotations;

namespace DAL.Models
{
    public class Product : IAuditedEntity
    {
        [Key]
        public string Id { get; set; } = SequentialGuidUtils.NewGuid().ToString();

        [StringLength(9, MinimumLength = 6)]
        public string Article { get; set; }

        [StringLength(13, MinimumLength = 13)]
        public string BarCode { get; set; }

        [StringLength(100, MinimumLength = 3)]
        public string Name { get; set; }

        [StringLength(50, MinimumLength = 3)]
        public string Brand { get; set; }

        [StringLength(70)]
        public string Manufactures { get; set; }

        [StringLength(70, MinimumLength = 3)]
        public string ShortDescription { get; set; }

        public string Description { get; set; }

        public string Image { get; set; }

        public bool Published { get; set; }


        #region Prices

        [Range(1, 99999999)]
        public decimal Price { get; set; }
        #endregion

        #region Discount
        public bool Discount { get; set; }
        public DateTime DiscountToDateTime { get; set; }

        [Range(1, 99999999)]
        public decimal DiscountPrice { get; set; }

        public bool DiscountAllowed { get; set; }

        [Range(1, 99)]
        public int MaxDiscountPercentage { get; set; }
        #endregion

        #region MetaSEO

        [StringLength(70, MinimumLength = 20)]
        public string MetaTitle { get; set; }

        [StringLength(160, MinimumLength = 20)]
        public string MetaDescription { get; set; }

        [StringLength(100, MinimumLength = 10)]
        public string MetaKeywords { get; set; }
        #endregion

        #region Properties
        public double Width { get; set; }
        public double Height { get; set; }
        public double Length { get; set; }
        public double Weight { get; set; }
        #endregion

        public string ProductCategoryId { get; set; }
        public ProductCategory ProductCategory { get; set; }

        public DateTime? Created { get; set; }
        public DateTime? Modified { get; set; }
        public string CreatedBy { get; set; }
        public string ModifiedBy { get; set; }
    }
}
