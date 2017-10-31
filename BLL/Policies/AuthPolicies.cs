namespace BLL.Policies
{
    public class AuthPolicies
    {
        ///<summary>Policy to allow viewing all user records.</summary>
        public const string ViewUsersPolicy = "View Users";
        ///<summary>Policy to allow adding, removing and updating other user records.</summary>
        public const string ManageUsersPolicy = "Manage Users";

        /// <summary>Policy to allow viewing details of all roles.</summary>
        public const string ViewRolesPolicy = "View Roles";
        /// <summary>Policy to allow adding, removing and updating roles.</summary>
        public const string ManageRolesPolicy = "Manage Roles";


        /// <summary>Policy to allow create products.</summary>
        public const string CanCreateProductPolicy = "Create Products";
        /// <summary>Policy to allow view products.</summary>
        public const string CanReadProductPolicy = "Read Products";
        /// <summary>Policy to allow updating products.</summary>
        public const string CanUpdateProductPolicy = "Update Products";
        /// <summary>Policy to allow removing products.</summary>
        public const string CanDeleteProductPolicy = "Delete Products";


        /// <summary>Policy to allow create orders.</summary>
        public const string CanCreateOrderPolicy = "Create Orders";
        /// <summary>Policy to allow view orders.</summary>
        public const string CanReadOrderPolicy = "Read Orders";
        /// <summary>Policy to allow updating orders.</summary>
        public const string CanUpdateOrderPolicy = "Update Orders";
        /// <summary>Policy to allow removing orders.</summary>
        public const string CanDeleteOrderPolicy = "Delete Orders";
    }
}
