/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect, useRef, useState } from 'react';
import { useRouter } from 'next/router';
import GameDisplay from '../../components/GameDisplay';
import { getFullGameData, getSingleTeamData } from '../../api/mergedData';
import { useAuth } from '../../utils/context/authContext';
import TeamForm from '../../components/forms/TeamForm';
import { getGameById } from '../../api/gameData';
import TeamPanel from '../../components/panels/TeamPanel';
import PlayerResponsePanel from '../../components/panels/PlayerResponsePanel';
import { getResponsesByTeamId } from '../../api/responsesData';

export default function PlayGame() {
  const [game, setGame] = useState({});
  const [yourTeam, setYourTeam] = useState({});
  const [teamCheck, setTeamCheck] = useState(false);
  const isMounted = useRef(false);
  const router = useRouter();
  const { user } = useAuth();
  const visibleQuestions = game?.questions?.filter((q) => q.timeOpened !== 'never');
  const [responses, setResponses] = useState([]);

  useEffect(() => {
    isMounted.current = true;

    return () => {
      isMounted.current = false;
    };
  }, []);

  const updateResponses = () => {
    if (yourTeam.firebaseKey) {
      getResponsesByTeamId(yourTeam.firebaseKey).then((data) => {
        if (isMounted) { setResponses(data); }
      });
    }
  };

  const confirmOpen = () => {
    getFullGameData(router.query.id).then((g) => {
      if (g.status === 'live') {
        const displayQs = g.questions.filter((q) => q.timeOpened !== 'never');
        // Only trigger state update and player-side refresh on certain changes to game data
        if (g.status !== game.status
          || g.name !== game.name
          || g.location !== game.location
          || displayQs.length !== visibleQuestions.length
          || displayQs[0]?.status !== visibleQuestions[0]?.status
          || displayQs[0]?.question !== visibleQuestions[0]?.question
          || displayQs[0]?.image !== visibleQuestions[0]?.image
          || displayQs[0]?.answer !== visibleQuestions[0]?.answer
          || displayQs[0]?.categoryId !== visibleQuestions[0]?.categoryId
        ) {
          if (isMounted.current) {
            setGame(g);
            updateResponses();
          }
        }
      } else {
        // Otherwise, redirect to '/games' if game is not open
        window.alert('Game has closed');
        router.push('/games');
      }
    });
  };

  const checkTeam = () => {
    getSingleTeamData(user.uid, router.query.id)
      .then((gameTeam) => {
        if (gameTeam && isMounted.current) {
          setYourTeam(gameTeam);
          confirmOpen();
        }
        setTeamCheck(true);
      });
  };

  useEffect(() => {
    updateResponses();
  }, [yourTeam]);

  // eslint-disable-next-line consistent-return
  useEffect(() => {
    const interval = setInterval(() => {
      if (yourTeam.firebaseKey) {
        confirmOpen();
      }
    }, 2000);

    return () => clearInterval(interval);
  }, [game, yourTeam]);

  // Check that game is live before allowing access to game and performing full data retrieval
  useEffect(() => {
    getGameById(router.query.id).then((gCheck) => {
      if (gCheck.status === 'live') {
        checkTeam();
      } else {
        router.push('/games');
      }
    });
  }, []);

  return (
    <>
      {!teamCheck || (yourTeam.firebaseKey && !game.status) ? (
        'Loading...'
      ) : (
        <>
          {!yourTeam.firebaseKey ? (
            <TeamForm gameId={router.query.id} uid={user.uid} onUpdate={checkTeam} />
          ) : (
            <>
              <TeamPanel teamObj={yourTeam} onUpdate={checkTeam} />
              {game.status === 'live' && (<GameDisplay game={game} />)}
              {visibleQuestions.length > 0 && (
                <PlayerResponsePanel
                  key={visibleQuestions[0].firebaseKey}
                  responses={responses}
                  onUpdate={updateResponses}
                  teamId={yourTeam.firebaseKey}
                  visibleQuestions={visibleQuestions}
                />
              )}
            </>
          )}
        </>
      )}
    </>
  );
}
