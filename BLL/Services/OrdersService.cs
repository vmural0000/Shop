using System;
using DAL.Models;
using DAL;
using Microsoft.Extensions.Logging;
using System.Linq;
using AutoMapper;
using BLL.DTO;
using System.Collections.Generic;
using System.Threading.Tasks;
using BLL.Helpers;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.JsonPatch;
using Microsoft.EntityFrameworkCore;

namespace BLL.Services
{
    public interface IOrdersService
    {
        Task<IEnumerable<OrderListDto>> GetOrdersAsync();
        Task<OrderEditDto> GetOrderAsync(string id);
        Task<OrderEditDto> PostOrderAsync(OrderEditDto model);
        Task<OrderEditDto> PostOrderFromSite(OrderEditDto model);
        Task<OrderEditDto> PutOrderAsync(string id, OrderEditDto model);
        Task<OrderEditDto> PatchOrderAsync(string id, JsonPatchDocument<OrderEditDto> model);
        Task<OrderEditDto> AcceptAsync(string id);
        Task DeleteAsync(string id);
    }

    public class OrdersService : IOrdersService
    {
        private readonly ApplicationDbContext _context;
        private readonly ILogger _logger;
        private readonly IHttpContextAccessor _httpContextAccessor;
        private readonly UserManager<ApplicationUser> _userManager;
        private readonly IActivityLogService _activityLog;

        public OrdersService(ApplicationDbContext context,
            ILoggerFactory loggerFactory,
            IHttpContextAccessor httpContextAccessor,
            UserManager<ApplicationUser> userManager,
            IActivityLogService activityLog)
        {
            _context = context;
            _logger = loggerFactory.CreateLogger<OrdersService>();
            _httpContextAccessor = httpContextAccessor;
            _userManager = userManager;
            _activityLog = activityLog;
        }

        public async Task<IEnumerable<OrderListDto>> GetOrdersAsync()
        {
            //for (int i = 1; i < 187; i++)
            //{
            //    var client = new HttpClient();
            //    var uri = "https://api.novaposhta.ua/v2.0/json/";
            //    HttpResponseMessage response;
            //    byte[] byteData = Encoding.UTF8.GetBytes("{\"apiKey\":\"7af47edd7ce9cca70bc9bc29a52d91c7\"," +
            //                                             "\"modelName\":\"AddressGeneral\",\"calledMethod\":\"getSettlements\",\"methodProperties\":" +
            //                                             "{\"Page\":\"" + i + "\"}}");

            //    using (var content = new ByteArrayContent(byteData))
            //    {
            //        content.Headers.ContentType = new MediaTypeHeaderValue("application/json");
            //        response = await client.PostAsync(uri, content);

            //        var x = response.Content.ReadAsStringAsync();

            //        var result = JsonConvert.DeserializeObject<WarehouseRoot>(x.Result);
            //        await _context.Settlements.AddRangeAsync(result.data);
            //        await _context.SaveChangesAsync();
            //    }
            //}
            var orders = await _context.Orders.Include(i => i.Counterparty).OrderByDescending(o => o.DateCreated).ToListAsync();
            return Mapper.Map<IEnumerable<OrderListDto>>(orders);
        }

        public async Task<OrderEditDto> GetOrderAsync(string id)
        {
            await _activityLog.Post(id);
            _logger.LogDebug($"Get Order {id}");

            var order = await _context.Orders.Include(i => i.Counterparty)
                .Include(i => i.Manager)
                .Include(i => i.OrderLines)
                .ThenInclude(i => i.Product)
                .SingleOrDefaultAsync(s => s.Id == id);

            if (order == null) return null;

            var model = Mapper.Map<OrderEditDto>(order);

            var orders = await _context.Orders
                .Include(i => i.OrderLines) // вибираємо користувачів по імені і номеру і вивидимо схожі замовлення
                .ThenInclude(i => i.Product)
                .Where(w => w.Counterparty.PhoneNumber == order.Counterparty.PhoneNumber)
                .Where(w => w.OrderNumber != order.OrderNumber).ToListAsync();

            model.Orders = Mapper.Map<IEnumerable<OrderListDto>>(orders);
            return model;
        }

