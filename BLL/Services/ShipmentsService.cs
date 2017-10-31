using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using DAL;
using BLL.DTO;
using AutoMapper;
using Microsoft.Extensions.Logging;
using BLL.Helpers;
using DAL.Models;
using Microsoft.AspNetCore.Http;
using Microsoft.EntityFrameworkCore;

namespace BLL.Services
{
    public interface IShipmentsService
    {
        IEnumerable<ShipmentDto> Get();
        ShipmentDto Get(string id);
        ShipmentDto Create(string orderId);
        Task<ShipmentDto> GetConducted(string id);
        void Put(string id, ShipmentDto dto);
        bool Delete(string id);
    }

    public class ShipmentsService : IShipmentsService
    {
        private readonly ApplicationDbContext _unitOfWork;
        readonly ILogger _logger;
        private readonly IHttpContextAccessor _httpContextAccessor;
        private readonly IActivityLogService _activityLog;

        public ShipmentsService(ApplicationDbContext unitOfWork, ILogger<ShipmentsService> logger,
            IHttpContextAccessor httpContextAccessor, IActivityLogService activityLog)
        {
            _unitOfWork = unitOfWork;
            _logger = logger;
            _httpContextAccessor = httpContextAccessor;
            _activityLog = activityLog;
        }

        public IEnumerable<ShipmentDto> Get()
        {
            var allCustomers = _unitOfWork.Shipments
                .Include(i => i.Order).ThenInclude(t => t.OrderLines)
                .Include(i => i.Order).ThenInclude(t => t.Counterparty)
                .Include(i => i.Storage)
                .Include(i => i.Manager).OrderByDescending(o => o.DateCreated).ToList();

            return Mapper.Map<IEnumerable<ShipmentDto>>(allCustomers);
        }

        public ShipmentDto Get(string id)
        {
            _activityLog.Post(id);
            _logger.LogDebug(LoggingEvents.GetItem, $"Отримання клієнта по ID='{id}'.");
            var customer = _unitOfWork.Shipments
                .Include(i => i.Order).ThenInclude(t => t.OrderLines).ThenInclude(i => i.Product)
                .Include(i => i.Order).ThenInclude(t => t.Counterparty)
                .Include(i => i.Storage)
                .Include(i => i.Manager)
                .SingleOrDefault(m => m.Id == id);

            if (customer == null)
            {
                _logger.LogWarning(LoggingEvents.GetItemNotfound, $"Клієнта з ID={id} не знайдено");
            }
            _logger.LogDebug(LoggingEvents.GetItem, $"Клієнт з ID={id} отриманий успішно."); /////
            return Mapper.Map<ShipmentDto>(customer);
        }

        public ShipmentDto Create(string orderId)
        {
            _logger.LogDebug(LoggingEvents.UpdateItem, $"Спроба створення РНК для замовлення {orderId}.");

            var managerId = Utilities.GetUserId(_httpContextAccessor.HttpContext.User);
            var sGuid = SequentialGuidUtils.NewGuid();
            var hashCode = string.Format("{0:X}", sGuid.GetHashCode());

            var storage = _unitOfWork.Storages.FirstOrDefault();

            var shipment = new Shipment
            {
                OrderId = orderId,
                ManagerId = managerId,
                DateCreated = DateTime.UtcNow,
                StorageId = storage.Id, // temp
                ShipmentNumber = $"РНК/{hashCode}"
            };
            _activityLog.Post(shipment.Id, ActivityType.Create);

            try
            {
                _unitOfWork.Shipments.Add(shipment);
                _unitOfWork.SaveChanges();
                _logger.LogInformation(LoggingEvents.CreateItemSuccess, $"РНК {shipment.Id} додано успішно!", shipment);
            }
            catch (Exception e)
            {
                _logger.LogError(LoggingEvents.CreateItemErorr, e,
                    $"Виникла помилка при створенні РНК {Utilities.ModelToJson(shipment)}");
            }
            return Mapper.Map<ShipmentDto>(shipment);
        }

        public async Task<ShipmentDto> GetConducted(string id)
        {
            await _activityLog.Post(id);

            var shipment = await _unitOfWork.Shipments
                .Include(i => i.Order).ThenInclude(t => t.OrderLines)
                .SingleOrDefaultAsync(s => s.Id == id);

            if (!shipment.Conducted)
            {
                shipment.Order.Status = OrderStatus.Sent;
                shipment.Conducted = true;

                _unitOfWork.Shipments.Update(shipment);
                await _unitOfWork.SaveChangesAsync();
            }
            return Mapper.Map<ShipmentDto>(shipment);
        }


        public void Put(string id, ShipmentDto dto)
        {
            _activityLog.Post(id, ActivityType.Update);

            var customer = _unitOfWork.Shipments.SingleOrDefault(w => w.Id == dto.Id);
            Mapper.Map(dto, customer);

            if (id != customer.Id)
            {
                return;
            }

            //customer.DateModified = DateTime.UtcNow;
            _unitOfWork.Shipments.Update(customer);

            try
            {
                _unitOfWork.SaveChanges();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (_unitOfWork.Shipments.Any(e => e.Id == id))
                {
                    throw;
                }
            }
        }


        public bool Delete(string id)
        {
            _activityLog.Post(id, ActivityType.Delete);

            _logger.LogDebug(LoggingEvents.DeleteItem, $"Видалення клієнта з ID={id}");
            var customer = _unitOfWork.Shipments.SingleOrDefault(m => m.Id == id);
            if (customer == null)
            {
                _logger.LogWarning(LoggingEvents.GetItemNotfound, $"Клієнт з ID={id} не знайдено");
                return false;
            }
            try
            {
                _unitOfWork.Shipments.Remove(customer);
                _unitOfWork.SaveChanges();
                _logger.LogInformation(LoggingEvents.DeleteItemSuccess, $"Клієнт з ID={id} видалено успішно");
                return true;
            }
            catch (Exception e)
            {
                _logger.LogError(LoggingEvents.DeleteItemError, e, $"Проблема при клієнта товару з ID={id}");
                return false;
            }
        }


        //private void WriteOffStorage(Order order)
        //{
        //    try
        //    {
        //        foreach (var orderProduct in order.OrderLines)
        //        {
        //            var shipment = new Shipment()
        //            {
                        
        //            };


        //            var product = _unitOfWork.Products.SingleOrDefault(w => w.Id == orderProduct.ProductId);

        //            _logger.LogDebug($"Post Order:: Product UnitsInStock {product.UnitsInStock}");
        //            product.UnitsInStock -= orderProduct.Quantity;
        //            _logger.LogDebug($"Post Order:: Product UnitsInStock after {product.UnitsInStock}");

        //            _unitOfWork.Products.Update(product);
        //        }

        //        _unitOfWork.SaveChanges();
        //        _logger.LogDebug($"Post Order:: {order.Id}");
        //    }
        //    catch (Exception)
        //    {
        //        // ignored
        //    }
        //}
    }
}