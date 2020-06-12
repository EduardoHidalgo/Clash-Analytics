import { RuneDTO } from "./RuneDTO";
import { ParticipantStatsDTO } from "./ParticipantStatsDTO";
import { ParticipantTimelineDTO } from "./ParticipantTimelineDTO";
import { MasteryDTO } from "./MasteryDTO";

export type ParticipantDTO = {
  participantId: number;

  championId: number;

  /** List of legacy Rune information. Not included for matches played with
   * Runes Reforged. */
  runes: RuneDTO[];

  /** Participant statistics. */
  stats: ParticipantStatsDTO;

  /** 100 for blue side. 200 for red side. */
  teamId: number;

  /** Participant timeline data. */
  timeline: ParticipantTimelineDTO;

  /** First Summoner Spell id. */
  spell1Id: number;

  /** Second Summoner Spell id. */
  spell2Id: number;

  /** Highest ranked tier achieved for the previous season in a specific subset
   * of queueIds, if any, otherwise null. Used to display border in game loading
   * screen. Please refer to the Ranked Info documentation */
  highestAchieveSeasonTier: RankedTier;

  /** List of legacy Mastery information. Not included for matches played with
   * Runes Reforged. */
  masteries: MasteryDTO[];
};

export type RankedTier =
  | "CHALLENGER"
  | "MASTER"
  | "DIAMOND"
  | "PLATINUM"
  | "GOLD"
  | "SILVER"
  | "BRONZE"
  | "UNRANKED";
