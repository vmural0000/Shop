using DAL.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Linq.Expressions;

namespace DAL.Repositories.Interfaces
{
    public interface IOrdersRepository : IRepository<Order>
    {
        IEnumerable<Order> GetAllOrders();
        Order GetOrderById(string id);
        IEnumerable<Order> GetOrderWhere(Expression<Func<Order, bool>> predicate);
    }
}
