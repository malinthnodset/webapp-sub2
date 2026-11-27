using System.ComponentModel.DataAnnotations;

namespace api.DTO
{
    // QUIZ
    public class CreateQuizDto
    {
        [Required(ErrorMessage = "The quiz must have a name.")]
        [StringLength(200)]
        public string Title { get; set; } = string.Empty;

        [StringLength(2000)]
        public string? Description { get; set; }

        // connecting to course (FK)
        [Range(1, int.MaxValue, ErrorMessage = "Choose a course.")]
        public int CourseId { get; set; }

        // Connect to questions (nav) - require >= 1 question
        [Required]
        [MinLength(1, ErrorMessage = "A quiz must have at least one question.")]
        public List<CreateQuizQuestionDto> Questions { get; set; } = [];
    }

    // QUESTIONS
    public class CreateQuizQuestionDto
    {
        [Required(ErrorMessage = "Please add a question.")]
        [StringLength(250)]
        public string Prompt { get; set; } = string.Empty;

        [Required(ErrorMessage = "Write the correct answer.")]
        [StringLength(250)]
        public string CorrectAnswer { get; set; } = string.Empty;

        [Range(0, 10)]
        public decimal Points { get; set; } = 1;
    }
}