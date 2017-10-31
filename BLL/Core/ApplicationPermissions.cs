using System.Collections.Generic;
using System.Linq;
using System.Collections.ObjectModel;

namespace BLL.Core
{
    public static class ApplicationPermissions
    {
        public static ReadOnlyCollection<ApplicationPermission> AllPermissions;


        public const string UsersPermissionGroupName = "User Permissions";
        public static ApplicationPermission ViewUsers = new ApplicationPermission("View Users", "users.view", UsersPermissionGroupName, "Permission to view other users account details");
        public static ApplicationPermission ManageUsers = new ApplicationPermission("Manage Users", "users.manage", UsersPermissionGroupName, "Permission to create, delete and modify other users account details");

        public const string RolesPermissionGroupName = "Role Permissions";
        public static ApplicationPermission ViewRoles = new ApplicationPermission("View Roles", "roles.view", RolesPermissionGroupName, "Permission to view available roles");
        public static ApplicationPermission ManageRoles = new ApplicationPermission("Manage Roles", "roles.manage", RolesPermissionGroupName, "Permission to create, delete and modify roles");
        public static ApplicationPermission AssignRoles = new ApplicationPermission("Assign Roles", "roles.assign", RolesPermissionGroupName, "Permission to assign roles to users");

        public const string ProductsPermissionGroupName = "Products Permissions";
        public static ApplicationPermission CreateProduct = new ApplicationPermission("Create Products", "products.create", ProductsPermissionGroupName, "Permission to create products");
        public static ApplicationPermission ReadProduct = new ApplicationPermission("Read Products", "products.read", ProductsPermissionGroupName, "Permission to view products");
        public static ApplicationPermission UpdateProduct = new ApplicationPermission("Update Products", "products.update", ProductsPermissionGroupName, "Permission to modify products");
        public static ApplicationPermission DeleteProduct = new ApplicationPermission("Delete Products", "products.delete", ProductsPermissionGroupName, "Permission to delete products");


        public const string OrdersPermissionGroupName = "Orders Permissions";
        public static ApplicationPermission CreateOrder = new ApplicationPermission("Create Orders", "orders.create", OrdersPermissionGroupName, "Permission to create orders");
        public static ApplicationPermission ReadOrder = new ApplicationPermission("Read Orders", "orders.read", OrdersPermissionGroupName, "Permission to view orders");
        public static ApplicationPermission UpdateOrder = new ApplicationPermission("Update Orders", "orders.update", OrdersPermissionGroupName, "Permission to modify orders");
        public static ApplicationPermission DeleteOrder = new ApplicationPermission("Delete Orders", "orders.delete", OrdersPermissionGroupName, "Permission to delete orders");


        static ApplicationPermissions()
        {
            List<ApplicationPermission> allPermissions = new List<ApplicationPermission>()
            {
                ViewUsers,
                ManageUsers,

                ViewRoles,
                ManageRoles,
                AssignRoles,

                CreateProduct, ReadProduct, UpdateProduct, DeleteProduct,

                CreateOrder, ReadOrder, UpdateOrder, DeleteOrder
            };

            AllPermissions = allPermissions.AsReadOnly();
        }

        public static ApplicationPermission GetPermissionByName(string permissionName)
        {
            return AllPermissions.FirstOrDefault(p => p.Name == permissionName);
        }

        public static ApplicationPermission GetPermissionByValue(string permissionValue)
        {
            return AllPermissions.FirstOrDefault(p => p.Value == permissionValue);
        }

        public static string[] GetAllPermissionValues()
        {
            return AllPermissions.Select(p => p.Value).ToArray();
        }
    }





    public class ApplicationPermission
    {
        public ApplicationPermission()
        { }

        public ApplicationPermission(string name, string value, string groupName, string description = null)
        {
            Name = name;
            Value = value;
            GroupName = groupName;
            Description = description;
        }



        public string Name { get; set; }
        public string Value { get; set; }
        public string GroupName { get; set; }
        public string Description { get; set; }


        public override string ToString()
        {
            return Value;
        }


        public static implicit operator string(ApplicationPermission permission)
        {
            return permission.Value;
        }
    }
}