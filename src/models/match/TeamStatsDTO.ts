import { TeamsBansDTO } from "./TeamBansDTO";

export type TeamStatsDTO = {
  /** Number of towers the team destroyed. */
  towerKills: number;

  /** Number of times the team killed Rift Herald. */
  riftHeraldKills: number;

  /** Flag indicating whether or not the team scored the first blood. */
  firstBlood: boolean;

  /** Number of inhibitors the team destroyed. */
  inhibitorKills: number;

  /** If match queueId has a draft, contains banned champion data, otherwise
   * empty. */
  bans: TeamsBansDTO[];

  /** Flag indicating whether or not the team scored the first Baron kill. */
  firstBaron: boolean;

  /** Flag indicating whether or not the team scored the first Dragon kill. */
  firstDragon: boolean;

  /** For Dominion matches, specifies the points the team had at game end. */
  // dominionVictoryScore: number;

  /** Number of times the team killed Dragon. */
  dragonKills: number;

  /** Flag indicating whether or not the team destroyed the first inhibitor. */
  firstInhibitor: boolean;

  /** Flag indicating whether or not the team destroyed the first tower. */
  firstTower: boolean;

  /** Number of times the team killed Vilemaw. */
  // vilemawKills: number;

  /** Flag indicating whether or not the team scored the first Rift Herald
   * kill. */
  fisrtRiftHerald: boolean;

  /** 100 for blue side. 200 for red side. */
  teamId: number;

  /** String indicating whether or not the team won. There are only two values
   * visibile in public match history. (Legal values: Fail, Win) */
  win: string;
};
