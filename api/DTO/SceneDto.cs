using System.ComponentModel.DataAnnotations;
namespace api.DTO
{
    public class SceneDto
    {
        public bool CatOutOfBox { get; set; }
        public List<string> FurnitureSlugs { get; set; } = new();
    }
}