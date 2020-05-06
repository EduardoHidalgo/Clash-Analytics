import { RequestInfo } from "node-fetch";
import { Fetch } from "./Fetch";
import { SummonerDTO } from "src/models/summoner/SummonerDTO";
import { ChampionMasteryDTO } from "src/models/championMastery/ChampionMasteryDTO";
import { Champions } from "src/models/dataDragon/Champion";
import { MatchListDTO, MatchList } from "src/models/match/MatchListDTO";
import { Queue } from "src/models/dataDragon/Queue";

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

    GetQueuesIds = () => {
      const requestInfo: RequestInfo = `http://static.developer.riotgames.com/docs/lol/queues.json`;
      return Fetch<Queue[]>(requestInfo, "GET");
    };
  }

  /** Match endpoints.
   *  @see https://developer.riotgames.com/apis#match-v4
   */
  export class Match {
    private apiKey: string;
    private platform: string;
    private riotURL: string;

    constructor(props: RiotProps) {
      this.apiKey = props.apiKey;
      this.platform = props.platform;
      this.riotURL = `https://${this.platform}.api.riotgames.com/lol/match/v4`;
    }

    private AdditionalMatchRequest = (beginIndex: number, endIndex: number) => {
      return `&beginIndex=${beginIndex}&endIndex=${endIndex}`;
    };

    private GetAdditionalMatchs = async (
      requestInfo: RequestInfo,
      res: MatchListDTO
    ) => {
      let matchList: MatchList = {
        totalGames: res.totalGames,
        matches: res.matches,
      };

      /* Si el usuario posee más de 100 partidas bajo la métrica inicial, obtiene el resto. */
      if (res.totalGames > 100) {
        /* Total de peticiones a realizar. */
        const totalRequests: number = (res.totalGames / 100) | 0;

        let Promises: Promise<MatchListDTO>[] = [];

        /* Crea el resto de peticiones. */
        for (let i = 1; i <= totalRequests; ++i) {
          let beginIndex = i * 100 + 1;
          let endIndex = (i + 1) * 100;

          if (i == totalRequests) endIndex = res.totalGames;

          /* Evita que la última iteración se rompa en caso que sea menor o 
          igual el beginIndex. */
          if (beginIndex >= endIndex) continue;

          const url: RequestInfo =
            requestInfo + this.AdditionalMatchRequest(beginIndex, endIndex);

          Promises.push(Fetch<MatchListDTO>(url, "GET", this.apiKey));
        }

        await Promise.all(Promises).then((additionalMatches) => {
          additionalMatches.forEach((list) => {
            if (list.matches.length > 0)
              list.matches.forEach((match) => matchList.matches.push(match));
          });
        });
      }

      return matchList;
    };

    private GetMatchsByQueue = async (requestInfo: RequestInfo) => {
      return Fetch<MatchListDTO>(requestInfo, "GET", this.apiKey).then(
        async (res) => {
          return await this.GetAdditionalMatchs(requestInfo, res);
        }
      );
    };

    /** Get matchlist for games played on given account ID and platform ID and
     * filtered using given filter parameters, if any.
     *
     * ### Implementation Notes:
     *
     * A number of optional parameters are provided for filtering. It is up to
     * the caller to ensure that the combination of filter parameters provided
     * is valid for the requested account, otherwise, no matches may be returned.
     * If beginIndex is specified, but not endIndex, then endIndex defaults to
     * beginIndex+100. If endIndex is specified, but not beginIndex, then
     * beginIndex defaults to 0. If both are specified, then endIndex must be
     * greater than beginIndex. The maximum range allowed is 100, otherwise a
     * 400 error code is returned. If beginTime is specified, but not endTime,
     * then endTime defaults to the the current unix timestamp in milliseconds
     * (the maximum time range limitation is not observed in this specific
     * case). If endTime is specified, but not beginTime, then beginTime defaults
     * to the start of the account's match history returning a 400 due to the
     * maximum time range limitation. If both are specified, then endTime should
     * be greater than beginTime. The maximum time range allowed is one week,
     * otherwise a 400 error code is returned.
     *
     * @see https://developer.riotgames.com/apis#match-v4/GET_getMatchlist
     */
    GetMatchList = async (encryptedAccountId: string): Promise<MatchList> => {
      const queue420: RequestInfo = `${this.riotURL}/matchlists/by-account/${encryptedAccountId}?queue=420&season=13`;
      const queue440: RequestInfo = `${this.riotURL}/matchlists/by-account/${encryptedAccountId}?queue=440&season=13`;

      return await Promise.all([
        this.GetMatchsByQueue(queue420),
        this.GetMatchsByQueue(queue440),
      ]).then((res) => {
        let matchList: MatchList = {
          matches: [],
          totalGames: 0,
        };

        res.forEach((list) => {
          matchList.totalGames += list.totalGames;
          list.matches.forEach((match) => matchList.matches.push(match));
        });

        return matchList;
      });
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
