using System.ComponentModel.DataAnnotations;

namespace Backend.Dtos
{
    public class TeamPostDto
    {
        [Required(ErrorMessage = "TeamName is required.")]
            [MaxLength(50)] 
        public string?  TeamName { get; set; }

        public int? CaptainId { get; set; }
    }
}