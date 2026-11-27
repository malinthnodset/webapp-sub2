using System.ComponentModel.DataAnnotations;

// User submits their attempt with all their answers

namespace api.DTO
{
    public class SubmitQuizAttemptDto
    {
        // The list of the answers - requires answering minimum 1 question
        [Required]
        [MinLength(1, ErrorMessage = "An attempt must include answers.")]
        public List<SubmitQuizAnswerDto> Answers { get; set; } = [];

    }

    // Each individual answer
    public class SubmitQuizAnswerDto
    {
        [Range(1, int.MaxValue)]
        public int QuestionId { get; set; }

        // Max answer length - applies for text questions/answers
        [StringLength(2000)]
        public string? SubmittedAnswer { get; set; }
    }
}