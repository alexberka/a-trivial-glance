/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import GameDisplay from '../../../components/GameDisplay';
import { getFullGameData } from '../../../api/mergedData';

export default function ManageGame() {
  const [gameData, setGameData] = useState();
  const router = useRouter();

  const grabGame = () => {
    getFullGameData(router.query.id).then(setGameData);
  };

  useEffect(() => {
    grabGame();
  }, []);

  return (
    <div>
      {gameData && (<GameDisplay game={gameData} host onUpdate={grabGame} />)}
    </div>
  );
}
