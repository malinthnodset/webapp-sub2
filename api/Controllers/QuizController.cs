//TODO rename QuizAPIController

using api.Models;
using api.DAL;
using api.Services;
using api.ViewModels;
using api.DTO; 
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Mvc.Rendering;
using Microsoft.AspNetCore.Authorization;

namespace api.Controllers;


[ApiController]     
[Route("api/quizzes")]
public class QuizAPIController : ControllerBase
{
    private readonly IQuizRepository _quizRepository;
    private readonly ICourseRepository _courseRepository;
    private readonly ILogger<QuizAPIController> _logger;

    public QuizAPIController(IQuizRepository quizRepository, ICourseRepository courseRepository, ILogger<QuizAPIController> logger)
    {
        _quizRepository = quizRepository;
        _courseRepository = courseRepository;
        _logger = logger;
    }

   // GET: all quizzes (list)
   [HttpGet]
   public async Task<IActionResult> QuizList()
    //TODO tidy these comments:
    // 1. ask the repo for all quizzes
    // 2. optional error handling 404
    // 3. turn each quiz into a quizDto
    // 4. answer 200 OK with the list of QuizDtos
    {
        var quizzes = await _quizRepository.GetAllQuizzes();
        if (quizzes == null)
        {
            _logger.LogError("[QuizAPIController] Quiz list not found while executing _quizRepository.GetAllQuizzes()");
            return NotFound("Quiz list not found");
        }
    
        var quizDtos = quizzes.Select(quiz => new QuizDto
        {
            Id = quiz.Id,
            Title = quiz.Title,
            Description = quiz.Description,
            CourseId = quiz.CourseId,
            //TODO Coursename and questioncount below cannot included yet bc include() not in repository
            //CourseName = quiz.Course.Name,
            //QuestionCount = quiz.Questions.Count
        });
        return Ok(quizDtos);
    }

    // CREATE QUIZ
    // TODO: add this authorize --> [Authorize(Roles = "TEACHER")] // Sørger for at det kun er lærere som kan nå denne siden, til og med når den er direkte skrevet inn i URL.
    [HttpPost] 
    public async Task<IActionResult> Create([FromBody] CreateQuizDto createQuizDto)
    {
        var course = await _courseRepository.GetCourseById(createQuizDto.CourseId);
        if (course == null)
        {
            return BadRequest("Choose an existing course");
        }
        var newQuiz = new Quiz
        {
            Title = createQuizDto.Title,
            Description = createQuizDto.Description,
            CourseId = createQuizDto.CourseId,
            CreatedByStudentId = 1, // // TODO: logged-in user

            //Convert each Create-Quiz-Question-Dto to Quiz-Question
            Questions = createQuizDto.Questions.Select((q, i) => new QuizQuestion
            {
                Prompt = q.Prompt.Trim(),
                CorrectAnswer = q.CorrectAnswer.Trim(),
                Points = q.Points,
                Order = i + 1
            }).ToList()
        };

        bool returnOk = await _quizRepository.Create(newQuiz);
        if (!returnOk)
        {
            _logger.LogWarning("[QuizAPIController] Quiz creation failed {@quiz}", newQuiz);
            return StatusCode(500, "Internal server error");
        }

        var quizDto = new QuizDto
        {
            Id = newQuiz.Id,
            Title = newQuiz.Title,
            Description = newQuiz.Description,
            CourseId = newQuiz.CourseId,
            CourseName = course.Name,
            QuestionCount = newQuiz.Questions.Count
        };
        return Created($"/api/quizzes/{newQuiz.Id}", quizDto);
    }

        // DELETE: /api/quizzes/{id}
    [HttpDelete("{id}")]
    //TODO bring back ---> [Authorize(Roles = "TEACHER")]
    public async Task<IActionResult> Delete(int id)
    {
        bool returnOk = await _quizRepository.Delete(id);
        if (returnOk)
        {
            _logger.LogInformation("[QuizAPIController] Quiz {Id} was deleted", id);
            return NoContent();   // 204: deleted, nothing to send back
        }

        _logger.LogWarning("[QuizAPIController] Quiz deletion failed, quiz {Id} not found", id);
        return NotFound("Quiz not found");
    }

