using DAL.Repositories;
using DAL.Repositories.Interfaces;

namespace DAL
{
    public class UnitOfWork : IUnitOfWork
    {
        readonly ApplicationDbContext _context;

        ICustomerRepository _customers;
        IProductRepository _products;
        IProductCategoryRepository _productCategories;


        public UnitOfWork(ApplicationDbContext context)
        {
            _context = context;
        }

        public ICustomerRepository Customers
        {
            get
            {
                if (_customers == null)
                    _customers = new CustomerRepository(_context);

                return _customers;
            }
        }

        public IProductRepository Products
        {
            get
            {
                if (_products == null)
                    _products = new ProductRepository(_context);

                return _products;
            }
        }

        public IProductCategoryRepository ProductCategory
        {
            get
            {
                if (_productCategories == null)
                    _productCategories = new ProductCategoryRepository(_context);

                return _productCategories;
            }
        }

        public int SaveChanges()
        {
            return _context.SaveChanges();
        }
    }
}
