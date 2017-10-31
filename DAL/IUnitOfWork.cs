using DAL.Repositories.Interfaces;

namespace DAL
{
    public interface IUnitOfWork
    {
        ICustomerRepository Customers { get; }
        IProductRepository Products { get; }
        IProductCategoryRepository ProductCategory { get; }

        int SaveChanges();
    }
}