        // UPDATE - Put: /api/quizzes/{id}
    [HttpPut("{id}")]
    //TODO bring back--->[Authorize(Roles = "TEACHER")]
    public async Task<IActionResult> Update(int id, [FromBody] CreateQuizDto quizDto)
    {
        var quiz = await _quizRepository.GetQuizById(id);
        if (quiz == null)
        {
            _logger.LogWarning("[QuizAPIController] Update failed, quiz {id} not found", id);
            return NotFound("Quiz not found");
        }

        var course = await _courseRepository.GetCourseById(quizDto.CourseId);
        if (course == null)
        {
            return BadRequest("Choose an existing course");
        }
        quiz.Title = quizDto.Title;
        quiz.Description = quizDto.Description;
        quiz.CourseId = quizDto.CourseId;

        bool returnOk = await _quizRepository.Update(quiz);
        if (returnOk)
        {
            _logger.LogInformation("[QuizAPIController] Quiz {@quiz} was updated", quiz);
            return NoContent(); //204: success, nothing to send back
        }

        _logger.LogWarning("[QuizAPIController] Quiz update failed for quiz {Id}", id);
        return StatusCode(500, "Internal server error");

    }

}




/// Old controller ------------------------------

//TODO bring back authorize (following demo 9 does this) 
// [Authorize]//If the user tries to access the quiz page without being logged in, they get redirected to the Login-path; fail-safe default and complete mediation
public class QuizController : Controller
{
    // dependency injection - controller looks to interface repository files, and the service
    private readonly IQuizRepository _quizRepository;
    private readonly ICourseRepository _courseRepository;
    private readonly IQuizService _quizService;
    private readonly ILogger<QuizController> _logger;

    public QuizController(IQuizRepository quizRepository, IQuizService quizService, ILogger<QuizController> logger, ICourseRepository courseRepository)
    {
        _quizRepository = quizRepository;
        _quizService = quizService;
        _logger = logger;
        _courseRepository = courseRepository;
    }

    // CREATE QUIZ
    [Authorize(Roles = "TEACHER")] // Sørger for at det kun er lærere som kan nå denne siden, til og med når den er direkte skrevet inn i URL.
    [HttpGet] // Creation form
    public async Task<IActionResult> Create()
    {
        var vm = new CreateQuizViewModel();
        // for loop to start with 3 questions upon creation - more can be added in UI
        for (int i = 0; i < 3; i++)
        {
            vm.Question.Add(new Question());
        }
        await LoadCourses(vm);
        return View(vm);
    }

    // Submit the form to create the quiz
    [HttpPost]
    [ValidateAntiForgeryToken]
    [Authorize(Roles = "TEACHER")]
    public async Task<IActionResult> Create(CreateQuizViewModel vm)
    {
        if (vm.CourseId.HasValue && !await _courseRepository.CourseExists(vm.CourseId.Value))
        {
            ModelState.AddModelError(nameof(vm.CourseId), "Choose an existing course.");
        }

        if (ModelState.IsValid)
        {
            var quiz = new Quiz
            {
                Title = vm.Title,
                Description = vm.Description,
                CourseId = vm.CourseId.GetValueOrDefault(),
                CreatedByStudentId = 1,      // TODO: replace with logged-in student id when login exists!

                // the questions
                Questions = vm.Question.Select((q, i) => new QuizQuestion
                {
                    Prompt = q.Prompt.Trim(), // trims whitespace before grading
                    CorrectAnswer = q.CorrectAnswer.Trim(), // trims whitespace of correct answer
                    Points = q.Points,
                    Order = i + 1 // to make it start with Q1 instead of Q0
                }).ToList()
            };

            bool returnOk = await _quizRepository.Create(quiz);
            if (returnOk)
            {
                return RedirectToAction("Index", "Dashboard");  // Index method in Dashboard controller
            }
        }
        // if modelstat invalid or creation in db failed
        _logger.LogWarning("[QuizController] Quiz creation failed {@vm}", vm);
        await LoadCourses(vm);       // dropdown list isn't posted back, so this reloads it
        return View(vm);           // redisplay with the user's input and error messages
    }

