// ensures a response that confirms auth, wihtout accidentally exposing sensitive data
using System.ComponentModel;
using System.ComponentModel.DataAnnotations;
using api.Models;

namespace api.DTO
{
    public class AuthSafeResponseDto
    {
        // Fields based on whats already used in frontend
        public required string token { get; set; } // init instead of set?
        public required string name { get; set; }
        public required string email { get; set; }
        public required Role Role { get; set; } = Role.STUDENT; // TODO: make it either student/teacher
    }
}