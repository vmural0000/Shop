using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using AutoMapper;
using BLL.DTO;
using DAL;
using DAL.Models;
using BLL.Helpers;
using Microsoft.AspNetCore.Hosting;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.JsonPatch;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Logging;

namespace BLL.Services
{
    public class ProductsService : IProductsService
    {
        private readonly IUnitOfWork _context;
        private readonly ILogger _logger;
        private readonly IHostingEnvironment _env;
        private readonly IActivityLogService _activityLog;
        private readonly ApplicationDbContext _db;

        public ProductsService(IUnitOfWork unitOfWork, ILogger<ProductsService> logger, IHostingEnvironment env, IActivityLogService activityLog, ApplicationDbContext db)
        {
            _context = unitOfWork;
            _logger = logger;
            _env = env;
            _activityLog = activityLog;
            _db = db;
        }


        /// <summary>
        /// Отримання списку товарів
        /// </summary>
        /// <returns></returns>
        public IEnumerable<ProductListDto> Get()
        {
            _logger.LogDebug(LoggingEvents.GenerateItems, "Отримання списку товарів.");
            try
            {
                var data = _context.Products.GetAllProductsWithCategories().OrderByDescending(o => o.Name);
                _logger.LogDebug(LoggingEvents.GenerateItems, $"Отриманно {data.Count()} товарів.");

                var model = Mapper.Map<IEnumerable<ProductListDto>>(data);

                foreach (var dto in model)
                {
                    dto.UnitsInStock = UnitsInStock(dto.Id);
                }
                return model;
            }
            catch (Exception e)
            {
                _logger.LogError(LoggingEvents.GenerateItemsErorr, e, "Помилка при отримані списку товарів.");
                return null;
            }
        }

        /// <summary>
        /// Отримання списоку товарів посторінково
        /// </summary>
        /// <param name="page">Номер сторінки</param>
        /// <param name="pageSize">Ліміт елементів на сторінці</param>
        /// <returns></returns>
        public async Task<PagedResult<ProductListDto>> GetAsync(int page, int pageSize)
        {
            _logger.LogDebug(LoggingEvents.GenerateItems, "Отримання списку товарів.");
            try
            {
                var count = await _db.Products.CountAsync();
                var data = await _db.Products.Include(c => c.ProductCategory).Skip((page - 1) * pageSize).Take(pageSize).ToListAsync();
                _logger.LogDebug(LoggingEvents.GenerateItems, $"Отриманно {data.Count} товарів.");

                var model = Mapper.Map<IEnumerable<ProductListDto>>(data);

                foreach (var dto in model)
                {
                    dto.UnitsInStock = UnitsInStock(dto.Id);
                }
                return new PagedResult<ProductListDto>(model, page, pageSize, count);
            }
            catch (Exception e)
            {
                _logger.LogError(LoggingEvents.GenerateItemsErorr, e, "Помилка при отримані списку товарів.");
                return null;
            }
        }

        /// <summary>
        /// Отримання товару по ID
        /// </summary>
        /// <param name="id">ID товару</param>
        /// <returns></returns>
        public ProductDetailsDto Get(string id)
        {
            _activityLog.Post(id);
            _logger.LogDebug(LoggingEvents.GetItem, $"Отримання товару по ID='{id}'.");
            var product = _context.Products.GetAllProductsWithCategories().SingleOrDefault(m => m.Id == id);
            if (product == null)
            {
                _logger.LogWarning(LoggingEvents.GetItemNotfound, $"Товар з ID={id} не знайдено");
            }
            _logger.LogDebug(LoggingEvents.GetItem, $"Товар з ID={id} отримано успішно.");

            var model = Mapper.Map<ProductDetailsDto>(product);

            model.UnitsInStock = UnitsInStock(id);
            model.Images = Images(product.Id);
            return model;
        }

        /// <summary>
        /// Отримання товару по категорії
        /// </summary>
        /// <param name="id">ID категорії</param>
        /// <returns></returns>
        //public IEnumerable<ProductDetailsDto> GetByCategory(string id)
        //{
        //    _activityLog.Post(id, ActivityType.ReadList); //

