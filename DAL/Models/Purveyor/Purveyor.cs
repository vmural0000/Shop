using System.ComponentModel.DataAnnotations;

namespace DAL.Models
{
    public class Purveyor
    {
        [Key]
        public string Id { get; set; } = SequentialGuidUtils.NewGuid().ToString();

        [Required]
        [StringLength(40, MinimumLength = 3)]
        public string Name { get; set; }

        [Required]
        [StringLength(100, MinimumLength = 6)]
        public string Email { get; set; }

        [StringLength(30)]
        public string Fax { get; set; }

        [Required]
        [StringLength(30, MinimumLength = 6)]
        public string Phone { get; set; }

        [StringLength(300)]
        public string PriceList { get; set; }
    }
}