        public async Task<OrderEditDto> PostOrderAsync(OrderEditDto model)
        {
            var order = new Order();
            Mapper.Map(model, order);

            await _activityLog.Post(model.Id, ActivityType.Create);

            order.ManagerId = Utilities.GetUserId(_httpContextAccessor.HttpContext.User);
            order.Manager = null; // патч щоб не створювало фантомних користувачів

            if (order.DeliveryDate <= DateTime.Now)
            {
                _logger.LogWarning(LoggingEvents.UpdateItemError, "Неможливо вибрати дану дату доставки, дата раніша можливої відправки");
                order.DeliveryDate = DateTime.Now.AddDays(1); //автоматично додати один день до сьогоднішньої дати, але потрабно показати повідомлення
            }

            //add details
            model.OrderLines.ToList().ForEach(detailDto =>
            {
                var detail = new OrderLine();
                var product = _context.Products.SingleOrDefault(w => w.Article == detailDto.ProductArticle);
                detail.OrderId = order.Id;
                detail.ProductId = product.Id;
                detail.UnitPrice = product.Price;
                detail.Quantity = detailDto.Quantity;

                order.OrderLines = new List<OrderLine> { detail };
            });

            order.DateCreated = DateTime.UtcNow;
            order.OrderNumber = GetOrderNumber();
            order.Status = OrderStatus.Agreed;

            _context.Orders.Add(order);
            await _context.SaveChangesAsync();

            return await GetOrderAsync(order.Id);
        }

        public async Task<OrderEditDto> PostOrderFromSite(OrderEditDto model)
        {
            var order = new Order();
            Mapper.Map(model, order);

            order.ManagerId = "63ba12d8-cdda-4fd0-b7bf-c10f08e0d044";
            order.Manager = null; // патч щоб не створювало фантомних користувачів  


            var product = await _context.Products.SingleOrDefaultAsync(w => w.Article == "000001");

            order.OrderLines.Add(new OrderLine
            {
                OrderId = order.Id,
                ProductId = product.Id,
                UnitPrice = product.Price,
                Quantity = 1
            });


            //add details
            //model.OrderLines.ToList().ForEach(async detailDto =>
            //{
            //    var detail = new OrderLine();
            //    var product = await _context.Products.SingleOrDefaultAsync(w => w.Article == detailDto.ProductArticle);
            //    detail.OrderId = order.Id;
            //    detail.ProductId = product.Id;
            //    detail.UnitPrice = product.SellingPrice;
            //    detail.Quantity = detailDto.Quantity;

            //    order.OrderLines = new List<OrderLine> { detail };
            //});

            order.OrderNumber = GetOrderNumber();
            order.DateCreated = DateTime.Now;
            order.Status = OrderStatus.New;

            _context.Orders.Add(order);
            await _context.SaveChangesAsync();

            return await GetOrderAsync(order.Id);
        }

