using System.ComponentModel.DataAnnotations;

// For displaying course name and code

namespace api.DTO
{
    public class CourseResponseDto
    {
        public int Id { get; set; }
        public string Code { get; set; } = string.Empty;
        public string Name { get; set; } = string.Empty;
    }
}