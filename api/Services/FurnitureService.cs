using Microsoft.EntityFrameworkCore;
using api.DAL;
using api.Models;
using api.DTO;

namespace api.Services;

public class FurnitureService : IFurnitureService
{
    private readonly QuizDbContext _db;
    private readonly ILogger<FurnitureService> _logger;

    public FurnitureService(QuizDbContext db, ILogger<FurnitureService> logger)
    {
        _db = db;
        _logger = logger;
    }


    private Task<int> CountAttemptedQuizzesAsync(int studentId) =>
        _db.QuizAttempts.CountAsync(a => a.StudentId == studentId);

    public async Task<UnlockResult> CheckUnlockAsync(int studentId)
    {
        var result = new UnlockResult();
        try
        {
            var completed = await CountAttemptedQuizzesAsync(studentId);
            result.CatJustFreed = UnlockRules.CatIsFree(completed) && !UnlockRules.CatIsFree(completed - 1);


            var owned = await _db.StudentFurnitures.CountAsync(sf => sf.StudentId == studentId);
            if (!UnlockRules.ShouldUnlockFurniture(completed, owned))
            {
                return result;
            }

            // First furniture (by SortOrder) that this student does not own yet
            var next = await _db.FurnitureItems
                .Where(f => !_db.StudentFurnitures.Any(sf => sf.StudentId == studentId && sf.FurnitureId == f.Id))
                .OrderBy(f => f.SortOrder)
                .FirstOrDefaultAsync();

            if (next is null)
            {
                return result; // everything is already unlocked 
            }


            _db.StudentFurnitures.Add(new StudentFurniture
            {
                StudentId = studentId,
                FurnitureId = next.Id,
                UnlockedAt = DateTime.UtcNow
            });
            await _db.SaveChangesAsync();

            result.NewFurniture = next;
            _logger.LogInformation("[FurnitureService] Student {StudentId} unlocked {Slug}", studentId, next.Slug);
        }
        catch (Exception ex)
        {
            // A failed unlock must never break grading
            _logger.LogError(ex, "[FurnitureService] Unlock check failed for student {StudentId}", studentId);
        }
        return result;
    }

    public async Task<SceneDto> GetSceneAsync(int studentId)
    {
        try
        {
            var completed = await CountAttemptedQuizzesAsync(studentId);
            var slugs = await _db.StudentFurnitures
                .AsNoTracking()
                .Where(sf => sf.StudentId == studentId)
                .OrderBy(sf => sf.Furniture.SortOrder)
                .Select(sf => sf.Furniture.Slug)
                .ToListAsync();

            return new SceneDto
            {
                CatOutOfBox = UnlockRules.CatIsFree(completed),
                FurnitureSlugs = slugs
            };
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "[FurnitureService] Could not load the scene for the student {StudentId}", studentId);
            return new SceneDto(); // empty room, but the site still works
        }
    }
}