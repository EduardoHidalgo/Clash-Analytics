import { RiotAPI } from "./RiotAPI";
import { SummonerDTO } from "src/models/summoner/SummonerDTO";
import { ChampionMasteryDTO } from "../models/championMastery/ChampionMasteryDTO";
import { Champions } from "../models/dataDragon/Champion";
import {
  ChampionsFiltered,
  Analytic,
  MasteryChampion,
  QueueGame,
  RolGame,
  LaneGame,
  GamesPerChampion,
} from "src/models/clashAnalytics/models";
import { Queue } from "src/models/dataDragon/Queue";

export async function Analytics(
  apiKey: string,
  platform: string,
  summonerName: string
): Promise<Analytic | null> {
  const props = { apiKey, platform, summonerName };

  let Summoner: RiotAPI.Summoner = new RiotAPI.Summoner(props);
  let ChampionMastery: RiotAPI.ChampionMastery = new RiotAPI.ChampionMastery(
    props
  );
  let DataDragon: RiotAPI.DataDragon = new RiotAPI.DataDragon();
  let Match: RiotAPI.Match = new RiotAPI.Match(props);

  try {
    /* Summoner */
    const summonerDTO: SummonerDTO = await Summoner.GetSummoner().catch(
      (error) => {
        throw new Error(error);
      }
    );

    /* ChampionMastery */

    const {
      championMasteryDTO,
      masteryScore,
      champions,
      queues,
    }: {
      championMasteryDTO: ChampionMasteryDTO[];
      masteryScore: number;
      champions: Champions;
      queues: Queue[];
    } = await Promise.all([
      ChampionMastery.GetAllChampionMasteries(summonerDTO.id),
      ChampionMastery.GetMasteryScore(summonerDTO.id),
      DataDragon.GetChampions(),
      DataDragon.GetQueuesIds(),
    ])
      .then((result) => {
        return {
          championMasteryDTO: result[0],
          masteryScore: result[1],
          champions: result[2],
          queues: result[3],
        };
      })
      .catch((error) => {
        throw new Error(error);
      });

    let championsFiltered: ChampionsFiltered = [];

    const objectArray = Object.entries(champions.data);

    objectArray.forEach(([key, value]) =>
      championsFiltered.push({
        championId: Number(value.key),
        name: value.name,
      })
    );

    let masteryChampions: MasteryChampion[] = [];

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

    /* Match */

    let matchList = await Match.GetMatchList(summonerDTO.accountId);

    let totalQueuesGames: QueueGame[] = [];
    let totalRolGames: RolGame[] = [];
    let totalLaneGames: LaneGame[] = [];
    let totalGamesPerChampion: GamesPerChampion[] = [];

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
      let queueExists = queues.filter((queue) => {
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

    /* Remueve el conteo de campeones jugados menores al 2% del total. */
    let cap: number = (matchList.totalGames / 100) * 2;
    totalGamesPerChampion = totalGamesPerChampion.filter(
      (game) => game.total >= cap
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

    /* Construye el objeto de respuesta. */

    let analytic: Analytic = {
      summoner: {
        summonerName,
        summonerLevel: summonerDTO.summonerLevel,
      },
      championMastery: {
        masteryScore,
        masteryChampions,
      },
      match: {
        totalGames: matchList.totalGames,
        totalQueuesGames,
        totalRolGames,
        totalLaneGames,
        totalGamesPerChampion,
      },
    };
    return analytic;
  } catch (error) {
    console.log(error);
    return null;
  }
}
