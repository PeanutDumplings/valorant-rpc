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

    if (matchData.data.MatchmakingData) {
      return {
        gamemode: matchData.data.MatchmakingData.QueueID,
        isRanked: matchData.data.MatchmakingData.IsRanked,
        map: matchData.data.MapID,
      };
    } else {
      return {
        gamemode: "The Range",
        map: "The Range",
        isRanked: false,
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
      return {
        gamemode: preGameMatchData.data.QueueID,
        map: preGameMatchData.data.MapID,
      };
    } catch (error) {
      return "In lobby";
    }
  }
};

export default fetchData;
