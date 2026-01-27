export interface GameScoreDetail {
  gameNumber: number;
  oddTeamTotalScore: number;
  evenTeamTotalScore: number;
  winningTeamId?: number;
  bowlerScores: {
    bowlerId: number;
    bowlerName: string;
    teamId?: number;
    rawScore: number;
    handicapScore?: number;
    wonGame: boolean;
  }[];
}

export interface MatchScoreDetail {
  matchId: number;
  oddLaneTeam?: string;
  evenLaneTeam?: string;
  oddLaneTeamId?: number;
  evenLaneTeamId?: number;
  games: GameScoreDetail[];
}

export interface MatchScoreInput {
  matchId: number;
  gameNumber: number;
  scores: {
    bowlerId: number;
    rawScore: number;
    handicapScore?: number;
  }[];
}

export interface MatchData {
  matchId: number;
  tourneyLocation: string;
  tourneyDate: string;
  oddLaneTeam: string;
  evenLaneTeam: string;
  lanes: string;
  tourneyId?: number;
  oddLaneTeamId?: number;
  evenLaneTeamId?: number;
  hasResult?: boolean;
  winningTeamId?: number;
  winningTeamName?: string;
  oddLaneWins?: number;
  evenLaneWins?: number;
}

export interface MatchCreateData {
  tourneyId: number;
  lanes: string;
  oddLaneTeamId: number;
  evenLaneTeamId: number;
}