        public async Task<OrderEditDto> PutOrderAsync(string id, OrderEditDto model)
        {
            await _activityLog.Post(model.Id, ActivityType.Update);

            if (id != model.Id)
            {
                throw new InvalidOperationException("Такого замовлення не знайдено");
            }

            var order = await _context.Orders.AsNoTracking().Include(i => i.Counterparty)
                .Include(i => i.Manager)
                .Include(i => i.OrderLines)
                .ThenInclude(i => i.Product)
                .SingleOrDefaultAsync(s => s.Id == model.Id);

            Mapper.Map(model, order);
            order.ManagerId = Utilities.GetUserId(_httpContextAccessor.HttpContext.User);

            if (!await CheckToModifyOrder(order))
                throw new InvalidOperationException("Не можливо редагувати виконане замовлення, у вас немає прав для цього");

            //remove deleted details
            order.OrderLines.Where(d => model.OrderLines.All(detailDto => detailDto.Id != d.Id)).ToList()
            .ForEach(deleted => _context.OrderLines.Remove(deleted));

            //update or add details
            model.OrderLines.ToList().ForEach(detailDto =>
            {
                var line = order.OrderLines.FirstOrDefault(d => d.Id == detailDto.Id);
                var detail = line ?? new OrderLine();

                var product = _context.Products.SingleOrDefault(w => w.Article == detailDto.ProductArticle);
                detail.OrderId = order.Id;
                detail.ProductId = product.Id;
                detail.UnitPrice = product.Price;
                detail.Quantity = detailDto.Quantity;

                if (line == null)
                {
                    order.OrderLines.Add(detail);
                }
            });
            

            if (order.DeliveryDate <= DateTime.Now)
            {
                _logger.LogWarning(LoggingEvents.UpdateItemError, "Неможливо вибрати дану дату доставки, дата раніша можливої відправки");
                order.DeliveryDate = DateTime.Now.AddDays(1); //автоматично додати один день до сьогоднішньої дати, але потрабно показати повідомлення
            }


            if ((int)model.Status >= (int)order.Status)
                ChangeStatus(order);
            else
            {
                _logger.LogWarning(LoggingEvents.UpdateItemError, "Неможливо змінити статус замовлення на нижчий, у вас немає прав для цього");
                return null;
            }

            _context.Orders.Update(order);
            await _context.SaveChangesAsync();

            return Mapper.Map<OrderEditDto>(order);
        }

        public async Task<OrderEditDto> PatchOrderAsync(string id, JsonPatchDocument<OrderEditDto> model)
        {
            await _activityLog.Post(id, ActivityType.Update);

            var order = await _context.Orders.SingleOrDefaultAsync(w => w.Id == id);
            var tmp = Mapper.Map<OrderEditDto>(order);

            model?.ApplyTo(tmp);

            Mapper.Map(order, tmp);

            ChangeStatus(order);


            _context.Orders.Update(order);
            await _context.SaveChangesAsync();

            return Mapper.Map<OrderEditDto>(order);
        }

        public async Task<OrderEditDto> AcceptAsync(string id)
        {
            await _activityLog.Post(id, ActivityType.Update);
            var order = await _context.Orders.SingleOrDefaultAsync(w => w.Id == id);
            if (order == null) return null;
            order.ManagerId = Utilities.GetUserId(_httpContextAccessor.HttpContext.User);

            order.Status = OrderStatus.Processing;//коли нажато прийняти в обробку

            _context.Orders.Update(order);
            await _context.SaveChangesAsync();

            return await GetOrderAsync(id);
        }

        public async Task DeleteAsync(string id)
        {
            await _activityLog.Post(id, ActivityType.Delete);
            var order = _context.Orders.SingleOrDefault(m => m.Id == id);
            if (order != null)
            {
                _context.Orders.Remove(order);
                await _context.SaveChangesAsync();
            }
        }




        private string GetOrderNumber()
        {
            var sGuid = SequentialGuidUtils.NewGuid();
            var hashCode = string.Format("{0:X}", sGuid.GetHashCode());
            return $"КНК/{hashCode}";
        }

        Order ModifyOrder(Order order, bool create)
        {
            return order;
        }

        private async Task<bool> CheckToModifyOrder(Order order)// якщо не адмін не можна редагувати виконане замовлення
        {
            bool admin = await _userManager.IsInRoleAsync(order.Manager, "Administrator");
            if (order.Status >= OrderStatus.Done && !admin)
                return false;
            return true;
        }

        private async void ChangeStatus(Order order)
        {
            if (order.Status == OrderStatus.Completed)
            {
                //await SendElectronicInvoiceToCustomer(order);
            }
        }

        private async Task SendElectronicInvoiceToCustomer(Order order)
        {
            string recepientName = "QickApp Tester"; //         <===== Put the recepient's name here

            string message = "";

            (bool success, string errorMsg) response = await EmailSender.SendEmailAsync(recepientName, order.Counterparty.Email, "Test Email from QuickApp", message);

            if (response.success)
                _logger.LogInformation(0, "Email sent success");
            else
                _logger.LogError(0, response.errorMsg, "Email sent error");
        }

        private void ExportToPdf(Order order)
        {

        }
    }
}
