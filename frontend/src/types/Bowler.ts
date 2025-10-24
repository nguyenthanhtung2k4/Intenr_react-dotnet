export type Bowler = {
  bowlerId: number;
  IsDelete: boolean;
  bowlerLastName: string;
  bowlerFirstName: string;
  bowlerMiddleInit: string;
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
