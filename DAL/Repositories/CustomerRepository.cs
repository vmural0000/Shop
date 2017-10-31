using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Microsoft.EntityFrameworkCore;
using DAL.Models;
using DAL.Repositories.Interfaces;

namespace DAL.Repositories
{
    public class CustomerRepository : Repository<Counterparty>, ICustomerRepository
    {
        public CustomerRepository(ApplicationDbContext context) : base(context)
        { }


        public IEnumerable<Counterparty> GetTopActiveCustomers(int count)
        {
            throw new NotImplementedException();
        }


        public IEnumerable<Counterparty> GetAllCustomersData()
        {
            return appContext.Customers.OrderBy(c => c.Name).ToList();
        }

        public Counterparty GetCustomer(string id)
        {
            return appContext.Customers.Include(i => i.Orders).FirstOrDefault(w => w.Id == id);
        }



        private ApplicationDbContext appContext
        {
            get { return (ApplicationDbContext)_context; }
        }
    }
}
