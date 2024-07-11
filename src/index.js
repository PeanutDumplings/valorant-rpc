console.clear();

import { Client } from "discord-rpc";
import {
  createValorantApiClient,
  provideAuthViaLocalApi,
  provideClientVersionViaVAPI,
  provideLockFile,
  provideLogFile,
  useProviders,
} from "@tqman/valorant-api-client";

import fetchData from "./utils/fetchData.js";
import setPresence from "./utils/setPresence.js";

export const client = new Client({ transport: "ipc" });

const vapic = await createValorantApiClient({
  auth: useProviders(provideClientVersionViaVAPI()),
  local: useProviders(provideLockFile()),
  remote: useProviders([provideLogFile(), provideAuthViaLocalApi()]),
});

client.on("ready", () => {
  client.setActivity({
    details: "INITIALISING RPC",
    largeImageKey: "game_icon",
    largeImageText: `VALORANT`,
    startTimestamp: new Date(),
  });
});

client.login({ clientId: "1260470012536291418" });

setInterval(async () => {
  try {
    const result = await fetchData(vapic, vapic.remote.puuid);
    setPresence(result);
  } catch (error) {
    console.error(error);
  }
}, 1000);
