export type ParticipantStatsDTO = {
  participantId: number;
  win: boolean;

  kills: number;
  deaths: number;
  assists: number;

  goldEarned: number;
  goldSpent: number;

  champLevel: number;

  /* FIRST OBJECTIVES */

  firstBloodKill: boolean;
  firstBloodAssist: boolean;
  firstTowerKill: boolean;
  firstTowerAssist: boolean;
  firstInhibitorKill: boolean;
  firstInhibitorAssist: boolean;

  /* KILL SCORES */

  largestKillingSpree: number;
  largestMultiKill: number;
  killingSprees: number;
  longestTimeSpentLiving: number;

  doubleKills: number;
  tripleKills: number;
  quadraKills: number;
  pentakills: number;
  unrealKills: number;

  /* DAMAGE DEALT */

  totalDamageDealt: number;
  magicDamageDealt: number;
  physicalDamageDealt: number;
  trueDamageDealt: number;
  largestCriticalStrike: number;

  totalDamageDealtToChampions: number;
  magicDamageDealtToChampions: number;
  physicalDamageDealtToChampions: number;
  trueDamageDealtToChampions: number;

  damageDealtToObjectives: number;
  damageDealtToTurrets: number;
  timeCCingOthers: number;
  totalTimeCrowdControlDealt: number;

  /* HEAL */

  totalHeal: number;
  totalUnitsHealed: number;
  damageSelfMitigated: number;

  /* DAMAGE TAKEN */

  totalDamageTaken: number;
  magicalDamageTaken: number;
  physicalDamageTaken: number;
  trueDamageTaken: number;

  /* UNITS & STRUCTURES KILLED */

  turretKills: number;
  inhibitorKills: number;
  totalMinionsKilled: number;
  neutralMinionsKilled: number;
  neutralMinionsKilledTeamJungle: number;
  neutralMinionsKilledEnemyJungle: number;

  /* VISION STATS */

  visionScore: number;
  wardsPlaced: number;
  wardsKilled: number;
  visionWardsBoughtInGame: number;
  sightWardsBoughtInGame: number;

  /* OTHER GAMES STATS */

  combatPlayerScore: number;
  objectivePlayerScore: number;
  totalPlayerScore: number;
  totalScoreRank: number;

  nodeCaptureAssist: number;
  nodeNeutralizeAssist: number;
  nodeNeutralize: number;
  nodeCapture: number;
  teamObjective: number;
  altarsNeutralized: number;
  altarsCaptured: number;

  /* ITEMS */

  item0: number;
  item1: number;
  item2: number;
  item3: number;
  item4: number;
  item5: number;
  item6: number;

  /* SCORES */

  playerScore0: number;
  playerScore1: number;
  playerScore2: number;
  playerScore3: number;
  playerScore4: number;
  playerScore5: number;
  playerScore6: number;
  playerScore7: number;
  playerScore8: number;
  playerScore9: number;

  /* PERKS */

  /** Primary path keystone rune. */
  perk0: number;

  /** Post game rune stats. */
  perk0Var1: number;

  /** Post game rune stats. */
  perk0Var2: number;

  /** Post game rune stats. */
  perk0Var3: number;

  /** Primary path rune. */
  perk1: number;

  /** Post game rune stats. */
  perk1Var1: number;

  /** Post game rune stats. */
  perk1Var2: number;

  /** Post game rune stats. */
  perk1Var3: number;

  /** Primary path rune. */
  perk2: number;

  /** Post game rune stats. */
  perk2Var1: number;

  /** Post game rune stats. */
  perk2Var2: number;

  /** Post game rune stats. */
  perk2Var3: number;

  /** Primary path rune. */
  perk3: number;

  /** Post game rune stats. */
  perk3Var1: number;

  /** Post game rune stats. */
  perk3Var2: number;

  /** Post game rune stats. */
  perk3Var3: number;

  /** Secondary path rune. */
  perk4: number;

  /** Post game rune stats. */
  perk4Var1: number;

  /** Post game rune stats. */
  perk4Var2: number;

  /** Post game rune stats. */
  perk4Var3: number;

  /** Secondary path rune. */
  perk5: number;

  /** Post game rune stats. */
  perk5Var1: number;

  /** Post game rune stats. */
  perk5Var2: number;

  /** Post game rune stats. */
  perk5Var3: number;

  /** Primary rune path. */
  perkPrimaryStyle: number;

  /** Secondary rune path. */
  perkSubStyle: number;
};
