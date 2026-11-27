// ensures a response that confirms auth, wihtout accidentally exposing sensitive data
using api.Model;

namespace api.DTO
{
    public class AuthSafeResponseDto
    {
        // Fields based on whats already used in frontend
        public string token { get; set; }
        public string name { get; set; }
        public string email { get; set; }
       // public enum role

    }
}