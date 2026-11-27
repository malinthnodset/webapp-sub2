using System.ComponentModel.DataAnnotations;
// TODO make sure course id/code is correct type (str/int), double check cousetitle/name
namespace api.DTO
{
    public class CourseDto
    {
        public int Id { get; set; }
        public string Code { get; set; } = string.Empty;
        public string Name { get; set; } = string.Empty;
    }
}