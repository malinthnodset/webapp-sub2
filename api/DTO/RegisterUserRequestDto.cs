using System.ComponentModel.DataAnnotations;
using api.Models;

namespace api.DTO
{
    public class RegisterUserRequestDto
    {
        public string Name { get; set; } = string.Empty;

        [Required, EmailAddress]
        public string Email { get; set; } = string.Empty;

        [Required]
        public string Password { get; set; } = string.Empty;

        [Required]
        public string ConfirmPassword { get; set; } = string.Empty;

        // Student is default - teachers are generated differently (?)
        public Role Role { get; set; } = Role.STUDENT;
    }
}