// ensures a response that confirms auth, wihtout accidentally exposing sensitive data
using System.ComponentModel;
using System.ComponentModel.DataAnnotations;
using api.Models;

namespace api.DTO
{
    public class AuthSafeResponseDto
    {
        // Fields based on whats already used in frontend

        [Required]
        public string token { get; set; }

        [Required]
        public string name { get; set; }
        
        [Required]
        public string email { get; set; }

        [Required]
        public Role Role { get; set; } = Role.STUDENT;
    }
}