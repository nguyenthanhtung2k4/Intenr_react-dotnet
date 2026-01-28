namespace Backend.Data.Services
{
      public interface ITokenService
      {
            string GenerateJwtToken(int userId, string role, string email);
      }
}
