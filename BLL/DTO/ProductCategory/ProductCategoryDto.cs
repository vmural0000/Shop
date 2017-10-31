using System.Collections.Generic;

namespace BLL.DTO
{
    public class ProductCategoryDto
    {
        public string Id { get; set; }

        public string SequenceId { get; set; }
        public string Name { get; set; }
        public string ParentId { get; set; }
        public IEnumerable<ProductCategoryDto> ProductCategories { get; set; }
    }
}
