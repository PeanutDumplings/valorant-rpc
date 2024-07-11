import { client } from "../index.js";
import { Agents, Maps, PracticeMaps } from "./constants.js";

const PresenceState = Object.freeze({
  IN_LOBBY: "In lobby",
  QUEUEING: (queueId) => `${QueueIdMapping[queueId]} \\\\ Queueing`,
  IN_RANGE: "In the Range",
  AGENT_SELECT: (gamemode) =>
    `${capitalizeFirstLetter(gamemode)} \\\\ Agent Select`,
  IN_GAME: (gamemode, allyScore, enemyScore) =>
    `${capitalizeFirstLetter(gamemode)} \\\\ ${allyScore} - ${enemyScore}`,
  CUSTOM_GAME: "Custom Game",
  UNKNOWN: "Unknown",
});

const QueueIdMapping = Object.freeze({
  unrated: "Unrated",
  competitive: "Competitive",
  swiftplay: "Swiftplay",
  spikerush: "Spike Rush",
  deathmatch: "Deathmatch",
  ggteam: "Escalation",
  hurm: "Team Deathmatch",
});

let previousState = null;
let previousTimestamp = null;

const setPresence = (data) => {
  let newState = null;

  if (data.data.party.partyState === "CUSTOM_GAME_SETUP") {
    newState = PresenceState.CUSTOM_GAME;
  } else if (!data.data.gamemode && data.data.party.partyState === "DEFAULT") {
    newState = PresenceState.IN_LOBBY;
  } else if (data.data.party.partyState === "MATCHMAKING") {
    newState = PresenceState.QUEUEING(data.data.party.queueId);
  } else if (data.data.gamemode === "Practice") {
    newState = PresenceState.IN_RANGE;
  } else if (data.data.pregame) {
    newState = PresenceState.AGENT_SELECT(data.data.gamemode);
  } else if (!data.data.pregame) {
    newState = PresenceState.IN_GAME(
      data.data.gamemode,
      data.data.score.ally,
      data.data.score.enemy
    );
  } else {
    newState = PresenceState.UNKNOWN;
  }

  if (newState !== previousState) {
    previousState = newState;
    previousTimestamp = new Date();
  }

  let rpcData = {
    largeImageKey: "game_icon",
    state: "In a party",
    partySize: data.data.party.partySize,
    partyMax: data.data.party.maxPartySize,
    startTimestamp: previousTimestamp,
  };

  switch (newState) {
    case PresenceState.IN_LOBBY:
      rpcData.details = "In the lobby";
      rpcData.largeImageText = "In the lobby";
      break;
    case PresenceState.QUEUEING(data.data.party.queueId):
      rpcData.details = newState;
      rpcData.largeImageText = newState.split(" \\\\ ")[0];
      break;
    case PresenceState.IN_RANGE:
      rpcData.details = "In the Range";
      rpcData.largeImageText = "In the Range";
      rpcData.largeImageKey = PracticeMaps[data.data.map];
      rpcData.smallImageKey = Agents[data.data.player.agentID] || "";
      rpcData.smallImageText =
        getSmallImageText(data.data.player.agentID) || "";
      break;
    case PresenceState.AGENT_SELECT(data.data.gamemode):
      rpcData.details = newState;
      rpcData.largeImageKey = Maps[data.data.map];
      rpcData.largeImageText = getLargeImageText(data.data.map);
      rpcData.smallImageKey = Agents[data.data.player.agentID] || "";
      rpcData.smallImageText =
        getSmallImageText(data.data.player.agentID) || "";
      break;
    case PresenceState.IN_GAME(
      data.data.gamemode,
      data.data.score.ally,
      data.data.score.enemy
    ):
      rpcData.details = newState;
      rpcData.largeImageKey = Maps[data.data.map] || "";
      rpcData.largeImageText = getLargeImageText(data.data.map) || "";
      rpcData.smallImageKey = Agents[data.data.player.agentID] || "";
      rpcData.smallImageText =
        getSmallImageText(data.data.player.agentID) || "";
      break;
    case PresenceState.CUSTOM_GAME:
      rpcData.details = newState;
      rpcData.largeImageKey = "game_icon";
      rpcData.largeImageText = "Playing in a Custom Game";
      rpcData.smallImageKey = Agents[data.data.player.agentID] || "";
      rpcData.smallImageText =
        getSmallImageText(data.data.player.agentID) || "";
      break;

    case PresenceState.UNKNOWN:
      rpcData.largeImageText = `Valorant`;
      break;
    default:
      rpcData.largeImageText = `Valorant`;
      break;
  }

  return client.setActivity(rpcData);
};

const getLargeImageText = (mapID) => {
  const mapLowerCase = Maps[mapID].split("_")[1];
  const mapUpperCase = capitalizeFirstLetter(mapLowerCase);
  return `Playing on ${mapUpperCase}`;
};

const getSmallImageText = (agentID) => {
  if (!Agents[agentID]) {
    return "";
  }
  const agentLowerCase = Agents[agentID].split("_")[1];
  const agentUpperCase = capitalizeFirstLetter(agentLowerCase);
  return `Playing as ${agentUpperCase}`;
};

const capitalizeFirstLetter = (string) => {
  return string.slice(0, 1).toUpperCase() + string.slice(1);
};

export default setPresence;
