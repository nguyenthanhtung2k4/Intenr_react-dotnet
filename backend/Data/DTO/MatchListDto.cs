namespace Backend.Data.DTO;

public class MatchListDto
{
      public int MatchId { get; set; }
      public string? TourneyLocation { get; set; }
      public DateOnly? TourneyDate { get; set; }
      public string? OddLaneTeam { get; set; }
      public string? EvenLaneTeam { get; set; }
      public string? Lanes { get; set; }
}
