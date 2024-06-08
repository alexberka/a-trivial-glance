/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { useAuth } from '../../utils/context/authContext';
import GameCard from '../../components/GameCard';
import { getGameCardsData } from '../../api/mergedData';

export default function HostGames() {
  const [games, setGames] = useState();
  const { user } = useAuth();

  useEffect(() => {
    getGameCardsData(user.uid).then(setGames);
  }, []);

  return (
    <>
      <div className="games-header">
        <h1 className="page-header">Games</h1>
        <Link passHref href="/host/game/new">
          <button type="button" className="">New Game</button>
        </Link>
      </div>
      <div className="games-container">
        {games ? (
          games
            .sort((a, b) => a.name.localeCompare(b.name))
            .map((game) => <GameCard key={game.firebaseKey} gameObj={game} host />)
        ) : (
          <span>Loading Games</span>
        )}
      </div>
    </>
  );
}
