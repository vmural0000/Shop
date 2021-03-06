﻿using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Net.Http;
using System.Net.Http.Headers;
using System.Text;
using System.Threading.Tasks;
using System.Web;
using DAL;
using BLL.DTO;
using AutoMapper;
using Microsoft.Extensions.Logging;
using BLL.Helpers;
using DAL.Models;
using Microsoft.EntityFrameworkCore;
using Newtonsoft.Json;

namespace BLL.Services
{
    public class CounterpartiesService : ICounterpartiesService
    {
        private readonly IUnitOfWork _unitOfWork;
        private readonly ApplicationDbContext _context;
        readonly ILogger _logger;


        public CounterpartiesService(IUnitOfWork unitOfWork, ApplicationDbContext context, ILogger<CounterpartiesService> logger)
        {
            _unitOfWork = unitOfWork;
            _context = context;
            _logger = logger;
        }

        public async Task<IEnumerable<CounterpartyDto>> Get()
        {
            var allCustomers = _unitOfWork.Customers.GetAllCustomersData();
            return Mapper.Map<IEnumerable<CounterpartyDto>>(allCustomers);
        }

        public CounterpartyDto Get(string id)
        {
            _logger.LogDebug(LoggingEvents.GetItem, $"Отримання клієнта по ID='{id}'.");
            var customer = _unitOfWork.Customers.GetCustomer(id);
            if (customer == null)
            {
                _logger.LogWarning(LoggingEvents.GetItemNotfound, $"Клієнта з ID={id} не знайдено");
            }
            _logger.LogDebug(LoggingEvents.GetItem, $"Клієнт з ID={id} отриманий успішно.");
            return Mapper.Map<CounterpartyDto>(customer);
        }

        public IEnumerable<CounterpartyDto> GetFromPhoneNumber(string phoneNumber)
        {
            _logger.LogDebug(LoggingEvents.GetItem, $"Отримання клієнтів по номеру телефону='{phoneNumber}'.");
            var customer = _unitOfWork.Customers.Find(w => w.PhoneNumber.Contains(phoneNumber));
            if (customer == null)
            {
                _logger.LogWarning(LoggingEvents.GetItemNotfound, $"Клієнтів з номером телефону={phoneNumber} не знайдено");
            }
            _logger.LogDebug(LoggingEvents.GetItem, $"Клієнти з номером телефону={phoneNumber} отримані успішно.");
            return Mapper.Map<IEnumerable<CounterpartyDto>>(customer);
        }

        public IEnumerable<string> GetFromName(string name)
        {
            _logger.LogDebug(LoggingEvents.GetItem, $"Отримання клієнтів по імені='{name}'.");
            var customer = _unitOfWork.Customers.Find(w => w.Name.Contains(name)).Select(s => s.Name).ToArray();
            _logger.LogDebug(LoggingEvents.GetItem, $"Клієнти з іменем={name} отримані успішно.");
            return customer;
        }

        public async Task<IEnumerable<Settlement>> GetCities(string city)
        {
            _logger.LogDebug(LoggingEvents.GetItem, $"Отримання клієнтів по місту='{city}'.");
            var customer = await _context.Settlements.Where(w => w.Description.Contains(city) || w.DescriptionRu.Contains(city)).OrderByDescending(o => o.Warehouse).ToListAsync();
            _logger.LogDebug(LoggingEvents.GetItem, $"Клієнти з містом={city} отримані успішно.");
            return customer;
        }

        public async Task<IEnumerable<Warehouse>> GetWarehouses(string city)
        {
            var customer = await _context.Warehouses.Where(w => w.CityDescription == city).ToListAsync();
            return customer;
        }

        public CounterpartyDto Post(CounterpartyDto dto)
        {
            _logger.LogDebug(LoggingEvents.UpdateItem, "Спроба додати нового клієнта.");
            var customer = new Counterparty();
            Mapper.Map(dto, customer);

            try
            {
                _unitOfWork.Customers.Add(customer);
                _unitOfWork.SaveChanges();
            }
            catch (Exception e)
            {
                _logger.LogError(LoggingEvents.CreateItemErorr, e, $"Виникла помилка при створенні нового клієнта {Utilities.ModelToJson(customer)}");
            }

            _logger.LogInformation(LoggingEvents.CreateItemSuccess, "Клієнта додано успішно!", customer);
            return Mapper.Map<CounterpartyDto>(customer);
        }

        public void Put(string id, CounterpartyDto dto)
        {
            var customer = _unitOfWork.Customers.GetAll().SingleOrDefault(w => w.Id == dto.Id);
            Mapper.Map(dto, customer);

            if (id != customer.Id)
            {
                return;
            }
            
            _unitOfWork.Customers.Update(customer);

            try
            {
                _unitOfWork.SaveChanges();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (_unitOfWork.Customers.GetAll().Any(e => e.Id == id))
                {
                    throw;
                }
            }
        }

        public bool Delete(string id)
        {
            _logger.LogDebug(LoggingEvents.DeleteItem, $"Видалення клієнта з ID={id}");
            var customer = _unitOfWork.Customers.GetAll().SingleOrDefault(m => m.Id == id);
            if (customer == null)
            {
                _logger.LogWarning(LoggingEvents.GetItemNotfound, $"Клієнт з ID={id} не знайдено");
                return false;
            }
            try
            {
                _unitOfWork.Customers.Remove(customer);
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
