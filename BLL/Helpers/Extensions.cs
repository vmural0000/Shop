﻿using Microsoft.AspNetCore.Http;

namespace BLL.Helpers
{
    public static class Extensions
    {
        public static void AddPagination(this HttpResponse response, int currentPage, int itemsPerPage, int totalItems, int totalPages)
        {
            //var paginationHeader = new PageHeader(currentPage, itemsPerPage, totalItems, totalPages);

            //response.Headers.Add("Pagination", JsonConvert.SerializeObject(paginationHeader));

            // CORS
            //response.Headers.Add("access-control-expose-headers", "Pagination");
        }

        public static void AddApplicationError(this HttpResponse response, string message)
        {
            response.Headers.Add("Application-Error", message);
            // CORS
            //response.Headers.Add("access-control-expose-headers", "Application-Error");
        }
    }
}
