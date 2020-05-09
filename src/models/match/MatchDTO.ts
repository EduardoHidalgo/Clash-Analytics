import { ParticipantIdentityDTO } from "./ParticipantIdentityDTO";
import { TeamStatsDTO } from "./TeamStatsDTO";
import { ParticipantDTO } from "./ParticipantDTO";

/**
 * @see https://developer.riotgames.com/apis#match-v4/GET_getMatch
 */
export type MatchDTO = {
  /** */
  gameId: number;

  /** Participant identity information. */
  participantIdentities: ParticipantIdentityDTO[];

  /** Please refer to the Game Constants documentation. */
  queueId: number;

  /** Please refer to the Game Constants documentation. */
  gameType: string;

  /** Match duration in seconds. */
  gameDuration: number;

  /** Team information. */
  teams: TeamStatsDTO[];

  /** Platform where the match was played. */
  platformId: string;

  /** Designates the timestamp when champion select ended and the loading screen
   * appeared, NOT when the game timer was at 0:00. */
  gameCreation: number;

  /** Please refer to the Game Constants documentation. */
  seasonId: number;

  /** The major.minor version typically indicates the patch the match was played
   * on. */
  gameVersion: string;

  /** Please refer to the Game Constants documentation. */
  mapId: number;

  /** Please refer to the Game Constants documentation. */
  gameMode: string;

  /** Participant information. */
  participants: ParticipantDTO[];
};
