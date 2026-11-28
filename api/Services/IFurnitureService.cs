using api.Models;
using api.DTO;

namespace api.Services;

public class UnlockResult
{
    public bool CatJustFreed { get; set; }
    public Furniture? NewFurniture { get; set; }
}

public interface IFurnitureService
{
    // Called after a quiz is attempt is saved. Returns what (if anything) was unlocked. 
    Task<UnlockResult> CheckUnlockAsync(int studentId);

    // What the room should look like for this student
    Task<SceneDto> GetSceneAsync(int studentId);
}