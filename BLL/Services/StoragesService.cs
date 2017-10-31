using System;
using System.Collections.Generic;
using System.Linq;
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
    public interface IStoragesService
    {
        IEnumerable<StorageDto> Get();
        StorageDto Get(string id);
        void Post(StorageDto dto);
        void Put(string id, StorageDto dto);
        bool Delete(string id);
    }

    public class StoragesService : IStoragesService
    {
        private readonly ApplicationDbContext _unitOfWork;
        readonly ILogger _logger;
        private readonly IHttpContextAccessor _httpContextAccessor;


        public StoragesService(ApplicationDbContext unitOfWork, ILogger<StoragesService> logger,
            IHttpContextAccessor httpContextAccessor)
        {
            _unitOfWork = unitOfWork;
            _logger = logger;
            _httpContextAccessor = httpContextAccessor;
        }

        public IEnumerable<StorageDto> Get()
        {
            var allCustomers = _unitOfWork.Storages.ToList();

            return Mapper.Map<IEnumerable<StorageDto>>(allCustomers);
        }

        public StorageDto Get(string id)
        {
            _logger.LogDebug(LoggingEvents.GetItem, $"Отримання клієнта по ID='{id}'.");
            var customer = _unitOfWork.Storages.SingleOrDefault(m => m.Id == id);

            if (customer == null)
            {
                _logger.LogWarning(LoggingEvents.GetItemNotfound, $"Клієнта з ID={id} не знайдено");
            }
            _logger.LogDebug(LoggingEvents.GetItem, $"Клієнт з ID={id} отриманий успішно."); /////
            return Mapper.Map<StorageDto>(customer);
        }

        public void Post(StorageDto dto)
        {
            var customer = new Storage();
            Mapper.Map(dto, customer);

            //customer.DateModified = DateTime.UtcNow;
            _unitOfWork.Storages.Update(customer);
            _unitOfWork.SaveChanges();
        }


        public void Put(string id, StorageDto dto)
        {
            var customer = _unitOfWork.Storages.SingleOrDefault(w => w.Id == dto.Id);
            Mapper.Map(dto, customer);

            if (id != customer.Id)
            {
                return;
            }

            //customer.DateModified = DateTime.UtcNow;
            _unitOfWork.Storages.Update(customer);

            try
            {
                _unitOfWork.SaveChanges();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (_unitOfWork.Storages.Any(e => e.Id == id))
                {
                    throw;
                }
            }
        }


        public bool Delete(string id)
        {
            _logger.LogDebug(LoggingEvents.DeleteItem, $"Видалення клієнта з ID={id}");
            var customer = _unitOfWork.Storages.SingleOrDefault(m => m.Id == id);
            if (customer == null)
            {
                _logger.LogWarning(LoggingEvents.GetItemNotfound, $"Клієнт з ID={id} не знайдено");
                return false;
            }
            try
            {
                _unitOfWork.Storages.Remove(customer);
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
    }
}