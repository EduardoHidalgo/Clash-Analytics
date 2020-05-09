import { RiotAPI, RiotProps } from "../API/RiotAPI";
import { QueueId } from "src/models/dataDragon/Queue";
import { SummonerDTO } from "src/models/summoner/SummonerDTO";
import {
  ChampionFiltered,
  ChampionsFiltered,
  GamesList,
} from "../../models/clashAnalytics/models";
import {
  Analytic,
  GamesPerChampion,
  LaneGame,
  MasteryChampion,
  QueueGame,
  RolGame,
} from "src/models/clashAnalytics/models";

/** Clase encargada de realizar todos los procesos de Analytics. Consume las
 * peticiones de RiotAPI y convierte los datos obtenidos a nuevos modelos.
 */
export class Analytics {
  props: RiotProps;

  DataDragon: RiotAPI.DataDragon;
  ChampionMastery: RiotAPI.ChampionMastery;
  Match: RiotAPI.Match;
  Summoner: RiotAPI.Summoner;

  constructor(apiKey: string, platform: string, summonerName: string) {
    this.props = { apiKey, platform, summonerName };

    this.DataDragon = new RiotAPI.DataDragon();
    this.ChampionMastery = new RiotAPI.ChampionMastery(this.props);
    this.Match = new RiotAPI.Match(this.props);
    this.Summoner = new RiotAPI.Summoner(this.props);
  }

  private GetSummoner = async (): Promise<SummonerDTO> => {
    return await this.Summoner.GetSummoner();
  };

  private GetDataDragon = async (): Promise<{
    championsFiltered: ChampionsFiltered;
    queuesId: QueueId[];
  }> => {
    const champions = await this.DataDragon.GetChampions();
    const queuesId = await this.DataDragon.GetQueuesIds();

    /* Procesa los campeones y los convierte en otro modelo. */
    let championsFiltered: ChampionsFiltered = [];
    let objectArray = Object.entries(champions.data);

    objectArray.forEach(([key, value]) =>
      championsFiltered.push({
        championId: Number(value.key),
        name: value.name,
      })
    );

    return { championsFiltered, queuesId };
  };

  private GetMastery = async (
    summonerDTO: SummonerDTO,
    championsFiltered: ChampionFiltered[]
  ) => {
    const championMasteryDTO = await this.ChampionMastery.GetAllChampionMasteries(
      summonerDTO.id
    );
    const masteryScore = await this.ChampionMastery.GetMasteryScore(
      summonerDTO.id
    );

    let masteryChampions: MasteryChampion[] = [];

    /* Convierte la data de championMasteryDTO a MasteryChampion. */
    championMasteryDTO.forEach((mastery) => {
      let championExists = championsFiltered.filter((champ) => {
        return champ.championId === mastery.championId;
      });

      if (championExists) {
        masteryChampions.push({
          champion: championExists[0].name,
          championLevel: mastery.championLevel,
          championPoints: mastery.championPoints,
          lastPlayed: new Date(mastery.lastPlayTime),
        });
      } else
        console.log(`No existe un campeón con el id: ${mastery.championId}`);
    });

    return { masteryChampions, masteryScore };
  };

