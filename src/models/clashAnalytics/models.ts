import { MatchDTO } from "../match/MatchDTO";

export type Analytic = {
  summoner: {
    summonerName: string;
    summonerLevel: number;
  };
  championMastery: {
    masteryScore: number;
    masteryChampions: MasteryChampion[];
  };
  match?: {
    totalGames: number;
    totalQueuesGames: QueueGame[];
    totalRolGames: RolGame[];
    totalLaneGames: LaneGame[];
    totalGamesPerChampion: GamesPerChampion[];
  };
  matches: MatchDTO[];
};

export type ChampionFiltered = {
  championId: number;
  name: string;
};

export type ChampionsFiltered = ChampionFiltered[];

export type MasteryChampion = {
  champion: string;
  championLevel: number;
  championPoints: number;
  lastPlayed: Date;
};

export type QueueGame = {
  queue: number | string;
  total: number;
};

export type RolGame = {
  role: number | string;
  total: number;
};

export type LaneGame = {
  lane: number | string;
  total: number;
};

export type GamesPerChampion = {
  champion: number | string;
  total: number;
};

export type GamesList = number[];
