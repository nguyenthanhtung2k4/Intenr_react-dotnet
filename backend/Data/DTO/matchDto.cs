namespace Backend.Data.DTO;

public class matchDto
{
    public int TourneyId { get; set; }
    public string? Lanes { get; set; }
    public int? OddLaneTeamId { get; set; }
    public int? EvenLaneTeamId { get; set; }
} 
