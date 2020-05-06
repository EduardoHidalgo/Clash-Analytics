import { MatchReferenceDTO } from "./MatchReferenceDTO";

export type MatchListDTO = {
  startIndex: number;
  totalGames: number;
  endIndex: number;
  matches: MatchReferenceDTO[];
};

export type MatchList = {
  totalGames: number;
  matches: MatchReferenceDTO[];
};
