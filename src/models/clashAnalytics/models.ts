export type Analytic = {
  summonerName: string;
  summonerLevel: number;
  MasteryChampions: MasteryChampion[];
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
};
