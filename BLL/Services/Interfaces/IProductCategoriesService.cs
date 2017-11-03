using System.Collections.Generic;
using BLL.DTO;
using BLL.DTO.ProductCategory;

namespace BLL.Services
{
    public interface IProductCategoriesService
    {
        List<ProductCategoryDto> Get();
        IEnumerable<ProductCategoryDto> GetList();
        IEnumerable<ProductCategoryDto> GetParent();
        ProductCategoryDto Get(string id);
        void Put(string id, ProductCategoryDto dto);
        ProductCategoryDto Post(CreateProductCategoryDto dto);
        bool Delete(string id);
    }
}