using System.ComponentModel.DataAnnotations;
using System.Dynamic;

// Sends quiz to client for the user to take

namespace api.DTO
{
    public class TakeQuizDto
    {
        public int Id { get; set; }
        public string Title { get; set; } = string.Empty;
        public string CourseCode { get; set; } = string.Empty;
        public List<TakeQuizQuestionDto> Questions { get; set; } = new();
    }
    public class TakeQuizQuestionDto
    {
        public int Id { get; set; }
        public string Prompt { get; set; } = string.Empty;
        public decimal Points { get; set; }
        public int Order { get; set; }

    }
}