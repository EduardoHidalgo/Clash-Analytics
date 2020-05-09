export type PlayerDTO = {
  profileIcon: number;

  /** Player's current accountId (Encrypted) */
  accountId: string;

  matchHistoryUri: string;

  /** Player's current accountId (Encrypted) */
  currentAccountId: string;

  currentPlatformId: string;

  summonerName: string;

  /** Player's summonerId (Encrypted) */
  summonerId: string;

  /** Original platformId. */
  platformId: string;
};
