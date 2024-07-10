import { Client } from "discord-rpc";

const client = new Client({ transport: "ipc" });

client.on("ready", () => {
  client.setActivity({
    details: "Basic RPC implementation",
    largeImageKey: "test",
    largeImageText: "Example valorant image",
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