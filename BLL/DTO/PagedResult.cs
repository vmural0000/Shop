using System;
using System.Collections.Generic;

namespace BLL.DTO
{
    public class PagedResult<T>
    {
        public List<T> Data { get; private set; }

        public PagingInfo Paging { get; private set; }

        public PagedResult(IEnumerable<T> items, int pageNo, int pageSize, long totalRecordCount)
        {
            Data = new List<T>(items);
            Paging = new PagingInfo(pageNo, pageSize, totalRecordCount,
                totalRecordCount > 0 ? (int)Math.Ceiling(totalRecordCount / (double)pageSize) : 0);
        }
    }
}
