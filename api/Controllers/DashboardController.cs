using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using api.Services;
using api.ViewModels;
using api.Models;
using System.Runtime.Versioning;
using api.DTO;
using System.Net;

//Handles the "Dashboard page" by asking DashboardService for the data and passing the result to the Index.cshtml

namespace api.Controllers;


//[Authorize] // Commented out for now - triggers the dashboard exception
[ApiController]
[Route("api/dashboard")]
public class DashboardAPIController : ControllerBase
{
    private readonly DashboardService _service;
    private readonly ILogger<DashboardAPIController> _logger;

    public DashboardAPIController(DashboardService service, ILogger<DashboardAPIController> logger)
    {
        _service = service;
        _logger = logger;
    }

    //Asks for the service for the dashboard data, and passes it to the view. If an error occurs, logs it and shows an error message.
    [HttpGet]
    public async Task<IActionResult> Index()
    {
        var userId = "1"; // TODO: replace with the logged-in user's id + verify
        // if (userId is null) // if not found in db
        // {
        //     return Unauthorized();
        // }

        try
        {
            // Get dashboard details for the logged in user
            var dashboard = await _service.GetDashboardAsync(userId);

            // Checks if the logged in user is a teacher or a student and assigns that to data
            dashboard.IsTeacher = User.IsInRole(nameof(Role.TEACHER));
            dashboard.IsStudent = User.IsInRole(nameof(Role.STUDENT));

            return Ok(dashboard);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Failed to load dashboard for user {userId}", userId);
            return StatusCode(500, "Internal server error"); // TODO: double check whats right to return
        }
    }
}