//using System;
//using System.Collections.Generic;
//using System.IO;
//using System.Linq;
//using Microsoft.AspNetCore.Mvc;
//using OfficeOpenXml;
//using Microsoft.AspNetCore.Hosting;
//using Microsoft.AspNetCore.Authorization;
//using Microsoft.AspNetCore.Mvc.Rendering;
//using Microsoft.Extensions.Logging;
//using DAL;
//using DAL.Models;

//namespace QuickApp.Controllers
//{
//    [Authorize]
//    public class ReportsController : Controller
//    {
//        private readonly IUnitOfWork _context;
//        private readonly ILogger _logger;
//        private readonly IHostingEnvironment _env;

//        public ReportsController(IUnitOfWork unitOfWork, IHostingEnvironment env, ILoggerFactory loggerFactory)
//        {
//            _context = unitOfWork;
//            _env = env;
//            _logger = loggerFactory.CreateLogger<ReportsController>();
//        }

//        public IActionResult Index()
//        {
//            ViewBag.Products = new SelectList(_context.Products.GetAll(), "Id", "Name");
//            return View();
//        }

//        [AllowAnonymous]
//        public FileResult Day(DateTime? date)
//        {
//            IEnumerable<Counterparty> list;
//            IEnumerable<Order> orders;
//            byte[] byteArray;
//            string filename;

//            if (date == null)
//            {
//                filename = Utils.DateToday().Date.ToString("d");
//                list = _context.Customers.Find(w => w.DateCreated == Utils.DateToday()).ToList(); //w.Date
//                orders = _context.Orders.GetAllOrders().Where(w => w.DateCreated > Utils.DateToday().AddHours(6) && w.DateCreated < Utils.DateToday().AddDays(1).AddHours(6));
//            }
//            else
//            {
//                filename = date.Value.Date.ToString("d");
//                list = _context.Customers.Find(w => w.DateCreated == date).ToList();//w.Date
//                orders = _context.Orders.GetAllOrders().Where(w => w.DateCreated > date.Value.AddHours(6) && w.DateCreated < date.Value.AddDays(1).AddHours(6));
//            }


//            FileInfo newFile = new FileInfo(_env.WebRootPath + "\\xlsx\\DaysTemplate.xlsx");
//            using (ExcelPackage pck = new ExcelPackage(newFile, true))
//            {
//                ExcelWorksheet ws = pck.Workbook.Worksheets[1];

//                int row = 1;
//                foreach (var item in list)
//                {
//                    try
//                    {
//                        row++;
//                        ws.Cells["A" + row].Value = row - 1;
//                        ws.Cells["B" + row].Value = int.Parse(item.Card.Substring(10).Remove(1));
//                        ws.Cells["C" + row].Value = item.SpecialTariff;
//                        ws.Cells["D" + row].Value = item.DateCreated;
//                        ws.Cells["E" + row].Value = item.DateModified;
//                        ws.Cells["F" + row].Value = item.DateModified.Value.Subtract(item.DateCreated);
//                        ws.Cells["G" + row].Value = item.Price;
//                    }
//                    catch
//                    {
//                    }
//                }

//                int rowOrder = 1;
//                foreach (var item in orders)
//                {
//                    try
//                    {
//                        rowOrder++;
//                        ws.Cells["L" + rowOrder].Value = item.DateCreated;
//                        //ws.Cells["M" + rowOrder].Value = item.Total;

//                        foreach (var ord in item.OrderDetails)
//                        {
//                            ws.Cells["N" + rowOrder].Value = $"{ord.Product.Name} - {ord.Quantity}";
//                            if (item.OrderDetails.Count > 1)
//                                rowOrder++;
//                        }
//                    }
//                    catch
//                    {
//                    }
//                }
//                byteArray = pck.GetAsByteArray();
//            }
//            _logger.LogInformation($"—формовано зв≥т з к≥льк≥стю запис≥в: {list.Count()}");
//            return File(byteArray, "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet", $"{filename}.xlsx");
//        }

//        public FileResult Month(DateTime? date)
//        {
//            List<IGrouping<DateTime, Counterparty>> list;
//            byte[] byteArray;
//            string filename;

//            if (date == null)
//            {
//                filename = Utils.DateToday().Date.ToString("d");
//                list = _context.Customers.Find(w => w.DateCreated.Month == Utils.DateToday().Month).GroupBy(w => w.DateCreated.Date).ToList(); // w.Date.Month
//            }
//            else
//            {
//                filename = date.Value.Date.ToString("d");
//                list = _context.Customers.Find(w => w.DateCreated.Month == date.Value.Month && w.DateCreated.Year == date.Value.Year).GroupBy(w => w.DateCreated.Date).ToList(); // w.Date.Month  w.Date.Year
//            }

//            FileInfo newFile = new FileInfo(_env.WebRootPath + "\\xlsx\\MonthTemplate.xlsx");

//            using (ExcelPackage pck = new ExcelPackage(newFile, true))
//            {
//                ExcelWorksheet ws = pck.Workbook.Worksheets[1];

//                int row = 1;
//                foreach (var item in list)
//                {
//                    row++;
//                    int orders = item.Count();
//                    int general = item.Count(w => w.SpecialTariff == false);
//                    decimal money = item.Sum(element => element.Price);

