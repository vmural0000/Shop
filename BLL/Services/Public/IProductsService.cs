using System;
using System.Collections.Generic;
using System.Threading.Tasks;
using BLL.DTO;

namespace BLL.Services.Public
{
    public interface IProductsService
    {
        IEnumerable<ProductListDto> Get();
        Task<Tuple<int, IEnumerable<ProductListDto>>> GetAsync(int page, int pageSize);
        ProductDetailsDto Get(string article);
        IEnumerable<ProductListDto> GetLatestProducts();
        IEnumerable<ProductListDto> GetPopularProducts();
        IEnumerable<ProductListDto> GetOfferProduct();
        Task<Tuple<int, IEnumerable<ProductListDto>>> GetByCategory(string id, int page, int pageSize);
    }
}