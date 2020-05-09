export type ParticipantTimelineDTO = {
  participantId: number;

  /** Participant's calculated role. */
  role: string;

  /** Participant's calculated lane. MID and BOT are legacy values. */
  lane: string;

  /** Gold for a specified period. */
  goldPerMinDeltas: Object;

  /** Creeps for a specified period. */
  creepsPerMinDeltas: Object;

  /** Creep score difference versus the calculated lane opponent(s) for a
   * specified period. */
  csDiffPerMinDeltas: Object;

  /** Experience change for a specified period. */
  xpPerMinDeltas: Object;

  /** Experience difference versus the calculated lane opponent(s) for a
   * specified period. */
  xpDiffPerMinDeltas: Object;

  /** Damage taken for a specified period. */
  damageTakenPerMinDeltas: Object;

  /** Damage taken difference versus the calculated lane opponent(s) for a
   * specified period. */
  damageTakenDiffPerMinDeltas: Object;
};

export type Role = "DUO" | "NONE" | "SOLO" | "DUO_CARRY" | "DUO_SUPPORT";

export type Lane = "MID" | "MIDDLE" | "TOP" | "JUNGLE" | "BOT" | "BOTTOM";