        //    _logger.LogDebug(LoggingEvents.GenerateItems, $"Отримання товарів по категорії ID='{id}'.");
        //    var data = _context.Products.GetAllProductsWithCategories().Where(w => w.ProductCategory.SequenceId == id);
        //    if (data.Count() < 0)
        //    {
        //        _logger.LogWarning(LoggingEvents.GetItemNotfound, $"Товарів в категорії з ID={id} не знайдено");
        //        return null;
        //    }
        //    _logger.LogDebug(LoggingEvents.GenerateItems, $"Отриманно {data.Count()} товарів в категорії з ID={id}.");
        //    return Mapper.Map<IEnumerable<ProductDetailsDto>>(data);
        //}

        public async Task<Tuple<int, IEnumerable<ProductListDto>>> GetByCategory(string id, int page, int pageSize)
        {
            var count = await _db.Products.CountAsync();
            var data = await _db.Products.Where(w => w.ProductCategory.SequenceId.StartsWith(id)).Skip((page - 1) * pageSize).Take(pageSize).ToListAsync();

            if (data.Count < 0)
                return null;

            var model = Mapper.Map<IEnumerable<ProductListDto>>(data);

            return new Tuple<int, IEnumerable<ProductListDto>>(count, model);
        }

        /// <summary>
        /// Отримання товару по артикулу
        /// </summary>
        /// <param name="article">Артикул товару</param>
        /// <returns></returns>
        public ProductDetailsDto GetProductByArticle(string article)
        {
            _logger.LogDebug(LoggingEvents.GetItem, $"Отримання товару по артикулу '{article}'.");

            var product = _context.Products.GetAllProductsWithCategories().SingleOrDefault(m => m.Article == article);

            if (product == null)
            {
                return null;
            }

            return Mapper.Map<ProductDetailsDto>(product);
        }

        public ProductDetailsDto Post(ProductEditDto dto)
        {
            _logger.LogDebug(LoggingEvents.UpdateItem, "Спроба додати новий товар.");
            var product = new Product();
            Mapper.Map(dto, product);

            try
            {
                var category = _db.ProductCategories.SingleOrDefault(s => s.Id == product.ProductCategoryId);
                var products = _db.Products;

                product.Article = SequenceId(products, category.SequenceId);

                if (products.ToList().Any(o => o.Article == product.Article))
                {
                    _logger.LogWarning(LoggingEvents.CreateItemErorr, "Товар з таким арикулом вже існує, повтрюю спробу створити товар");
                    Post(dto);
                }

                _context.Products.Add(product);
                _context.SaveChanges();
                _activityLog.Post(product.Id, ActivityType.Create);

                _logger.LogInformation(LoggingEvents.CreateItemSuccess, "Товар додано успішно!", product);
            }
            catch (Exception e)
            {
                _logger.LogError(LoggingEvents.CreateItemErorr, e, $"Виникла помилка при створенні нового товару {Utilities.ModelToJson(product)}");
            }

            return Mapper.Map<ProductDetailsDto>(product);
        }

        public void Patch(string id, JsonPatchDocument<Product> product)
        {
            _activityLog.Post(id, ActivityType.Update);

            var model = _context.Products.GetSingleOrDefault(w => w.Id == id);

            if (model == null)
            {
                return;
            }

            // apply patch document
            product.ApplyTo(model);
            // save
        }

        public void Put(string id, ProductEditDto dto)
        {
            _activityLog.Post(id, ActivityType.Update);

            var product = _context.Products.Get(dto.Id);
            Mapper.Map(dto, product);

            if (id != product.Id)
            {
                return;
            }

            _context.Products.Update(product);

            try
            {
                _context.SaveChanges();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (_context.Products.GetAllProductsWithCategories().Any(e => e.Id == id))
                {
                    throw;
                }
            }
        }

