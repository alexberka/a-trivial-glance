import React, { useEffect, useState } from 'react';
import { getLiveGames } from '../api/gameData';
import GameCard from '../components/GameCard';

export default function PlayerGameSelect() {
  const [openGames, setOpenGames] = useState([]);
  const [search, setSearch] = useState('');

  useEffect(() => {
    let mounted = true;
    getLiveGames().then((data) => { if (mounted) { setOpenGames(data); } });

    return () => { (mounted = false); };
  }, []);

  const handleSearch = (e) => {
    if (e.target.name === 'dropdown-search') {
      setSearch(e.target.value);
    }
  };

  return (
    <>
      <div className="header">
        <h1>Live Games</h1>
        <div className="header-misc">
          <input type="text" onChange={handleSearch} name="dropdown-search" value={search} placeholder="Search Games..." className="header-search" />
        </div>
      </div>
      <div className="content">
        <div className="games-container">
          {openGames.length > 0 ? (
            openGames
              .filter((g) => (search ? g.name.toLowerCase().includes(search.toLowerCase()) || g.location.toLowerCase().includes(search.toLowerCase()) : true))
              .sort((a, b) => a.name.localeCompare(b.name))
              .map((game) => <GameCard key={game.firebaseKey} gameObj={game} />)
          ) : (
            <span>Loading Games</span>
          )}
        </div>
      </div>
    </>
  );
}
