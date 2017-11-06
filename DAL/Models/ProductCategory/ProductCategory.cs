using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;

namespace DAL.Models
{
    public class ProductCategory
    {
        [Key]
        public string Id { get; set; } = SequentialGuidUtils.NewGuid().ToString();

        [MaxLength(6)]
        public string SequenceId { get; set; }

        public string Name { get; set; }
        public string ParentId { get; set; }

        public virtual ICollection<ProductCategory> Children { get; set; }
        public virtual ProductCategory Parent { get; set; }
    }
}
