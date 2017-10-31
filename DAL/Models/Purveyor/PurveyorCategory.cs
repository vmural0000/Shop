namespace DAL.Models
{
    public class PurveyorCategory
    {
        public string SupplierId { get; set; } = SequentialGuidUtils.NewGuid().ToString();
        public string ProductCategoryId { get; set; }

        public virtual Purveyor Purveyor { get; set; }
        public virtual ProductCategory ProductCategory { get; set; }
    }
}
