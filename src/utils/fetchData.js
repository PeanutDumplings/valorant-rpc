const fetchData = async (vapic, puuid) => {
  //   const playerData = await vapic.remote.getCurrentGamePlayer({
  //     data: { puuid },
  //   });

  //   console.log(playerData);

  //   if (playerData) {
  //     console.log(playerData.data.MatchID);

  //     const matchData = await vapic.remote.getCurrentGameMatch({
  //       data: {
  //         currentGameMatchId: playerData.data.MatchID,
  //       },
  //     });

  //     if (!matchData.data.MatchmakingData) {
  //       return "Gamemode: Shooting Range";
  //     } else {
  //       return `Gamemode: ${matchData.data.MatchmakingData.QueueID}`;
  //     }
  //   } else {
  const preGamePlayerData = await vapic.remote.getPreGamePlayer({
    data: { puuid },
  });

  console.log(preGamePlayerData);

  if (!preGamePlayerData) {
    return "In lobby";
  } else {
    const preGameMatchData = await vapic.remote.getPreGameMatch({
      data: {
        preGameMatchId: preGamePlayerData.data.MatchID,
      },
    });

    console.log(preGameMatchData);

    return "In queue";
  }
  //   }
};

export default fetchData;
