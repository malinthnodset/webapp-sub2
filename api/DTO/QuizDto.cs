using System.ComponentModel.DataAnnotations;

// Quiz details - for ??

// TODO make sure course id/code is correct type (str/int), double check cousetitle/name
namespace api.DTO
{
    public class QuizDto
    {
        public int Id { get; set; }
        public string Title { get; set; } = string.Empty;
        public string? Description { get; set; }
        public int CourseId { get; set; }
        public string CourseName { get; set; } = string.Empty;
        public int QuestionCount { get; set; }
    }
}