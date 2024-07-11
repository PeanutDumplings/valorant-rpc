import { client } from "..";
import { Agents, PracticeMaps } from "./constants";

const setPresence = (data) => {
  /**
   * {
   *    gamemode: string | null;
   *    map: string | null;
   *    isRanked: boolean | null;
   *    score: {
   *    ally: number | null;
   *    enemy: number | null;
   * }
   *
   */

  // In lobby
  if (!data.data.gamemode) {
    client.setActivity({
      details: "In the lobby",
      largeImageKey: "game_icon",
      largeImageText: `In the lobby`,
      state: "In a party",
      partySize: data.data.party.partySize,
      partyMax: data.data.party.maxPartySize,
      startTimestamp: new Date(),
    });
  }

  // In the range
  if (data.data.gamemode === "Practice") {
    client.setActivity({
      details: "In the Range",
      largeImageKey: PracticeMaps[data.data.map],
      largeImageText: "In the Range",
      smallImageKey: Agents[data.data.player.agentID] || "",
      smallImageText: getSmallImageText(data.data.player.agentID) || "",
      state: "In a party",
      partySize: data.data.party.partySize,
      partyMax: data.data.party.maxPartySize,
      startTimestamp: new Date(),
    });
  }

  // In agent select
  if (data.data.pregame) {
    client.setActivity({
      details: `${capitalizeFirstLetter(data.data.gamemode)} \\\\ Agent Select`,
      largeImageKey: Maps[data.data.map],
      largeImageText: getLargeImageText(data.data.map),
      smallImageKey: Agents[data.data.player.agentID] || "",
      smallImageText: getSmallImageText(data.data.player.agentID) || "",
      state: "In a party",
      partySize: data.data.party.partySize,
      partyMax: data.data.party.maxPartySize,
      startTimestamp: new Date(),
    });
  }

  // In a game
  if (!data.data.pregame) {
    client.setActivity({
      details: "",
      largeImageKey: "",
      largeImageText: "",
      smallImageKey: "",
      smallImageText: "",
      state: "",
      partySize: 0,
      partyMax: 5,
      startTimestamp: new Date(),
    });
  }

  // client.setActivity({
  //   details: "",
  //   largeImageKey: "",
  //   largeImageText: "",
  //   smallImageKey: "",
  //   smallImageText: "",
  //   state: "",
  //   partySize: 0,
  //   partyMax: 5,
  //   startTimestamp: new Date(),
  // });
};

const getLargeImageText = (mapID) => {
  const mapLowerCase = Maps[mapID].split("_")[1];
  const mapUpperCase = capitalizeFirstLetter(mapLowerCase);
  return `Playing on ${mapUpperCase}`;
};

const getSmallImageText = (agentID) => {
  const agentLowerCase = Agents[agentID].split("_")[1];
  const agentUpperCase = capitalizeFirstLetter(agentLowerCase);
  return `Playing as ${agentUpperCase}`;
};

const capitalizeFirstLetter = (string) => {
  return string.slice(0, 1).toUpperCase() + string.slice(1);
};
