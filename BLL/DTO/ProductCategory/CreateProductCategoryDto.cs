using System.ComponentModel.DataAnnotations;

namespace BLL.DTO.ProductCategory
{
    public class CreateProductCategoryDto
    {
        public string Name { get; set; }
        public string ParentId { get; set; }
    }
}
