using System;
using System.Collections.Generic;
using System.Collections.Immutable;
using System.IO;
using System.Linq;
using System.Xml;
using System.Xml.Serialization;
using Microsoft.EntityFrameworkCore;
using DAL;
using Microsoft.Extensions.Logging;
using DAL.Models;
using AutoMapper;
using BLL.DTO;
using BLL.DTO.ProductCategory;
using BLL.Helpers;
using Newtonsoft.Json;

namespace BLL.Services
{
    public class ProductCategoriesService : IProductCategoriesService
    {
        private readonly IUnitOfWork _context;
        private readonly ILogger _logger;

        public ProductCategoriesService(IUnitOfWork context, ILogger<ProductCategoriesService> logger)
        {
            _context = context;
            _logger = logger;
        }

        public List<ProductCategoryDto> Get()
        {
            var model = _context.ProductCategory.GetAllProductCategories().OrderBy(o => o.SequenceId);
            var tree = Tree();
            return Mapper.Map<List<ProductCategoryDto>>(model);
        }

        public IEnumerable<ProductCategoryDto> GetList()
        {
            //List<ProductCategoryDto> list = new List<ProductCategoryDto>();
            //var model = _context.ProductCategory.GetAllProductCategories();
            var tree = Tree();
            return Mapper.Map<IEnumerable<ProductCategoryDto>>(tree);
        }

        public IEnumerable<ProductCategoryDto> GetParent()
        {
            var model = _context.ProductCategory.GetAllProductCategories().Where(w => w.SequenceId.Length <= 4).OrderBy(o => o.SequenceId);
            return Mapper.Map<IEnumerable<ProductCategoryDto>>(model);
        }


        public ProductCategoryDto Get(string id)
        {
            var model = _context.ProductCategory.GetAllProductCategories().SingleOrDefault(m => m.Id == id);
            return Mapper.Map<ProductCategoryDto>(model);
        }

        public void Put(string id, EditProductCategoryDto dto)
        {
            var productCategory = _context.ProductCategory.Get(id);
            Mapper.Map(dto, productCategory);

            _context.ProductCategory.Update(productCategory);

            try
            {
                _context.SaveChanges();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!ProductCategoryExists(id))
                {
                    //return NotFound();
                }
                else
                {
                    throw;
                }
            }
        }

        public ProductCategoryDto Post(CreateProductCategoryDto dto)
        {
            //if(dto.SequenceId.lengh <= 4 )

            var productCategory = new ProductCategory();
            Mapper.Map(dto, productCategory);

            if (productCategory.ParentId == null)
            {
                var category = _context.ProductCategory.GetAllProductCategories();
                productCategory.SequenceId = SequenceId(category, null);
            }

            if (productCategory.ParentId != null)
            {
                var category = _context.ProductCategory.GetAllProductCategories().Where(w => w.ParentId == dto.ParentId);
                var parentSequenceId =
                    _context.ProductCategory.GetSingleOrDefault(w => w.Id == productCategory.ParentId).SequenceId;
                productCategory.SequenceId = parentSequenceId + SequenceId(category, parentSequenceId);
            }

            _context.ProductCategory.Add(productCategory);
            _context.SaveChanges();

            return Mapper.Map<ProductCategoryDto>(productCategory);
        }


        private string SequenceId(IEnumerable<ProductCategory> categories, string parentSequenceId)
        {
            for (int i = 1; i < 99; i++)
            {
                string id = "";
                if (i < 10)
                    id = "0" + i;

                if (categories.OrderBy(o => o.SequenceId).All(a => a.SequenceId != parentSequenceId + id))
                    return id;
            }
            return null;
        }

        public bool Delete(string id)
        {
            var productCategory = _context.ProductCategory.GetAllProductCategories().SingleOrDefault(m => m.Id == id);
            if (productCategory == null)
            {
                return false;
            }

            _context.ProductCategory.Remove(productCategory);
            _context.SaveChanges();

            return true;
        }

        private bool ProductCategoryExists(string id)
        {
            return _context.ProductCategory.GetAllProductCategories().Any(e => e.Id == id);
        }


        private List<ProductCategoryDto> Tree()
        {
            var colTreeNodes = new List<ProductCategoryDto>();
            foreach (var parent in _context.ProductCategory.GetAll().Where(w => w.ParentId == null).OrderBy(o => o.Name))
            {
                colTreeNodes.Add(new ProductCategoryDto
                {
                    Id = parent.Id,
                    Name = parent.Name,
                    SequenceId = parent.SequenceId,
                    ProductCategories = AddChildren(parent.ProductCategories)
                });
            }
            return colTreeNodes;
        }

        private List<ProductCategoryDto> AddChildren(ICollection<ProductCategory> child)
        {
            var colTreeNodes = new List<ProductCategoryDto>();
            if (child != null)
                foreach (var children in child.OrderBy(o => o.Name))
                {
                    colTreeNodes.Add(new ProductCategoryDto
                    {
                        Id = children.Id,
                        ParentId = children.ParentId,
                        Name = children.Name,
                        SequenceId = children.SequenceId,
                        ProductCategories = children.ProductCategories == null
                            ? new List<ProductCategoryDto>()
                            : AddChildren(children.ProductCategories)
                    });
                }

            return colTreeNodes;
        }


        string ExportToJson(string id = null)
        {
            string data;
            if (id == null)
                data = JsonConvert.SerializeObject(_context.ProductCategory.GetAllProductCategories());
            data = JsonConvert.SerializeObject(_context.ProductCategory.GetSingleOrDefault(w => w.Id == id));


            Utilities.ModelToJson(data);
            return data;
        }

        bool ImportFromJson(string data)
        {
            var model = JsonConvert.DeserializeObject<IEnumerable<ProductCategory>>(data);

            _context.ProductCategory.AddRange(model);
            var result = _context.SaveChanges();
            return result > 0;
        }

        string ExportToXml(string id = null)
        {
            IEnumerable<ProductCategory> data = _context.ProductCategory.GetAllProductCategories();
            //if (id == null)
            //    IEnumerable<ProductCategory> data = _context.ProductCategory.GetAllProductCategories();
            //else
            //    ProductCategory data = _context.ProductCategory.GetSingleOrDefault(w => w.Id == id);


            XmlSerializer xsSubmit = new XmlSerializer(typeof(ProductCategory[]));
            var subReq = new List<ProductCategory>();


            var xml = "";

            using (var sww = new StringWriter())
            {
                sww.Write(data);
                using (XmlWriter writer = XmlWriter.Create(sww))
                {
                    xsSubmit.Serialize(writer, subReq);
                    xml = sww.ToString(); // Your XML
                }
            }

            return xml;
        }

    }
}