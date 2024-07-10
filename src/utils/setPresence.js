import { client } from "..";
import { PracticeMaps } from "./constants";

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

  if (!data.gamemode || !data.map || !data.isRanked) {
    client.setActivity({
      details: "Practice",
      largeImageKey: PracticeMaps["/Game/Maps/Poveglia/Range"],
      largeImageText: `Playing on The Range`,
      smallImageKey: "",
      smallImageText: "",
      state: "",
      partySize: 0,
      partyMax: 5,
      startTimestamp: new Date(),
    });
  }

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
};
