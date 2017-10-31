using System.Collections.Generic;

namespace BLL.DTO
{
    public class DashboardDTO
    {
        public int CustomersCount { get; set; }
        public int ProductsCount { get; set; }
        public int ProductCategoriesCount { get; set; }
        public int OrdersCount { get; set; }
        public decimal OrdersAmount { get; set; }
    }
}
