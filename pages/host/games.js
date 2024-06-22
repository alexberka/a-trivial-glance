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
    let mounted = true;
    getGameCardsData(user.uid).then((data) => {
      if (mounted) { setGames(data); }
    });

    return () => { (mounted = false); };
  }, []);

  return (
    <>
      <div className="header">
        <h1>Games</h1>
        <div className="header-misc">
          <Link passHref href="/host/game/new">
            <button type="button" className="std-btn">New Game</button>
          </Link>
        </div>
      </div>
      <div className="content">
        <div className="games-container">
          {games ? (
            games
              .sort((a, b) => a.name.localeCompare(b.name))
              .map((game) => <GameCard key={game.firebaseKey} gameObj={game} host />)
          ) : (
            <span>Loading Games</span>
          )}
        </div>
      </div>
    </>
  );
}
