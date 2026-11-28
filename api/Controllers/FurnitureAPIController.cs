using api.Services;
using Microsoft.AspNetCore.Mvc;

namespace api.Controllers;
//TODO bring back after autorization is done (demo 9) --> [Authorize] 
[ApiController]
[Route("api/furniture")]

public class FurnitureAPIController : ControllerBase
{
    // dependency injection - controller looks to interface service files
    private readonly IFurnitureService _furnitureService;
    private readonly ILogger<FurnitureAPIController> _logger;

    public FurnitureAPIController(IFurnitureService furnitureService, ILogger<FurnitureAPIController> logger)
    {
        _furnitureService = furnitureService;
        _logger = logger;
    }

    [HttpGet("scene")]
    public async Task<IActionResult> GetScene()
    {
        var studentId = 1; //TODO from JWT when Sofie's auth is in
        
        var scene = await _furnitureService.GetSceneAsync(studentId);
        return Ok(scene);
    }
}