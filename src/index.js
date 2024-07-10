import { Client } from "discord-rpc";

const client = new Client({ transport: "ipc" });

client.on("ready", () => {
  client.setActivity({
    details: "Unrated \\ 1-4",
    largeImageKey: "splash_sunset_square",
    largeImageText: "Sunset",
    smallImageKey: "agent_cypher",
    smallImageText: "Cypher",
    state: "In a party (1 of 5)",
    startTimestamp: new Date(),
  });
});

client.login({ clientId: "1260470012536291418" });

import {
    createValorantApiClient,
    provideAuthViaLocalApi,
    provideClientVersionViaVAPI,
    provideLockFile,
    provideLogFile,
    useProviders,
  } from "@tqman/valorant-api-client";
  
  // Create Valorant API Client
  const vapic = await createValorantApiClient({
    auth: useProviders(provideClientVersionViaVAPI()),
    local: useProviders(provideLockFile()),
    remote: useProviders([provideLogFile(), provideAuthViaLocalApi()]),
  });
  

const friends = await vapic.local.getFriends();
// console.log(friends.data.friends.map((friend) => friend.game_name))
const data = await vapic.local.getPresence()
// console.log(data.data.presences)
// console.log(typeof friends)