/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect, useRef, useState } from 'react';
import { useRouter } from 'next/router';
import GameDisplay from '../../../components/GameDisplay';
import { getFullGameData } from '../../../api/mergedData';
import { useAuth } from '../../../utils/context/authContext';

export default function ManageGame() {
  const [gameData, setGameData] = useState();
  const router = useRouter();
  const { user } = useAuth();
  const isMounted = useRef(false);

  useEffect(() => {
    isMounted.current = true;

    return () => { (isMounted.current = false); };
  }, []);

  const confirmAccess = (gCheck) => {
    // If non-host user is attempting to access the host panel for a game they did not create
    // OR the question endpoint does not exist
    // then redirect user to games page
    if (!gCheck.uid || gCheck.uid !== user.uid) {
      router.push('/host/games');
    } else if (isMounted.current) {
      // Otherwise, set that question as 'question' state
      setGameData(gCheck);
    }
  };

  const grabGame = () => {
    getFullGameData(router.query.id).then(confirmAccess);
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
