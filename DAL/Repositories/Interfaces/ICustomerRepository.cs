using DAL.Models;
using System;
using System.Collections.Generic;
using System.Linq;

namespace DAL.Repositories.Interfaces
{
    public interface ICustomerRepository : IRepository<Counterparty>
    {
        IEnumerable<Counterparty> GetTopActiveCustomers(int count);
        Counterparty GetCustomer(string id);
        IEnumerable<Counterparty> GetAllCustomersData();
    }
}
