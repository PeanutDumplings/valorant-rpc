const fetchData = async (vapic, puuid) => {
  try {
    // Get data from current game
    const playerData = await vapic.remote.getCurrentGamePlayer({
      data: { puuid },
    });

    const matchData = await vapic.remote.getCurrentGameMatch({
      data: {
        currentGameMatchId: playerData.data.MatchID,
      },
    });

    // Initialize score object
    let score = { data: { presences: [] } };

    // Fetch presence data
    score = await vapic.local.getPresence({
      data: { puuid },
    });

    // Find the correct presence and parse JSON
    let json = {
      partyOwnerMatchScoreAllyTeam: null,
      partyOwnerMatchScoreEnemyTeam: null,
    };
    score.data.presences.forEach((presence) => {
      if (presence.puuid === puuid) {
        json = JSON.parse(atob(presence.private));
      }
    });

    const player = matchData.data.Players.find(
      (player) => player.Subject === puuid
    );

    if (matchData.data.MatchmakingData) {
      return {
        data: {
          pregame: false,
          gamemode: matchData.data.MatchmakingData.QueueID,
          isRanked: matchData.data.MatchmakingData.IsRanked,
          map: matchData.data.MapID,
          player: {
            puuid: player.Subject,
            agentID: player.CharacterID,
          },
          party: {
            partyState: json.partyState,
            queueId: json.queueId,
            partySize: json.partySize,
            maxPartySize: json.maxPartySize,
          },
          score: {
            ally: json.partyOwnerMatchScoreAllyTeam,
            enemy: json.partyOwnerMatchScoreEnemyTeam,
          },
        },
      };
    } else {
      return {
        data: {
          pregame: false,
          gamemode: "Practice",
          map: "/Game/Maps/Poveglia/Range",
          isRanked: false,
          player: {
            puuid: player.Subject,
            agentID: player.CharacterID,
          },
          party: {
            partyState: json.partyState,
            queueId: json.queueId,
            partySize: json.partySize,
            maxPartySize: json.maxPartySize,
          },
          score: {
            ally: null,
            enemy: null,
          },
        },
      };
    }
  } catch (error) {
    try {
      // If fails, get data from pregame
      const preGamePlayerData = await vapic.remote.getPreGamePlayer({
        data: { puuid },
      });

      const preGameMatchData = await vapic.remote.getPreGameMatch({
        data: {
          preGameMatchId: preGamePlayerData.data.MatchID,
        },
      });

      const presence = await vapic.local.getPresence({
        data: { puuid },
      });

      let json = {};
      presence.data.presences.forEach((presence) => {
        if (presence.puuid === puuid) {
          json = JSON.parse(atob(presence.private));
        }
      });

      const player = preGameMatchData.data.AllyTeam.Players.find(
        (player) => player.Subject === puuid
      );

      return {
        data: {
          pregame: true,
          gamemode: preGameMatchData.data.QueueID,
          map: preGameMatchData.data.MapID,
          isRanked: preGameMatchData.data.IsRanked,
          player: {
            puuid: player.Subject,
            agentID: player.CharacterID,
          },
          party: {
            partyState: json.partyState,
            queueId: json.queueId,
            partySize: json.partySize,
            maxPartySize: json.maxPartySize,
          },
          score: {
            ally: null,
            enemy: null,
          },
        },
      };
    } catch (error) {
      const presence = await vapic.local.getPresence({
        data: { puuid },
      });

      let json = {};
      presence.data.presences.forEach((presence) => {
        if (presence.puuid === puuid) {
          json = JSON.parse(atob(presence.private));
        }
      });
      return {
        data: {
          pregame: null,
          gamemode: null,
          map: null,
          isRanked: null,
          player: {
            puuid: puuid,
            agentID: null,
          },
          party: {
            partyState: json.partyState,
            queueId: json.queueId,
            partySize: json.partySize,
            maxPartySize: json.maxPartySize,
          },
          score: { ally: null, enemy: null },
        },
      };
    }
  }
};

export default fetchData;
