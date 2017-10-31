using DAL.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Microsoft.EntityFrameworkCore;
using DAL.Repositories.Interfaces;

namespace DAL.Repositories
{
    public class ProductRepository : Repository<Product>, IProductRepository
    {
        public ProductRepository(DbContext context) : base(context)
        { }

        public IEnumerable<Product> GetAllProducts()
        {
            return appContext.Products
                .OrderBy(c => c.Name)
                .ToList();
        }

        public IEnumerable<Product> GetAllProductsWithCategories()
        {
            return appContext.Products
                .Include(c => c.ProductCategory)
                .ToList();
        }

        public IQueryable<Product> GetIQueryableProducts()
        {
            return appContext.Products
                .Include(c => c.ProductCategory);
        }


        private ApplicationDbContext appContext
        {
            get { return (ApplicationDbContext)_context; }
        }
    }
}
