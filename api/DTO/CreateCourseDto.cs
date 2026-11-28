using System.ComponentModel.DataAnnotations;

// Used both for creating new and editing existing courses

// Data Transfer Object - contains essentialy the same things as model, except navigation properties
namespace api.DTO
{
    public class CreateCourseDto
    {
        [Required(ErrorMessage = "Course must have a course code")]
        [StringLength(10)]
        public string Code { get; set; } = string.Empty;

        [Required(ErrorMessage = "Course must have a name")]
        [StringLength(200)]
        public string Name { get; set; } = string.Empty;

    }
}