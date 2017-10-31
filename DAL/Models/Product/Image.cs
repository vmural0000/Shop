using System;
using System.IO;

namespace DAL.Models
{
    public class Image
    {
        public Image(string filename, string productId)
        {
            ProductId = productId;
            var hash = SequentialGuidUtils.NewGuid();
            var hashCode = string.Format("{0:X}", hash.GetHashCode());
            string extension = Path.GetExtension(filename);
            FileName = string.Format(@"{0}{1}{2}", DateTime.Now.Ticks, hashCode, extension);
        }

     
        public string ProductId { get; set; }
        public string FileName { get; set; }
    }
}
