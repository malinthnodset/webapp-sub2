using System.ComponentModel.DataAnnotations;

namespace api.DTO
{
    public class LoginRequestDto
    {
        [Required, EmailAddress]
        public string Email { get; set; } = string.Empty;

        [Required]
        public string Password { get; set; } = string.Empty;
        public bool RememberMe { get; set; } // depends on persistent cookie authentication (kanskje slett)
    }
}