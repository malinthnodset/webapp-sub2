using System.ComponentModel.DataAnnotations;

namespace api.DTO
{
    // Results for the quiz in total
    public class QuizResultDto
    {
        public int QuizId { get; set; } // unsure if needed or via API?
        public string Title { get; set; } = string.Empty; // quiz title
        public string CourseCode { get; set; } = string.Empty;
        public string CourseTitle { get; set; } = string.Empty;
       
        //public int AttemptId { get; set; } // for db - unecessary?
        public int AttemptNumber { get; set; } // for display
        public DateTimeOffset CompletedAt { get; set; }
        public List<QuizAttemptHistoryDto> AttemptHistory { get; set; } = new();
        public decimal PointsEarned { get; set; }
        public decimal MaximumPoints { get; set; }
        public int CorrectAnswers { get; set; }
        public int TotalQuestions { get; set; }
        public decimal Percentage => MaximumPoints == 0
            ? 0
            : Math.Round(PointsEarned / MaximumPoints * 100, 2);

        // The cat + furniture the user earns
        public bool CatJustFreed { get; set; }
        public string? NewFurnitureName { get; set; }
        public string? NewFurnitureSlug { get; set; }

        // connect to submitted answers
        public List<QuizAnswerResultDto> Answers { get; set; } = [];
    }

    // Results for each individual question
    public class QuizAnswerResultDto
    {
        public int QuestionId { get; set; }
        public string Prompt { get; set; } = "";
        public string? SubmittedAnswer { get; set; }
        public string CorrectAnswer { get; set; } = "";
        public bool IsCorrect { get; set; }
        public decimal PointsAwarded { get; set; }
    }

    public class QuizAttemptHistoryDto
    {
        public int AttemptNumber { get; set; } // for display
        public DateTimeOffset CompletedAt { get; set; }
        public decimal PointsEarned { get; set; }
        public decimal MaximumPoints { get; set; }
        public decimal Percentage => MaximumPoints == 0
            ? 0
            : Math.Round(PointsEarned / MaximumPoints * 100, 2);
    }
}