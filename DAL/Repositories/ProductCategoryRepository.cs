using System.Collections.Generic;
using System.Linq;
using DAL.Models;
using Microsoft.EntityFrameworkCore;
using DAL.Repositories.Interfaces;

namespace DAL.Repositories
{
    public class ProductCategoryRepository : Repository<ProductCategory>, IProductCategoryRepository
    {
        public ProductCategoryRepository(DbContext context) : base(context)
        { }

        public IEnumerable<ProductCategory> GetAllProductCategories()
        {
            return AppContext.ProductCategories.Include(i => i.Parent)
                .OrderBy(o => o.Name)
                .ToList();
        }

        private ApplicationDbContext AppContext => (ApplicationDbContext)_context;
    }
}