    // TODO: UPDATE QUIZ

    // DELETE QUIZ
    [HttpPost]
    [ValidateAntiForgeryToken]
    [Authorize(Roles = "TEACHER")]
    public async Task<IActionResult> Delete(int id)
    {
        bool returnOk = await _quizRepository.Delete(id);
        if (returnOk)
        {
            _logger.LogInformation("[QuizController] Quiz {@id} was deleted", id);
            return RedirectToAction("Index", "Dashboard");
        }
        _logger.LogWarning("[QuizController] Quiz deletion failed for quiz {@id}", id);
        return RedirectToAction("Index", "Dashboard");
    }

    // Helper method - Used by drop down menu on the create quiz-page
    private async Task LoadCourses(CreateQuizViewModel vm)
    {
        var courses = await _courseRepository.GetAllCourses();
        vm.Courses = new SelectList(courses, "Id", "Code");
    }

    // TAKE QUIZ
    [HttpGet]
    public async Task<IActionResult> Take(int id)
    {
        var quiz = await _quizService.GetQuizToTakeAsync(id);
        if (quiz == null)
        {
            _logger.LogError("[QuizController] Quiz id {@quiz} not found", id);
            return NotFound();
        }
        return View(quiz);
    }

    // Validate, grade and display results
    [HttpPost]
    [ValidateAntiForgeryToken]
    public async Task<IActionResult> Submit(TakeQuizViewModel submission)
    {
        var quiz = await _quizService.GetQuizToTakeAsync(submission.QuizId);
        if (quiz is null)
        {
            _logger.LogError("[QuizController] Quiz id {QuizId} for submission not found", submission.QuizId);
            return NotFound();
        }

        if (!ModelState.IsValid)
        {
            _logger.LogWarning("[QuizController] Quiz submission {QuizId} failed. Modelstate not valid.", submission.QuizId);

            // Preserve answers when reloading quiz to display validation errors
            foreach (var question in quiz.Questions)
            {
                // find a submission with the same question id as the quiz' question id
                var match = submission.Questions? // make the whole expression null if there's nothing posted
                    .FirstOrDefault(answer => answer.QuestionId == question.QuestionId);

                // if match != null, store the answer so it can be redisplayed
                question.SubmittedAnswer = match?.SubmittedAnswer;
            }

            return View("Take", quiz);
        }

        // If modelstate is valid, save and grade the attempt:

        // TODO: add logged in students ID 
        var studentId = 1;

        var result = await _quizService.GradeQuizAsync(submission, studentId);
        if (result == null)
        {
            _logger.LogWarning("[QuizController] Invalid submission for quiz {QuizId}", submission);
            return BadRequest();
        }
        // Carry the unlock info across redirect. TempData lives for exactly one request. 
        if (result.CatJustFreed)
        {
            TempData["CatFreed"] = true;
        }
        if (result.NewFurnitureName is not null)
        {
            TempData["NewFurnitureName"] = result.NewFurnitureName;
            TempData["NewFurnitureSlug"] = result.NewFurnitureSlug;
        }

        // Refreshing the result page does not submit the quiz again
        return RedirectToAction("Result", new { id = submission.QuizId });
    }

    // Dashboard: SHOW LATEST RESULT: open past results without retaking the quiz
    [HttpGet]
    public async Task<IActionResult> Result(int id)
    {
        var studentId = 1; // TODO: same logged-in student id as in Submit
        var result = await _quizService.GetLatestResultAsync(id, studentId);
        if (result == null)
        {
            _logger.LogWarning("[QuizController] No attempts found for quiz {QuizId}", id);
            return RedirectToAction("Take", new { id });   // no attempt yet -> take the quiz
        }
        return View(result);
    }


}