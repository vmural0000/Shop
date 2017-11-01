using System;
using System.Collections.Generic;
using System.Text;

namespace BLL.DTO
{
    public class PagingInfo
    {
        public PagingInfo(int currentPage, int itemsPerPage, long totalItems, int totalPages)
        {
            CurrentPage = currentPage;
            ItemsPerPage = itemsPerPage;
            TotalItems = totalItems;
            TotalPages = totalPages;
        }


        public int CurrentPage { get; set; }
        public int ItemsPerPage { get; set; }
        public long TotalItems { get; set; }
        public int TotalPages { get; set; }
    }
}
