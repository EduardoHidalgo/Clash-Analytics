import { PlayerDTO } from "./PlayerDTO";

export type ParticipantIdentityDTO = {
  /** */
  participantId: number;

  /** Player information not included in the response for custom matches. Custom
   * matches are considered private unless a tournament code was used to create
   * the match. */
  player: PlayerDTO[];
};
