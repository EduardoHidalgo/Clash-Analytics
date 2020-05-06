import { Fetch } from "./Fetch";
import { SummonerDTO } from "src/models/summoner/SummonerDTO";
import { ChampionMasteryDTO } from "src/models/championMastery/ChampionMasteryDTO";
import { Champion, Champions } from "src/models/dataDragon/Champion";

export type RiotProps = {
  apiKey: string;
  platform: string;
  summonerName: string;
};

/** Riot API.
 * @see https://developer.riotgames.com/apis
 */
export module RiotAPI {
  /** ChampionMastery endpoints.
   * @see https://developer.riotgames.com/apis#champion-mastery-v4
   */
  export class ChampionMastery {
    private apiKey: string;
    private platform: string;
    private summonerName: string;
    private riotURL: string;

    constructor(props: RiotProps) {
      this.apiKey = props.apiKey;
      this.platform = props.platform;
      this.summonerName = props.summonerName;
      this.riotURL = `https://${this.platform}.api.riotgames.com/lol/champion-mastery/v4`;
    }

    /** Get all champion mastery entries sorted by number of champion points
     * descending.
     *
     * @see https://developer.riotgames.com/apis#champion-mastery-v4/GET_getAllChampionMasteries
     */
    GetAllChampionMasteries = (encryptedSummonerId: string) => {
      const requestInfo: RequestInfo = `${this.riotURL}/champion-masteries/by-summoner/${encryptedSummonerId}`;
      return Fetch<ChampionMasteryDTO[]>(requestInfo, "GET", this.apiKey);
    };

    /** Get a player's total champion mastery score, which is the sum of
     * individual champion mastery levels.
     *
     * @see https://developer.riotgames.com/apis#champion-mastery-v4/GET_getChampionMasteryScore
     */
    GetMasteryScore = (encryptedSummonerId: string) => {
      const requestInfo: RequestInfo = `${this.riotURL}/scores/by-summoner/${encryptedSummonerId}`;
      return Fetch<number>(requestInfo, "GET", this.apiKey);
    };
  }

  /** Data Dragon endpoints.
   *  @see https://developer.riotgames.com/docs/lol#data-dragon
   */
  export class DataDragon {
    /** Get Data files for champions.
     * @see https://developer.riotgames.com/docs/lol#data-dragon_champions
     */
    GetChampions = () => {
      const requestInfo: RequestInfo = `http://ddragon.leagueoflegends.com/cdn/10.9.1/data/en_US/champion.json`;
      return Fetch<Champions>(requestInfo, "GET");
    };
  }

  /** Summoner endpoints.
   * @see https://developer.riotgames.com/apis#summoner-v4
   */
  export class Summoner {
    private apiKey: string;
    private platform: string;
    private summonerName: string;
    private riotURL: string;

    constructor(props: RiotProps) {
      this.apiKey = props.apiKey;
      this.platform = props.platform;
      this.summonerName = props.summonerName;
      this.riotURL = `https://${this.platform}.api.riotgames.com/lol/summoner/v4/summoners`;
    }

    /** Get a summoner by summoner name.
     * @see https://developer.riotgames.com/apis#summoner-v4/GET_getBySummonerName
     */
    GetSummoner = () => {
      const requestInfo: RequestInfo = `${this.riotURL}/by-name/${this.summonerName}`;
      return Fetch<SummonerDTO>(requestInfo, "GET", this.apiKey);
    };
  }
}
