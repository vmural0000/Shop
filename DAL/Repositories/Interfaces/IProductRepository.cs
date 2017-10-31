using DAL.Models;
using System;
using System.Collections.Generic;
using System.Linq;

namespace DAL.Repositories.Interfaces
{
    public interface IProductRepository : IRepository<Product>
    {
        IEnumerable<Product> GetAllProducts();
        IEnumerable<Product> GetAllProductsWithCategories();
        IQueryable<Product> GetIQueryableProducts();
    }
}
