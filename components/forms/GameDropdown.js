/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect, useRef, useState } from 'react';
import { useRouter } from 'next/router';
import Link from 'next/link';
import {
  createGameQuestion,
  deleteGameQuestion,
  getGameQuestionsByQuestion,
  updateGameQuestion,
} from '../../api/gameQuestionsData';
import { getGamesByHost } from '../../api/gameData';
import { useAuth } from '../../utils/context/authContext';

export default function GameDropdown() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [games, setGames] = useState([]);
  const [gameQuestions, setGameQuestions] = useState([]);
  const [search, setSearch] = useState('');
  const router = useRouter();
  const { user } = useAuth();
  const isMounted = useRef(false);

  const assigned = gameQuestions?.map((gq) => {
    const gameInfo = games?.find((g) => g.firebaseKey === gq.gameId);
    return { ...gq, name: gameInfo?.name };
  });
  const unassigned = games
    .filter((g) => !assigned.some((ag) => ag.gameId === g.firebaseKey))
    .filter((g) => g.name.toLowerCase().includes(search.toLowerCase()))
    .sort((a, b) => a.name.localeCompare(b.name));

  useEffect(() => {
    isMounted.current = true;

    return () => {
      isMounted.current = false;
    };
  }, []);

  // Toggles menu open and closed
  // If called as handleToggle('only-if-open'), menu is only closed if open, but not opened if currently closed
  const handleToggle = (restrict) => {
    setMenuOpen((prev) => (restrict === 'only-if-open' ? false : !prev));
  };

  const handleSearch = (e) => {
    if (e.target.name === 'dropdown-search') {
      setSearch(e.target.value);
    }
  };

  const updateGameList = () => {
    getGameQuestionsByQuestion(router.query.id).then((data) => {
      if (isMounted.current) { setGameQuestions(data); }
    });
  };

  useEffect(() => {
    getGamesByHost(user.uid).then((data) => {
      if (isMounted.current) { setGames(data); }
    });
    updateGameList();
  }, []);

  const handleClick = (e) => {
    const { value } = e.target;
    const payload = {
      questionId: router.query.id,
      gameId: value,
      status: 'unused',
      timeOpened: 'never',
      queue: 0,
    };
    createGameQuestion(payload).then(({ name }) => {
      updateGameQuestion({ firebaseKey: name })
        .then(updateGameList)
        .then(handleToggle)
        .then(() => setSearch(''));
    });
  };

  const handleRemove = (e) => {
    if (window.confirm(`Remove this question from ${e.target.id}?`)) {
      deleteGameQuestion(e.target.value)
        .then(updateGameList);
    }
  };

  return (
    <div className="game-dropdown">
      {assigned.length > 0 && (
        <>
          <hr />
          <p>Games</p>
          <div className="assigned-list">
            {assigned.map((gq) => (
              <div key={gq.firebaseKey} className="assigned-game">
                <Link passHref href={`/host/question/${router.query.id}/${gq.firebaseKey}`}>
                  <button type="button">
                    <div className="qd-gq-status"><span className={`status-tag status-${gq.status}`}>{gq.status.toUpperCase()}</span> in</div>
                    <div className="qd-gq-game">{gq.name}</div>
                  </button>
                </Link>
                <button type="button" onClick={handleRemove} id={gq.name} value={gq.firebaseKey} className="gq-remove">X</button>
              </div>
            ))}
          </div>
        </>
      )}
      <div className="dropdown-element" onMouseLeave={() => handleToggle('only-if-open')}>
        <div className="qd-assign-game qd-btn">
          <div className="qd-game-name">
            Add to...
          </div>
          {/* Toggle dropdown open/close on click of arrow button */}
          <button type="button" className="qd-game-toggle" onClick={handleToggle}>
            {menuOpen ? '▲' : '▼'}
          </button>
        </div>
        {menuOpen && (
        <div className="assign-game-menu">
          <input type="text" onChange={handleSearch} name="dropdown-search" value={search} placeholder="Search Games..." className="sticky-search" />
          <div className="game-menu-container">
            {unassigned.map((game) => (
              <button type="button" className="game-item" key={game.firebaseKey} name="gameId" value={game.firebaseKey} onClick={handleClick}>{game.name}</button>
            ))}
          </div>
        </div>
        )}
      </div>
    </div>
  );
}
