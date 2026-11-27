using System.ComponentModel.DataAnnotations;

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

        // TODO: hvordan definerer vi rolle? er student default og så lages lærerbrukere annerledes?
    }
}