using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace Backend.Data;

public partial class Team
{
    [Key]
    [DatabaseGenerated(DatabaseGeneratedOption.Identity)]
    public int TeamId { get; set; }

    public string? TeamName { get; set; } = null!;

    public int? CaptainId { get; set; }
    public bool IsDelete { get; set; } = false;

}
