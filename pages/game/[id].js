/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import GameDisplay from '../../components/GameDisplay';
import { getFullGameData } from '../../api/mergedData';

export default function PlayGame() {
  const [game, setGame] = useState({});
  const router = useRouter();

  const confirmOpen = (g) => {
    if (g.status === 'live') {
      setGame(g);
    } else {
      // Otherwise, redirect to '/games' if game is not open
      router.push('/games');
    }
  };

  useEffect(() => {
    const interval = setInterval(() => {
      getFullGameData(router.query.id).then(confirmOpen);
    }, 2000);

    return () => clearInterval(interval);
  }, [game]);

  useEffect(() => {
    getFullGameData(router.query.id).then(confirmOpen);
  }, []);

  return (
    <div>
      {game.status === 'live' && (<GameDisplay game={game} />)}
    </div>
  );
}
