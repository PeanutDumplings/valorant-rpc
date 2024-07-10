// import { Client } from "discord-rpc";

// const client = new Client({ transport: "ipc" });
// import { Agents, StandardMaps } from "./utils/constants.js";

// client.on("ready", () => {
//   client.setActivity({
//     details: "Unrated \\\\ 1-4",
//     largeImageKey: StandardMaps.Abyss,
//     largeImageText: `Playing on ${Object.keys(StandardMaps).find((key) => StandardMaps[key] === StandardMaps.Abyss)}`,
//     smallImageKey: Agents.Brimstone,
//     smallImageText: `Playing as ${Object.keys(Agents).find((key) => Agents[key] === Agents.Brimstone)}`,
//     state: "In a party",
//     partySize: 1,
//     partyMax: 5,

//     startTimestamp: new Date(),
//   });
// });

// client.login({ clientId: "1260470012536291418" });

console.clear()

import {
    createValorantApiClient,
    provideAuthViaLocalApi,
    provideClientVersionViaVAPI,
    provideLockFile,
    provideLogFile,
    useProviders,
  } from "@tqman/valorant-api-client";
  
  const vapic = await createValorantApiClient({
    auth: useProviders(provideClientVersionViaVAPI()),
    local: useProviders(provideLockFile()),
    remote: useProviders([provideLogFile(), provideAuthViaLocalApi()]),
  });

await vapic.local.getFriends()

vapic.remote.getCurrentGameMatch