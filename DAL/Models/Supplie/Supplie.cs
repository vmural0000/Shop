using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;

namespace DAL.Models
{
    public class Supplie : BaseModel
    {
        public string SupplieNumber { get; set; }

        public ICollection<SuplieLine> OrderLines { get; set; }



        [Required]
        public string PurveyorId { get; set; }
        [Required]
        public string StorageId { get; set; }
        [Required]
        public string ManagerId { get; set; }
    
        
        public virtual Purveyor Purveyor { get; set; }
        public virtual Storage Storage { get; set; }
        public virtual ApplicationUser Manager { get; set; }
    }
}
