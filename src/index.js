import { Client } from "discord-rpc";

export const client = new Client({ transport: "ipc" });
import { Agents, StandardMaps } from "./utils/constants.js";

client.on("ready", () => {
  client.setActivity({
    details: "Unrated \\\\ 1-4",
    largeImageKey: StandardMaps.Abyss,
    largeImageText: `Playing on ${Object.keys(StandardMaps).find(
      (key) => StandardMaps[key] === StandardMaps.Abyss
    )}`,
    smallImageKey: Agents.Brimstone,
    smallImageText: `Playing as ${Object.keys(Agents).find(
      (key) => Agents[key] === Agents.Brimstone
    )}`,
    state: "In a party",
    partySize: 1,
    partyMax: 5,

    startTimestamp: new Date(),
  });
});

// StandardMaps.find((key) => StandardMaps[key] === StandardMaps.Abyss);

client.login({ clientId: "1260470012536291418" });

console.clear();

import {
  createValorantApiClient,
  provideAuthViaLocalApi,
  provideClientVersionViaVAPI,
  provideLockFile,
  provideLogFile,
  useProviders,
} from "@tqman/valorant-api-client";
import fetchData from "./utils/fetchData.js";

(async () => {
  const vapic = await createValorantApiClient({
    auth: useProviders(provideClientVersionViaVAPI()),
    local: useProviders(provideLockFile()),
    remote: useProviders([provideLogFile(), provideAuthViaLocalApi()]),
  });

  const puuid = vapic.remote.puuid;

  setInterval(async () => {
    try {
      const result = await fetchData(vapic, puuid);
      console.log(result);
    } catch (error) {
      console.error("error");
    }
  }, 1500);
})();
