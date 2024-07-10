const fetchData = async (vapic, puuid) => {
  try {
    const playerData = await vapic.remote.getCurrentGamePlayer({
      data: { puuid },
    });

    const matchData = await vapic.remote.getCurrentGameMatch({
      data: {
        currentGameMatchId: playerData.data.MatchID,
      },
    });
    const score = await vapic.local.getPresence({
      data: { puuid },
    });
    score.data.presences.forEach((presence) => {
      if (presence.game_name === "PeanutDumplings") {
        const json = JSON.parse(atob(presence.private));
        console.log(
          json.partyOwnerMatchScoreAllyTeam,
          json.partyOwnerMatchScoreEnemyTeam
        );
      }
    });

    const self = matchData.data.Players.find(
      (player) => player.Subject === puuid
    );

    console.log(matchData.data.MatchmakingData);

    if (matchData.data.MatchmakingData) {
      return {
        gamemode: matchData.data.MatchmakingData.QueueID,
        isRanked: matchData.data.MatchmakingData.IsRanked,
        map: matchData.data.MapID,
        self: {
          puuid: self.Subject,
          agentID: self.CharacterID,
        },
        score: {
          ally: json.partyOwnerMatchScoreAllyTeam,
          enemy: json.partyOwnerMatchScoreEnemyTeam,
        },
      };
    } else {
      return {
        gamemode: "Practice",
        map: "/Game/Maps/Poveglia/Range",
        isRanked: false,
        score: {
          ally: null,
          enemy: null,
        },
      };
    }
  } catch (error) {
    try {
      const preGamePlayerData = await vapic.remote.getPreGamePlayer({
        data: { puuid },
      });

      const preGameMatchData = await vapic.remote.getPreGameMatch({
        data: {
          preGameMatchId: preGamePlayerData.data.MatchID,
        },
      });

      console.log(preGameMatchData.data.AllyTeam.Players);

      const self = preGameMatchData.data.AllyTeam.Players.find(
        (player) => player.Subject === puuid
      );

      console.log(self);

      return {
        gamemode: preGameMatchData.data.QueueID,
        map: preGameMatchData.data.MapID,
        isRanked: preGameMatchData.data.IsRanked,
        score: {
          ally: null,
          enemy: null,
        },
      };
    } catch (error) {
      return {
        gamemode: null,
        map: null,
        isRanked: null,
        score: {
          ally: null,
          enemy: null,
        },
      };
    }
  }
};

export default fetchData;
