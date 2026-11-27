//TODO rename to CourseAPIController, remove unused using? 

using api.DAL;
using api.DTO;
using Microsoft.AspNetCore.Mvc;
using api.Models;
using Microsoft.AspNetCore.Authorization;
using api.ViewModels;

namespace api.Controllers;

//TODO bring back after autorization is done (demo 9) --> [Authorize]     //If the user tries to access the course page without being logged in, they get redirected to the Login-path; fail-safe default and complete mediation

[ApiController]
[Route("api/courses")]

public class CourseAPIController : ControllerBase
{
        // dependency injection - controller looks to interface repository files
    private readonly ICourseRepository _courseRepository; // create in DAL
    private readonly ILogger<QuizAPIController> _logger;

        public CourseAPIController(ILogger<QuizAPIController> logger, ICourseRepository courseRepository)
    {
        _logger = logger;
        _courseRepository = courseRepository;
    }

    //GET: /Course list
    [HttpGet]
    //[Authorize(Roles = "TEACHER")] // Sørger for at det kun er lærere som kan nå denne siden, til og med når den er direkte skrevet inn i URL.
   public async Task<IActionResult> CourseList()
    {
        var courses = await _courseRepository.GetAllCourses();
        if (courses == null)
        {
            _logger.LogError("[QuizAPIController] Quiz list not found while executing _quizRepository.GetAllQuizzes()");
            return NotFound("Quiz list not found");
        }
    
        var quizDtos = courses.Select(course => new CourseDto
        {
            Id = course.Id,
            Code = course.Code,
            Name = course.Name,
        });
        return Ok(quizDtos);
    }

        // POST: /Course/Create
    [HttpPost]
    //TODO bring back --> [Authorize(Roles = "TEACHER")]
    public async Task<IActionResult> Create([FromBody] CreateCourseDto createCourseDto)
    {
        if (createCourseDto == null)
        {
            return BadRequest("Course cannot be null");
        }
        var newCourse = new Course
        {
            Code = createCourseDto.Code,
            Name = createCourseDto.Name
        };
        bool returnOk = await _courseRepository.Create(newCourse);
        if (returnOk)
            return CreatedAtAction(nameof(CourseList), new { id = newCourse.Id }, newCourse);

        _logger.LogWarning("[CourseAPIController] Course creation failed {@course}", newCourse);
        return StatusCode(500, "Internal server error");
    }


        // UPDATE - GET: Edit/Get course by id
    [HttpGet("{id}")]
    //TODO add this back in--> [Authorize(Roles = "TEACHER")] // Sørger for at det kun er lærere som kan nå denne siden, til og med når den er direkte skrevet inn i URL.
    public async Task<IActionResult> GetById(int id)
    {
        var course = await _courseRepository.GetCourseById(id);
        if (course == null)
        {
            _logger.LogWarning("Edit requested for course {@id}, but it was not found", id);
            return NotFound();
        }

        var courseDto = new CourseDto
        {
            Id = course.Id,
            Code = course.Code,
            Name = course.Name
        };
        return Ok(courseDto);
    }

        // UPDATE - Put: /api/courses/{id}
    [HttpPut("{id}")]
    //TODO bring back--->[Authorize(Roles = "TEACHER")]
    public async Task<IActionResult> Update(int id, [FromBody] CreateCourseDto courseDto)
    {
        var course = await _courseRepository.GetCourseById(id);
        if (course == null)
        {
            _logger.LogWarning("[CourseAPIController] Update failed, course {id} not found", id);
            return NotFound("Course not found");
        }

        course.Code = courseDto.Code;
        course.Name = courseDto.Name;

        bool returnOk = await _courseRepository.Update(course);
        if (returnOk)
        {
            _logger.LogInformation("[CourseAPIController] Course {@course} was updated", course);
            return NoContent(); //204: success, nothing to send back
        }

        _logger.LogWarning("[CourseAPIController] Course update failed for course {Id}", id);
        return StatusCode(500, "Internal server error");

    }

