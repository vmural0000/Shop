using System;
using System.Collections.Generic;
using System.Threading.Tasks;
using BLL.DTO;
using DAL.Models;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.JsonPatch;

namespace BLL.Services
{
    public interface IProductsService
    {
        IEnumerable<ProductListDto> Get();
        Task<PagedResult<ProductListDto>> GetAsync(int page, int pageSize);
        ProductDetailsDto Get(string id);
        Task<Tuple<int, IEnumerable<ProductListDto>>> GetByCategory(string id, int page, int pageSize);
        ProductDetailsDto GetProductByArticle(string article);
        ProductDetailsDto Post(ProductEditDto dto);
        void Patch(string id, JsonPatchDocument<Product> product);
        void Put(string id, ProductEditDto dto);
        bool Delete(string id);
        string ExportToJson(string id = null);
        bool ImportFromJson(string data);
        void Upload(string id, IFormCollection files);
        void DeleteImage(string id, string fileName);
    }
}