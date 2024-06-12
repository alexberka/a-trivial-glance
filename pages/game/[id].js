/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import GameDisplay from '../../components/GameDisplay';
import { getFullGameData } from '../../api/mergedData';
import { useAuth } from '../../utils/context/authContext';
import { getTeamsByUid } from '../../api/teamsData';
import TeamForm from '../../components/forms/TeamForm';
import { getGameById } from '../../api/gameData';
import TeamPanel from '../../components/TeamPanel';

export default function PlayGame() {
  const [game, setGame] = useState({});
  const [yourTeam, setYourTeam] = useState({});
  const [teamCheck, setTeamCheck] = useState(false);
  const router = useRouter();
  const { user } = useAuth();

  const confirmOpen = () => {
    getFullGameData(router.query.id).then((g) => {
      if (g.status === 'live') {
        setGame(g);
      } else {
        // Otherwise, redirect to '/games' if game is not open
        window.alert('Game has closed');
        router.push('/games');
      }
    });
  };

  const checkTeam = () => {
    getTeamsByUid(user.uid)
      .then((teams) => {
        const [thisTeam] = teams.filter((t) => t.gameId === router.query.id);
        if (thisTeam) {
          setYourTeam(thisTeam);
          confirmOpen();
        }
        setTeamCheck(true);
      });
  };

  // eslint-disable-next-line consistent-return
  useEffect(() => {
    if (yourTeam.firebaseKey) {
      const interval = setInterval(() => {
        confirmOpen();
      }, 2000);

      return () => clearInterval(interval);
    }
  }, [game, yourTeam]);

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
    <div>
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
            </>
          )}
        </>
      )}
    </div>
  );
}
