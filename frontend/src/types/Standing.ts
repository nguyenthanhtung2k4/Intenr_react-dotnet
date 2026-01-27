export interface StandingData {
  teamId: number;
  teamName: string;
  played: number;
  won: number;
  lost: number;
  points: number;
  totalPins?: number;
  average?: number;
}