//                    var oders = _context.Orders.GetAllOrders()
//                        .Where(w => w.DateCreated > item.Key.AddHours(6) && w.DateCreated < item.Key.AddDays(1).AddHours(6));
//                    decimal productsTotal = 0;

//                    foreach (var order in oders)
//                    {
//                        foreach (var detail in order.OrderDetails)
//                        {
//                            productsTotal += detail.Product.SellingPrice - detail.Product.BuyingPrice;
//                        }
//                    }

//                    ws.Cells["A" + row].Value = item.Key;
//                    ws.Cells["B" + row].Value = orders;
//                    ws.Cells["C" + row].Value = general;
//                    ws.Cells["D" + row].Formula = (orders - general).ToString();
//                    ws.Cells["E" + row].Value = money;
//                    ws.Cells["F" + row].Value = productsTotal;
//                    ws.Cells["G" + row].Formula = (money + (int)productsTotal).ToString();
//                }
//                byteArray = pck.GetAsByteArray();
//            }
//            return File(byteArray, "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet", $"{filename}.xlsx");
//            //Log.Debug($"—формовано зв≥т з к≥льк≥стю запис≥в: {list.Count()}");
//        }

//        public FileResult Products(DateTime? from, DateTime? to)
//        {
//            List<IGrouping<int, OrderDetail>> products = null;
//            byte[] byteArray;
//            string filename = "«в≥т по товарах";

//            if (from != null && to != null)
//                products = _context.OrderDetails
//                    .Find(w => w.Order.DateCreated.Date >= from && w.Order.DateCreated.Date <= to)
//                    .GroupBy(g => g.ProductId).ToList();

//            else if (from == null && to == null)
//                products = _context.OrderDetails.GroupBy();

//            else if (from == null)
//                products = _context.OrderDetails
//                    .Find(w => w.Order.DateCreated.Date <= to)
//                    .GroupBy(g => g.ProductId).ToList();

//            else if (to == null)
//                products = _context.OrderDetails
//                    .Find(w => w.Order.DateCreated.Date >= from)
//                    .GroupBy(g => g.ProductId).ToList();

//            FileInfo newFile = new FileInfo(_env.WebRootPath + "\\xlsx\\Products.xlsx");
//            using (ExcelPackage pck = new ExcelPackage(newFile, true))
//            {
//                ExcelWorksheet ws = pck.Workbook.Worksheets[1];
//                // в≥д ≥ до дати в ексель

//                //дата + 6 годин, бо п≥дт€гуЇ  товари п≥сл€ 12

//                int row = 1;
//                foreach (var item in products)
//                {
//                    try
//                    {
//                        row++;
//                        var product = _context.Products.GetAllProductsWithCategories().SingleOrDefault(s => s.Id == item.Key);
//                        ws.Cells["A" + row].Value = row - 1;
//                        ws.Cells["B" + row].Value = product.Article;
//                        ws.Cells["C" + row].Value = product.Name;
//                        ws.Cells["D" + row].Value = product.BuyingPrice;
//                        ws.Cells["E" + row].Value = product.SellingPrice;
//                        ws.Cells["F" + row].Value = product.UnitsInStock;
//                        ws.Cells["G" + row].Value = item.Where(w => w.ProductId == item.Key).Sum(e => e.Quantity);
//                    }
//                    catch { }
//                }
//                byteArray = pck.GetAsByteArray();
//            }
//            return File(byteArray, "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet", $"{filename}.xlsx");
//        }

//        public FileResult Product(DateTime? from, DateTime? to, int product)
//        {
//            List<OrderDetail> products = null;
//            byte[] byteArray;
//            string filename = $"«в≥т по товару {product}";

//            if (product == 0)
//                throw new Exception();

//            if (from != null && to != null)
//                products = _context.OrderDetails
//                    .Find(w => w.ProductId == product && w.Order.DateCreated.Date >= from && w.Order.DateCreated.Date <= to)
//                    .ToList();

//            else if (from == null && to == null)
//                products = _context.OrderDetails.Find(w => w.ProductId == product).ToList();

//            else if (from == null)
//                products = _context.OrderDetails
//                    .Find(w => w.ProductId == product && w.Order.DateCreated.Date <= to)
//                    .ToList();

//            else if (to == null)
//                products = _context.OrderDetails
//                    .Find(w => w.ProductId == product && w.Order.DateCreated.Date >= from)
//                    .ToList();

//            FileInfo newFile = new FileInfo(_env.WebRootPath + "\\xlsx\\Product.xlsx");
//            using (ExcelPackage pck = new ExcelPackage(newFile, true))
//            {
//                ExcelWorksheet ws = pck.Workbook.Worksheets[1];
//                // в≥д ≥ до дати в ексель

//                //дата + 6 годин, бо п≥дт€гуЇ  товари п≥сл€ 12
//                int row = 1;
//                foreach (var item in products)
//                {
//                    try
//                    {
//                        row++;
//                        ws.Cells["A" + row].Value = row - 1;
//                        ws.Cells["B" + row].Value = item.Order.Id;
//                        ws.Cells["C" + row].Value = item.Order.DateCreated;
//                        ws.Cells["D" + row].Value = item.Quantity;
//                    }
//                    catch
//                    {
//                    }
//                }
//                byteArray = pck.GetAsByteArray();
//            }
//            return File(byteArray, "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet", $"{filename}.xlsx");
//        }
//    }
//}