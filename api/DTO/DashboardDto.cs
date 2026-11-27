//Defines the data shapes (DashboardViewModel, CourseSummaryViewModel, QuizSummaryViewModel) '
// that carry the dashboard data from the service to the view, including the "checkmarks" completion logic


namespace api.DTO
{
    public class DashboardDto
    {
        //Holds the list of courses passed to the dashboard view.
        public List<CourseSummaryDto> Courses { get; set; } = new();

        // Indicates whether the current user is a teacher or a student
        public bool IsTeacher { get; set; }
        public bool IsStudent { get; set; }
    }

    public class CourseSummaryDto
    {
        public int Id { get; set; }
        public string Title { get; set; } = "";

        //returns the number of quizzes in the course
        public int QuizCount => Quizzes.Count;

        //returns true if the course has at least one quiz and all quizzes are completed
        public bool IsCompleted => Quizzes.Count > 0 && Quizzes.All(q => q.IsCompleted);
        public List<QuizSummaryDto> Quizzes { get; set; } = new();
    }

    public class QuizSummaryDto
    {
        public int Id { get; set; }
        public string Title { get; set; } = "";
        public int QuestionCount { get; set; }
        public double BestPercentage { get; set; }   // 0-100
                                                     //returns true if the best percentage is 60 or higher
        public int AttemptCount { get; set; }
        public bool IsCompleted => BestPercentage >= 60;
        public bool HasAttempts => AttemptCount > 0;
    }

}