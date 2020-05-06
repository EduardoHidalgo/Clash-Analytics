import express from "express";
import { Analytic } from "src/models/clashAnalytics/models";
import { Analytics } from "./Analytics";

var app: express.Application = express();

app.get("/api/analytic", async (req, res) => {
  const platform = req.query.platform as string;
  const summonerName = req.query.summonerName as string;
  const apiKey = req.query.apiKey as string;

  let analytic: Analytic | null = await Analytics(
    apiKey,
    platform,
    summonerName
  );

  if (analytic) res.send(analytic);
  else res.status(400).send("Something goes wrong.");
});

app.listen(3000, () => {
  console.log("App is listening on port 3000!");
});
