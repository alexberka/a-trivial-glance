import React, { useEffect, useState } from 'react';
import { getLiveGames } from '../api/gameData';
import GameCard from '../components/GameCard';

export default function PlayerGameSelect() {
  const [openGames, setOpenGames] = useState([]);

  useEffect(() => {
    let mounted = true;
    getLiveGames().then((data) => { if (mounted) { setOpenGames(data); } });

    return () => { (mounted = false); };
  }, []);

  return (
    <>
      <div className="games-header">
        <h1 className="page-header">Live Games</h1>
      </div>
      <div className="games-container">
        {openGames.length > 0 ? (
          openGames
            .sort((a, b) => a.name.localeCompare(b.name))
            .map((game) => <GameCard key={game.firebaseKey} gameObj={game} />)
        ) : (
          <span>Loading Games</span>
        )}
      </div>
    </>
  );
}
