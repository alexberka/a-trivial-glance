/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect, useRef, useState } from 'react';
import { useRouter } from 'next/router';
import GameDisplay from '../../../components/GameDisplay';
import { getFullGameData, getGameResponses } from '../../../api/mergedData';
import { useAuth } from '../../../utils/context/authContext';
import HostResponsePanel from '../../../components/panels/HostResponsePanel';

export default function ManageGame() {
  const [gameData, setGameData] = useState();
  const [responses, setResponses] = useState([]);
  const router = useRouter();
  const { user } = useAuth();
  const isMounted = useRef(false);

  useEffect(() => {
    isMounted.current = true;

    return () => { (isMounted.current = false); };
  }, []);

  const grabResponses = () => {
    getGameResponses(router.query.id).then((resNoGQs) => {
      const resGQs = resNoGQs.map((res) => {
        const { question, answer } = gameData.questions.find((q) => q.gameQuestionId === res.gameQuestionId);
        return { ...res, question, answer };
      });
      if (isMounted.current) { setResponses(resGQs.sort((a, b) => b.timeSubmitted.localeCompare(a.timeSubmitted))); }
    });
  };

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
    if (gameData?.firebaseKey) { grabResponses(); }
  }, [gameData]);

  useEffect(() => {
    grabGame();
  }, []);

  // eslint-disable-next-line consistent-return
  useEffect(() => {
    if (gameData?.status === 'live') {
      const interval = setInterval(() => {
        grabResponses();
      }, 2000);

      return () => clearInterval(interval);
    }
  }, [gameData?.status]);

  return (
    <div>
      {gameData && (<GameDisplay game={gameData} host onUpdate={grabGame} />)}
      {gameData?.status === 'live' && (<HostResponsePanel responses={responses} onUpdate={grabResponses} />)}
    </div>
  );
}
