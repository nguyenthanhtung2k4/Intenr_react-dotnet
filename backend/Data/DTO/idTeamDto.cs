using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System;

namespace Backend.Data
{
    public class idTeamDto
    {
        [Key]
        [DatabaseGenerated(DatabaseGeneratedOption.Identity)]
        public int BowlerId { get; set; }

        [Required]
        public string BowlerFirstName { get; set; } = string.Empty;

        [Required]
        public string BowlerLastName { get; set; } = string.Empty;

        public string? BowlerMiddleInit { get; set; }

        public string? BowlerAddress { get; set; }

        public string? BowlerCity { get; set; }

        public string? BowlerState { get; set; }

        public string? BowlerZip { get; set; }

        public string? BowlerPhoneNumber { get; set; }
        public bool? IsDelete { get; set; } = false;

        // 🔹 Đây là khóa ngoại — KHÔNG cần ForeignKey attribute
        public int? TeamId { get; set; }

        // 🔹 Navigation property
        public Team? Team { get; set; }

        public virtual ICollection<BowlerScore> BowlerScores { get; set; } = new List<BowlerScore>();
    }
}
