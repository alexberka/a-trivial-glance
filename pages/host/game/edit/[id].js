/* eslint-disable react-hooks/exhaustive-deps */
import { useRouter } from 'next/router';
import React, { useEffect, useState } from 'react';
import GameForm from '../../../../components/forms/GameForm';
import { getGameById } from '../../../../api/gameData';

export default function EditGame() {
  const [game, setGame] = useState({});
  const router = useRouter();

  useEffect(() => {
    let mounted = true;
    getGameById(router.query.id).then((data) => {
      if (mounted) { setGame(data); }
    });

    return () => { (mounted = false); };
  }, []);

  return (
    <>
      <div className="header">
        <h1>Edit Game</h1>
      </div>
      <div className="content">
        {game && (<GameForm gameObj={game} />)}
      </div>
    </>
  );
}
