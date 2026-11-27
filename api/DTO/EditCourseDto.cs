using System.ComponentModel.DataAnnotations;

namespace api.DTO
{
    public class EditCourseDto
    {
        [Required(ErrorMessage = "Course must have a course code")]
        [StringLength(10)]
        public string CourseCode { get; set; } = string.Empty;

        [Required(ErrorMessage = "Course must have a name")]
        [StringLength(200)]
        public string CourseName { get; set; } = string.Empty;
    }
}
