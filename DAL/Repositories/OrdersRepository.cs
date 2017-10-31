using DAL.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Microsoft.EntityFrameworkCore;
using DAL.Repositories.Interfaces;
using System.Linq.Expressions;
namespace DAL.Repositories
{
    public class OrdersRepository : Repository<Order>, IOrdersRepository
    {
        public OrdersRepository(DbContext context) : base(context)
        { }

        public IEnumerable<Order> GetAllOrders()
        {
            return appContext.Orders.Include(i => i.Counterparty).Include(i => i.OrderLines)
                .OrderByDescending(o => o.DateCreated)
                .ToList();
        }
        public Order GetOrderById(string id)
        {
            return appContext.Orders
                .Include(i => i.Counterparty)
                .Include(i => i.Manager)
                .Include(i => i.OrderLines)
                    .ThenInclude(i => i.Product)
                .SingleOrDefault(s => s.Id == id);
        }

        public IEnumerable<Order> GetOrderWhere(Expression<Func<Order, bool>> predicate)
        {
            return appContext.Orders
                .Include(i => i.OrderLines)
                .ThenInclude(i => i.Product)
                .Where(predicate);
        }

        private ApplicationDbContext appContext
        {
            get { return (ApplicationDbContext)_context; }
        }
    }
}
