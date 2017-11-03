using AutoMapper;
using BLL.Core;
using BLL.DTO.ProductCategory;
using DAL.Models;
using Microsoft.AspNetCore.Identity;

namespace BLL.DTO
{
    public class AutoMapperProfile : Profile
    {
        public AutoMapperProfile()
        {
            CreateMap<ApplicationUser, UserViewModel>()
                .ForMember(d => d.Roles, map => map.Ignore());
            CreateMap<UserViewModel, ApplicationUser>()
                .ForMember(d => d.Roles, map => map.Ignore());

            CreateMap<ApplicationUser, UserEditViewModel>()
                .ForMember(d => d.Roles, map => map.Ignore());
            CreateMap<UserEditViewModel, ApplicationUser>()
                .ForMember(d => d.Roles, map => map.Ignore());

            CreateMap<ApplicationUser, UserPatchViewModel>()
                .ReverseMap();

            CreateMap<ApplicationRole, RoleViewModel>()
                .ForMember(d => d.Permissions, map => map.MapFrom(s => s.Claims))
                .ForMember(d => d.UsersCount, map => map.ResolveUsing(s => s.Users?.Count ?? 0))
                .ReverseMap()
                .ForMember(d => d.Claims, map => map.Ignore());

            CreateMap<IdentityRoleClaim<string>, ClaimViewModel>()
                .ForMember(d => d.Type, map => map.MapFrom(s => s.ClaimType))
                .ForMember(d => d.Value, map => map.MapFrom(s => s.ClaimValue))
                .ReverseMap();

            CreateMap<ApplicationPermission, PermissionViewModel>()
                .ReverseMap();

            CreateMap<IdentityRoleClaim<string>, PermissionViewModel>()
                .ConvertUsing(s => Mapper.Map<PermissionViewModel>(ApplicationPermissions.GetPermissionByValue(s.ClaimValue)));

            CreateMap<Counterparty, CounterpartyDto>()
                .ReverseMap();

            CreateMap<Product, ProductListDto>()
                .ReverseMap();

            CreateMap<Product, ProductDetailsDto>()
                .ReverseMap();

            CreateMap<Product, ProductEditDto>()
                .ReverseMap();

            CreateMap<DAL.Models.ProductCategory, ProductCategoryDto>()
                .ReverseMap();

            CreateMap<DAL.Models.ProductCategory, CreateProductCategoryDto>()
                          .ReverseMap();


            CreateMap<Order, OrderListDto>()
                .ReverseMap();


            //CreateMap<OrderEditDTO, Order>()
            //    .ForMember(f => f.OrderLines, opt => opt.Ignore());

            CreateMap<Order, OrderEditDto>()
                .ReverseMap();

            CreateMap<OrderLine, OrderLineDTO>()
               .ReverseMap();

            CreateMap<Shipment, ShipmentDto>()
                .ForMember(f => f.OrderLines, map => map.MapFrom(s => s.Order.OrderLines))
               .ReverseMap();

            CreateMap<Storage, StorageDto>()
               .ReverseMap();

            CreateMap<ActivityLog, ActivityLogDto>()
               .ReverseMap();
        }
    }
}