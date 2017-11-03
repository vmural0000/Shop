using System.Collections.Generic;
using BLL.DTO;

namespace BLL.Services
{
    public interface IProductCategoriesService
    {
        List<ProductCategoryDto> Get();
        IEnumerable<ProductCategoryDto> GetList();
        ProductCategoryDto Get(string id);
        void Put(string id, ProductCategoryDto dto);
        ProductCategoryDto Post(ProductCategoryDto dto);
        bool Delete(string id);
    }
}