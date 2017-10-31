using Microsoft.Extensions.Logging;

namespace BLL.Helpers
{
    public static class LoggingEvents
    {
        public static readonly EventId INIT_DATABASE = new EventId(101, "Error whilst creating and seeding database");
        public static readonly EventId SEND_EMAIL = new EventId(201, "Error whilst sending email");

        public const int GenerateItems = 1000;
        public const int ListItems = 1001;
        public const int GetItem = 1002;
        public const int InsertItem = 1003;
        public const int UpdateItem = 1004;
        public const int DeleteItem = 1005;

        public const int CreateItemSuccess = 2000;
        public const int ReadItemSuccess = 2001;
        public const int UpdateItemSuccess = 2002;
        public const int DeleteItemSuccess = 2003;

        public const int GetItemNotfound = 4000;
        public const int UpdateItemNotfound = 4001;

        public const int CreateItemErorr = 5000;
        public const int GenerateItemsErorr = 5001;
        public const int UpdateItemError = 5005;
        public const int DeleteItemError = 5005;
    }
}
