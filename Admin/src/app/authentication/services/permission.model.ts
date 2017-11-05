export type PermissionNames =
    "View Users" | "Manage Users" |
    "View Roles" | "Manage Roles" | "Assign Roles" |
    "Create Products" | "Read Products" | "Update Products" | "Delete Products" |
    "View Orders" | "Manage Orders";

export type PermissionValues =
    "users.view" | "users.manage" |
    "roles.view" | "roles.manage" | "roles.assign" |
    "products.create" | "products.read" | "products.update" | "products.delete" |
    "orders.create" | "orders.read" | "orders.update" | "orders.delete";

export class Permission {

    public static readonly viewUsersPermission: PermissionValues = "users.view";
    public static readonly manageUsersPermission: PermissionValues = "users.manage";

    public static readonly viewRolesPermission: PermissionValues = "roles.view";
    public static readonly manageRolesPermission: PermissionValues = "roles.manage";
    public static readonly assignRolesPermission: PermissionValues = "roles.assign";

    public static readonly createProductsPermission: PermissionValues = "products.create";
    public static readonly readProductsPermission: PermissionValues = "products.read";
    public static readonly updateProductsPermission: PermissionValues = "products.update";
    public static readonly deleteProductsPermission: PermissionValues = "products.delete";

    public static readonly createOrdersPermission: PermissionValues = "orders.create";
    public static readonly readOrdersPermission: PermissionValues = "orders.read";
    public static readonly updateOrdersPermission: PermissionValues = "orders.update";
    public static readonly deleteOrdersPermission: PermissionValues = "orders.delete";


    constructor(name?: PermissionNames, value?: PermissionValues, groupName?: string, description?: string) {
        this.name = name;
        this.value = value;
        this.groupName = groupName;
        this.description = description;
    }

    public name: PermissionNames;
    public value: PermissionValues;
    public groupName: string;
    public description: string;
}