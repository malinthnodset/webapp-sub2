using api.DAL;
using api.DTO;
using Microsoft.AspNetCore.Mvc;
using api.Models;

namespace api.Controllers;

//TODO bring back after autorization is done (demo 9) --> [Authorize]     //If the user tries to access the course page without being logged in, they get redirected to the Login-path; fail-safe default and complete mediation

[ApiController]
[Route("api/courses")]

public class CourseAPIController : ControllerBase
{
        // dependency injection - controller looks to interface repository files
    private readonly ICourseRepository _courseRepository; // create in DAL
    private readonly ILogger<CourseAPIController> _logger;

        public CourseAPIController(ILogger<CourseAPIController> logger, ICourseRepository courseRepository)
    {
        _logger = logger;
        _courseRepository = courseRepository;
    }

    //GET: /Course list
    [HttpGet]
    //TODO [Authorize(Roles = "TEACHER")] // Sørger for at det kun er lærere som kan nå denne siden, til og med når den er direkte skrevet inn i URL.
   public async Task<IActionResult> CourseList()
    {
        var courses = await _courseRepository.GetAllCourses();
        if (courses == null)
        {
            _logger.LogError("[CourseAPIController] Course list not found while executing _courseRepository.GetAllCourses()");
            return NotFound("Course list not found");
        }
    
        var courseDtos = courses.Select(course => new CourseDto
        {
            Id = course.Id,
            Code = course.Code,
            Name = course.Name,
        });
        return Ok(courseDtos);
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
        {
            var courseDto = new CourseDto
            {
                Id = newCourse.Id,
                Code = newCourse.Code,
                Name = newCourse.Name
            };
            return CreatedAtAction(nameof(GetById), new { id = newCourse.Id }, courseDto);
        }
        _logger.LogWarning("[CourseAPIController] Course creation failed {@course}", newCourse);
        return StatusCode(500, "Internal server error");
    }


        // UPDATE - GET: one course by id
    [HttpGet("{id}")]
    //TODO add this back in--> [Authorize(Roles = "TEACHER")] // Sørger for at det kun er lærere som kan nå denne siden, til og med når den er direkte skrevet inn i URL.
    public async Task<IActionResult> GetById(int id)
    {
        var course = await _courseRepository.GetCourseById(id);
        if (course == null)
        {
            _logger.LogWarning("Edit requested for course {id}, but it was not found", id);
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

        // DELETE: /api/courses/{id}
    [HttpDelete("{id}")]
    //TODO bring back ---> [Authorize(Roles = "TEACHER")]
    public async Task<IActionResult> Delete(int id)
    {
        bool returnOk = await _courseRepository.Delete(id);
        if (returnOk)
        {
            _logger.LogInformation("[CourseAPIController] Course {Id} was deleted", id);
            return NoContent();   // 204: deleted, nothing to send back
        }

        _logger.LogWarning("[CourseAPIController] Course deletion failed, course {Id} not found", id);
        return NotFound("Course not found");
    }
}