        public bool Delete(string id)
        {
            _activityLog.Post(id, ActivityType.Delete);

            _logger.LogDebug(LoggingEvents.DeleteItem, $"Видалення товару з ID={id}");
            var product = _context.Products.GetAllProductsWithCategories().SingleOrDefault(m => m.Id == id);
            if (product == null)
            {
                _logger.LogWarning(LoggingEvents.GetItemNotfound, $"Товар з ID={id} не знайдено");
                return false;
            }
            try
            {
                _context.Products.Remove(product);
                var path = Path.Combine(_env.WebRootPath, "ProductImages", id.ToString());
                if (Directory.Exists(path))
                {
                    Directory.Delete(path, true);
                }
                _context.SaveChanges();

                _logger.LogInformation(LoggingEvents.DeleteItemSuccess, $"Товар з ID={id} видалено успішно");
                return true;
            }
            catch (Exception e)
            {
                _logger.LogError(LoggingEvents.DeleteItemError, e, $"Проблема при видалені товару з ID={id}");
                return false;
            }
        }




        public string ExportToJson(string id = null)
        {
            _activityLog.Post(null, ActivityType.Export);

            if (id != null)
                return Utilities.ModelToJson(_db.Products.SingleOrDefault(w => w.Id == id));
            return Utilities.ModelToJson(_db.Products);
        }

        public bool ImportFromJson(string data)
        {
            _activityLog.Post(null, ActivityType.Import);


            var model = Utilities.JsonToModel<IEnumerable<Product>>(data);

            foreach (var item in model)
            {
                if (item.ProductCategoryId != null)
                    item.ProductCategoryId = null;
            }

            _context.Products.AddRange(model);
            try
            {
                var result = _context.SaveChanges();
                return result > 0;

            }
            catch (Exception e)
            {
                Console.WriteLine(e);
                throw;
            }
        }


        public void Upload(string id, IFormCollection files)
        {
            var uploads = Path.Combine(_env.WebRootPath, "ProductImages", id.ToString());

            Directory.CreateDirectory(uploads);

            foreach (var file in files.Files)
            {
                var dbFile = new Image(file.FileName, id);
                if (file.Length > 0)
                {
                    var path = Path.Combine(uploads, dbFile.FileName);

                    using (var fileStream = new FileStream(path, FileMode.Create))
                    {
                        file.CopyTo(fileStream);
                    }
                    dbFile.FileName = dbFile.FileName;
                }
            }
        }

        public void DeleteImage(string id, string fileName)
        {
            var path = Path.Combine(_env.WebRootPath, "ProductImages", id, fileName);
            if (File.Exists(path))
                File.Delete(path);
        }

        /// <summary>
        /// Вирахування залишків товару
        /// </summary>
        /// <param name="productId">ID товару</param>
        /// <returns></returns>
        public int UnitsInStock(string productId)
        {
            var sal = _db.Shipments.Where(w => w.Conducted).Include(i => i.Order).ThenInclude(t => t.OrderLines).ToList();
            int sales = 0;
            foreach (var shipment in sal)
            {
                var y = shipment.Order.OrderLines.Where(w => w.ProductId == productId);
                sales += y.Sum(s => s.Quantity);
            }

            var suplies = _db.Supplies.Where(w => w.Conducted).Include(i => i.OrderLines);
            return suplies.Sum(c => c.OrderLines.Where(w => w.ProductId == productId).Sum(s => s.Quantity)) - sales;
        }

        /// <summary>
        /// Вирахування артикулу товару відносно категорії
        /// </summary>
        /// <param name="products">Список товарів</param>
        /// <param name="sequence">Ідентифікатор з категоріх</param>
        /// <returns></returns>
        private string SequenceId(IEnumerable<Product> products, string sequence)
        {
            switch (sequence.Length)
            {
                case 2:
                    sequence = sequence + "0000";
                    break;
                case 4:
                    sequence = sequence + "00";
                    break;
            }

            for (int i = 1; i < 999; i++)
            {
                string id = "";
                if (i < 10)
                    id = "00" + i;
                if (i > 10 && i < 100)
                    id = "0" + i;

                if (products.OrderBy(o => o.Article).All(a => a.Article != sequence + id))
                    return id;
            }
            return null;
        }


        ICollection<string> Images(string productId)
        {
            var path = Path.Combine(_env.WebRootPath, "ProductImages", productId);

            if (Directory.Exists(path))
            {
                List<string> list = new List<string>();
                foreach (var file in Directory.EnumerateFiles(path))
                {
                    list.Add(Path.GetFileName(file));
                }
                return list;
            }
            return null;
        }
    }
}