        // DELETE - POST
    [HttpPost]
    [ValidateAntiForgeryToken]
    [Authorize(Roles = "TEACHER")]
    public async Task<IActionResult> Delete(int id)
    {
        bool returnOk = await _courseRepository.Delete(id);
        if (returnOk)
        {
            _logger.LogInformation("Course {@id} was deleted", id);
            return RedirectToAction("Index", "Dashboard");
        }
        _logger.LogWarning("Course deletion failed for course {@id}", id);
        return RedirectToAction("Index", "Dashboard");
    }
}





/// old controller: -----------------------------


public class CourseController : Controller
{
    // dependency injection - controller looks to interface repository files
    private readonly ICourseRepository _courseRepository; // create in DAL
    private readonly ILogger<QuizAPIController> _logger;

    public CourseController(ILogger<QuizAPIController> logger, ICourseRepository courseRepository)
    {
        _logger = logger;
        _courseRepository = courseRepository;
    }

    // GET: /Course/Create
    [HttpGet]
    [Authorize(Roles = "TEACHER")] // Sørger for at det kun er lærere som kan nå denne siden, til og med når den er direkte skrevet inn i URL.
    public IActionResult Create()
    {
        var vm = new CreateCourseViewModel();
        return View(vm);
    }

    // POST: /Course/Create
    [HttpPost]
    [ValidateAntiForgeryToken]
    [Authorize(Roles = "TEACHER")]
    public async Task<IActionResult> Create(CreateCourseViewModel vm)
    {
        if (ModelState.IsValid)
        {
            var course = new Course
            {
                Code = vm.CourseCode,
                Name = vm.CourseName
            };

            bool returnOk = await _courseRepository.Create(course);
            if (returnOk)
            {
                _logger.LogInformation("New course {@course} was created", course);
                return RedirectToAction("Index", "Dashboard");
            }
        }
        _logger.LogWarning("Course creation failed for course {@vm}", vm);
        return View(vm);
    }

    // UPDATE - GET: /Course/Edit
    [HttpGet]
    [Authorize(Roles = "TEACHER")] // Sørger for at det kun er lærere som kan nå denne siden, til og med når den er direkte skrevet inn i URL.
    public async Task<IActionResult> Edit(int id)
    {
        var course = await _courseRepository.GetCourseById(id);
        if (course == null)
        {
            _logger.LogWarning("Edit requested for course {@id}, but it was not found", id);
            return NotFound();
        }

        var vm = new EditCourseViewModel
        {
            Id = course.Id,
            CourseCode = course.Code,
            CourseName = course.Name
        };
        return View(vm);
    }

    // UPDATE - POST: /Course/Edit
    [HttpPost]
    [ValidateAntiForgeryToken]
    [Authorize(Roles = "TEACHER")]
    public async Task<IActionResult> Edit(EditCourseViewModel vm)
    {
        if (ModelState.IsValid)
        {
            var course = new Course
            {
                Id = vm.Id,
                Code = vm.CourseCode,
                Name = vm.CourseName
            };
            bool returnOk = await _courseRepository.Update(course);
            if (returnOk)
            {
                _logger.LogInformation("Course {@course} was updated", course);
                return RedirectToAction("Index", "Dashboard");
            }
        }
        _logger.LogWarning("Course update failed for course {@vm}", vm);
        return View(vm);
    }

    // DELETE - POST
    [HttpPost]
    [ValidateAntiForgeryToken]
    [Authorize(Roles = "TEACHER")]
    public async Task<IActionResult> Delete(int id)
    {
        bool returnOk = await _courseRepository.Delete(id);
        if (returnOk)
        {
            _logger.LogInformation("Course {@id} was deleted", id);
            return RedirectToAction("Index", "Dashboard");
        }
        _logger.LogWarning("Course deletion failed for course {@id}", id);
        return RedirectToAction("Index", "Dashboard");
    }
}