import express from "express";
import { RiotAPI } from "./RiotAPI";
import { Platform } from "src/models/general/Platform";
import { SummonerDTO } from "src/models/summoner/SummonerDTO";
import { ChampionMasteryDTO } from "../models/championMastery/ChampionMasteryDTO";
import { Champions } from "../models/dataDragon/Champion";
import {
  ChampionsFiltered,
  Analytic,
  MasteryChampion,
} from "src/models/clashAnalytics/models";

var app: express.Application = express();

const platform: Platform = "LA1";
const summonerName: string = "changoleon88";
const apiKey: string = "RGAPI-ab4f68e7-be1f-4cbe-b7dd-e90b72a78413";

app.get("/api/", async (req, res) => {
  const props = { apiKey, platform, summonerName };

  let Summoner: RiotAPI.Summoner = new RiotAPI.Summoner(props);
  let ChampionMastery: RiotAPI.ChampionMastery = new RiotAPI.ChampionMastery(
    props
  );
  let DataDragon: RiotAPI.DataDragon = new RiotAPI.DataDragon();

  const summonerDTO: SummonerDTO = await Summoner.GetSummoner();

  const {
    championMasteryDTO,
    masteryScore,
    champions,
  }: {
    championMasteryDTO: ChampionMasteryDTO[];
    masteryScore: number;
    champions: Champions;
  } = await Promise.all([
    ChampionMastery.GetAllChampionMasteries(summonerDTO.id),
    ChampionMastery.GetMasteryScore(summonerDTO.id),
    DataDragon.GetChampions(),
  ]).then((result) => {
    return {
      championMasteryDTO: result[0],
      masteryScore: result[1],
      champions: result[2],
    };
  });

  /* Depuración de los datos. */

  let championsFiltered: ChampionsFiltered = [];

  const objectArray = Object.entries(champions.data);

  objectArray.forEach(([key, value]) =>
    championsFiltered.push({ championId: Number(value.key), name: value.name })
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
    } else console.log(`No existe un campeón con el id: ${mastery.championId}`);
  });

  let analytic: Analytic = {
    summonerName: summonerName,
    summonerLevel: summonerDTO.summonerLevel,
    masteryScore: masteryScore,
    masteryChampions: masteryChampions,
  };

  res.send(analytic);
});

app.listen(3000, () => {
  console.log("App is listening on port 3000!");
});