  private GetMatchList = async (
    summonerDTO: SummonerDTO,
    championsFiltered: ChampionFiltered[],
    queuesId: QueueId[],
    masteryChampions: MasteryChampion[]
  ) => {
    let matchList = await this.Match.GetMatchList(summonerDTO.accountId);

    let gamesList: GamesList = [];
    let totalGames = matchList.totalGames;
    let totalQueuesGames: QueueGame[] = [];
    let totalRolGames: RolGame[] = [];
    let totalLaneGames: LaneGame[] = [];
    let totalGamesPerChampion: GamesPerChampion[] = [];

    /* Obtiene todos los id's de cada partida. */
    matchList.matches.forEach((match) => {
      // if (match.queue == 700) gamesList.push(match.gameId);
      gamesList.push(match.gameId);
    });

    /* Remueve el conteo de campeones jugados menores al 2% del total. */
    let cap: number = (matchList.totalGames / 100) * 2;
    totalGamesPerChampion = totalGamesPerChampion.filter(
      (game) => game.total >= cap
    );

    /* Realiza el conteo de cada partida obtenida. */
    matchList.matches.forEach((match) => {
      /* Calcula los totales de cada tipo de partida. */
      let queueGame = totalQueuesGames.filter((game) => {
        return game.queue === match.queue;
      });

      if (queueGame[0]) {
        const index = totalQueuesGames.findIndex(
          (game) => game.queue === queueGame[0].queue
        );
        totalQueuesGames[index].total += 1;
      } else {
        totalQueuesGames.push({ queue: match.queue, total: 1 });
      }

      /* Calcula los totales de cada tipo de "role". */
      let rolGame = totalRolGames.filter((game) => {
        return game.role === match.role;
      });

      if (rolGame[0]) {
        const index = totalRolGames.findIndex(
          (game) => game.role === rolGame[0].role
        );
        totalRolGames[index].total += 1;
      } else {
        totalRolGames.push({ role: match.role, total: 1 });
      }

      /* Calcula los totales de cada tipo de "lane". */
      let laneGame = totalLaneGames.filter((game) => {
        return game.lane === match.lane;
      });

      if (laneGame[0]) {
        const index = totalLaneGames.findIndex(
          (game) => game.lane === laneGame[0].lane
        );
        totalLaneGames[index].total += 1;
      } else {
        totalLaneGames.push({ lane: match.lane, total: 1 });
      }

      /* Calcula los totales de cada tipo de "lane". */
      let gamePerChampion = totalGamesPerChampion.filter((game) => {
        return game.champion === match.champion;
      });

      if (gamePerChampion[0]) {
        const index = totalGamesPerChampion.findIndex(
          (game) => game.champion === gamePerChampion[0].champion
        );
        totalGamesPerChampion[index].total += 1;
      } else {
        totalGamesPerChampion.push({ champion: match.champion, total: 1 });
      }
    });

    /* Reemplaza el id de cada queue por el nombre de la queue. */
    totalQueuesGames.forEach((queueGame, index) => {
      let queueExists = queuesId.filter((queue) => {
        return queue.queueId === queueGame.queue;
      });

      if (queueExists[0]) {
        totalQueuesGames[index].queue = queueExists[0].description;
      }
      console.log(`No existe ese tipo de queue: ${queueGame.queue}`);
    });

    /* Reemplaza el id de cada "GamePerChampion" con el nombre del campeón. */
    totalGamesPerChampion.forEach((gamePerChampion, index) => {
      let championExists = championsFiltered.filter((champ) => {
        return champ.championId === gamePerChampion.champion;
      });

      if (championExists[0]) {
        totalGamesPerChampion[index].champion = championExists[0].name;
      } else
        console.log(
          `No existe un campeón con el id: ${gamePerChampion.champion}`
        );
    });

    /* Remueve maestrías menores de nivel 5. */
    masteryChampions = masteryChampions.filter(
      (mastery) => mastery.championLevel >= 5
    );

    /* Ordena las maestrías. */
    masteryChampions.sort((a, b) => {
      return b.championPoints - a.championPoints;
    });

    /* Ordena cada métrica de Analytic.match descendentemente.  */
    totalRolGames.sort((a, b) => {
      return b.total - a.total;
    });

    totalLaneGames.sort((a, b) => {
      return b.total - a.total;
    });

    totalGamesPerChampion.sort((a, b) => {
      return b.total - a.total;
    });

    return {
      gamesList,
      totalGames,
      totalQueuesGames,
      totalRolGames,
      totalLaneGames,
      totalGamesPerChampion,
    };
  };

  GetMatches = async (gamesList: GamesList) => {
    let matches = await this.Match.GetMatch(gamesList);

    return matches;
  };

  GetAnalytics = async () => {
    let summonerDTO: SummonerDTO = await this.GetSummoner();
    let { championsFiltered, queuesId } = await this.GetDataDragon();
    let { masteryChampions, masteryScore } = await this.GetMastery(
      summonerDTO,
      championsFiltered
    );
    let {
      gamesList,
      totalGames,
      totalQueuesGames,
      totalRolGames,
      totalLaneGames,
      totalGamesPerChampion,
    } = await this.GetMatchList(
      summonerDTO,
      championsFiltered,
      queuesId,
      masteryChampions
    );

    let counter: number = 0;

    counter += this.ChampionMastery.counterAPI;
    counter += this.Match.counterAPI;
    counter += this.Summoner.counterAPI;

    console.log("Peticiones realizadas: " + counter);

    let matches = await this.GetMatches(gamesList);

    /* Construye el objeto de respuesta. */
    let analytic: Analytic = {
      summoner: {
        summonerName: this.props.summonerName,
        summonerLevel: summonerDTO.summonerLevel,
      },
      championMastery: {
        masteryScore,
        masteryChampions,
      },
      match: {
        totalGames,
        totalQueuesGames,
        totalRolGames,
        totalLaneGames,
        totalGamesPerChampion,
      },
      matches,
    };

    return analytic;
  };
}
