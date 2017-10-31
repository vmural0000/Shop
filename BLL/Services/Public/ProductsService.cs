using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using AutoMapper;
using BLL.DTO;
using DAL;
using Microsoft.EntityFrameworkCore;

namespace BLL.Services.Public
{
    public interface IProductsService
    {
        IEnumerable<ProductListDto> Get();
        Task<Tuple<int, IEnumerable<ProductListDto>>> GetAsync(int page, int pageSize);
        ProductDetailsDto Get(string article);
        IEnumerable<ProductListDto> GetLatestProducts();
        IEnumerable<ProductListDto> GetPopularProducts();
        IEnumerable<ProductListDto> GetOfferProduct();
        Task<Tuple<int, IEnumerable<ProductListDto>>> GetByCategory(string id, int page, int pageSize);
    }

    public class ProductsService : IProductsService
    {
        private readonly IUnitOfWork _context;
        private readonly ApplicationDbContext _db;

        public ProductsService(IUnitOfWork unitOfWork, ApplicationDbContext db)
        {
            _context = unitOfWork;
            _db = db;
        }


        public IEnumerable<ProductListDto> Get()
        {
            try
            {
                var data = _context.Products.GetAllProductsWithCategories().OrderByDescending(o => o.Name);

                var model = Mapper.Map<IEnumerable<ProductListDto>>(data);

                //foreach (var dto in model)
                //{
                //    dto.UnitsInStock = UnitsInStock(dto.Id);
                //}
                return model;
            }
            catch (Exception e)
            {
                return null;
            }
        }

        public async Task<Tuple<int, IEnumerable<ProductListDto>>> GetAsync(int page, int pageSize)
        {
            try
            {
                var count = await _db.Products.CountAsync();
                var data = await _db.Products.Include(c => c.ProductCategory).Skip((page - 1) * pageSize).Take(pageSize).ToListAsync();

                var model = Mapper.Map<IEnumerable<ProductListDto>>(data);

                //foreach (var dto in model)
                //{
                //    dto.UnitsInStock = UnitsInStock(dto.Id);
                //}
                return new Tuple<int, IEnumerable<ProductListDto>>(count, model);
            }
            catch (Exception e)
            {
                return new Tuple<int, IEnumerable<ProductListDto>>(0, null);
            }
        }

        public ProductDetailsDto Get(string article)
        {
            var product = _context.Products.GetAllProductsWithCategories().SingleOrDefault(m => m.Article == article);
            var model = Mapper.Map<ProductDetailsDto>(product);

            //model.UnitsInStock = UnitsInStock(article);
            //model.Images = Images(product.Id);
            return model;
        }


        public IEnumerable<ProductListDto> GetLatestProducts()
        {
            var product = _context.Products.GetAllProductsWithCategories().Take(3);
            var model = Mapper.Map<IEnumerable<ProductListDto>>(product);

            //model.UnitsInStock = UnitsInStock(article);
            //model.Images = Images(product.Id);
            return model;
        }

        public IEnumerable<ProductListDto> GetPopularProducts()
        {
            var product = _context.Products.GetAllProductsWithCategories().Take(3);
            var model = Mapper.Map<IEnumerable<ProductListDto>>(product);

            //model.UnitsInStock = UnitsInStock(article);
            //model.Images = Images(product.Id);
            return model;
        }

        public IEnumerable<ProductListDto> GetOfferProduct()
        {
            var product = _context.Products.GetAllProductsWithCategories().Take(3);
            var model = Mapper.Map<IEnumerable<ProductListDto>>(product);

            //model.UnitsInStock = UnitsInStock(article);
            //model.Images = Images(product.Id);
            return model;
        }



        public async Task<Tuple<int, IEnumerable<ProductListDto>>> GetByCategory(string id, int page, int pageSize)
        {
            var count = await _db.Products.CountAsync();
            var data = await _db.Products.Where(w => w.ProductCategory.SequenceId.StartsWith(id)).Skip((page - 1) * pageSize).Take(pageSize).ToListAsync();

            if (data.Count < 0)
                return null;

            var model = Mapper.Map<IEnumerable<ProductListDto>>(data);

            return new Tuple<int, IEnumerable<ProductListDto>>(count, model);
        }
    }
}