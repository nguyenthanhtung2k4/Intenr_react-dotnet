export type Bowler = {
  BowlerId: number;
  isDelete: boolean;
  bowlerLastName: string;
  bowlerFirstName: string;
  bowlerMiddleInit: string | null;
  bowlerAddress: string;
  bowlerCity: string;
  bowlerState: string;
  bowlerZip: number;
  bowlerPhoneNumber: string;
  teamId: number;
  team: {
    teamID: number;
    teamName: string;
  };
};

export interface BowlerStatsData {
  bowlerId: number;
  bowlerName: string;
  teamId?: number;
  teamName?: string;
  totalGames: number;
  averageScore: number;
  highScore: number;
  totalPins: number;
  gamesWon: number;
}
