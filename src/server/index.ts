import express from "express";
import { Analytic } from "src/models/clashAnalytics/models";
import { Analytics } from "./Controllers/Analytics";
import fs from "fs";

var app: express.Application = express();

app.get("/api/analytic", async (req, res) => {
  const platform = req.query.platform as string;
  const summonerName = req.query.summonerName as string;
  const apiKey = req.query.apiKey as string;

  let analytics: Analytics = new Analytics(apiKey, platform, summonerName);

  let analytic: Analytic = await analytics.GetAnalytics();

  /* Guarda el archivo en formato json. */

  let json = JSON.stringify(analytic);
  fs.writeFile("analytics.json", json, "utf8", () => {});

  if (analytic) res.send("Process done.");
  else res.status(400).send("Something goes wrong.");
});

app.listen(3000, () => {
  console.log("App is listening on port 3000!");
});
