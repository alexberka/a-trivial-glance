import React from 'react';
import PropTypes from 'prop-types';
import { Image } from 'react-bootstrap';
import Link from 'next/link';
import { useRouter } from 'next/router';
import QuestionCard from './QuestionCard';
import { deleteGame } from '../api/mergedData';

// 'questions' contains questions for game with attached category objects
export default function GameDisplay({ game, host }) {
  const router = useRouter();

  const display = {
    unusedQ: game.questions.filter((q) => q.status === 'unused'),
    // Game's open question (should only be one, but will grab first in array regardless)
    openQ: game.questions.filter((q) => q.status === 'open')[0],
    // Game's closed questions (will be displayed on '/game' in reverse order from when used)
    closedQ: game.questions
      .filter((q) => q.status === 'closed')
      .sort((a, b) => b.timeOpened.localeCompare(a.timeOpened)),
    releasedQ: game.questions
      .filter((q) => q.status === 'released')
      .sort((a, b) => b.timeOpened.localeCompare(a.timeOpened)),
  };

  const handleDelete = () => {
    if (window.confirm(`Delete "${game.name}"?`)) {
      deleteGame(game.firebaseKey).then(() => router.push('/host/games'));
    }
  };

  return (
    <div className="game-display">
      <div className="gd-header">
        <div className="gd-title-box">
          <span>
            <h1>{game.name}</h1>
            {game.status === 'live' && (<span className="status-live gd-game-live">LIVE</span>)}
          </span>
          <h2>{game.location}</h2>
        </div>
        {host && (
          <div className="gd-host-tools">
            <div>
              <button type="button">Add Question</button>
              <button type="button">{game.status === 'live' ? 'Close Game' : 'Go Live'}</button>
            </div>
            <div>
              <Link passHref href={`/host/game/edit/${game.firebaseKey}`}>
                <button type="button">Edit</button>
              </Link>
              <button type="button" onClick={handleDelete}>Delete</button>
            </div>
          </div>
        )}
      </div>
      <div className="gd-container">
        {host && (
          <div className="gd-unused">
            <h3>Unused</h3>
            <div className="gd-card-container">
              {display.unusedQ.map((q) => (<QuestionCard key={q.firebaseKey} questionObj={q} host />))}
            </div>
          </div>
        )}
        {host ? (
          <div className="gd-open-host">
            <h3>Open</h3>
            <div className="gd-card-container">
              {display.openQ && (<QuestionCard questionObj={display.openQ} host />)}
            </div>
          </div>
        ) : (
          <div className="gd-open-player">
            {/* Display open question, if any */}
            {display.openQ && (
            <>
              <div className="gd-open-tags">
                <p className="gd-open-category" style={{ background: `${display.openQ.category.color}` }}>
                  {display.openQ.category.name.toUpperCase()}
                </p>
                <p className={`gd-open-status status-${display.openQ.status}`}>
                  {display.openQ.status.toUpperCase()}
                </p>
              </div>
              {/* Calculate question number based on number of closed questions */}
              <h2>
                Question #{display.closedQ.length + 1}
              </h2>
              <hr />
              <p className="gd-open-question">
                {display.openQ.question}
              </p>
              {display.openQ.image && (<Image className="gd-image" src={display.openQ.image} />)}
            </>
            )}
          </div>
        )}
        {host && (
          <div className="gd-closed">
            <h3>Closed</h3>
            <div className="gd-card-container">
              {display.closedQ.map((q) => (<QuestionCard key={q.firebaseKey} questionObj={q} host />))}
            </div>
          </div>
        )}
        <div className="gd-released">
          {/* Display closed question(s), if any */}
          <h3>{host ? 'Released' : 'Past Questions'}</h3>
          <div className="gd-card-container">
            {display.releasedQ.map((q) => (<QuestionCard key={q.firebaseKey} questionObj={q} host />))}
          </div>
        </div>
      </div>
    </div>
  );
}

GameDisplay.propTypes = {
  game: PropTypes.shape({
    name: PropTypes.string,
    location: PropTypes.string,
    status: PropTypes.string,
    firebaseKey: PropTypes.string,
    questions: PropTypes.arrayOf(PropTypes.shape({
      question: PropTypes.string,
      answer: PropTypes.string,
      lastUsed: PropTypes.string,
      firebaseKey: PropTypes.string,
      gameQuestionId: PropTypes.string,
      queue: PropTypes.number,
      status: PropTypes.string,
      timeOpened: PropTypes.string,
      category: PropTypes.shape({
        name: PropTypes.string,
        color: PropTypes.string,
      }),
    })),
  }).isRequired,
  host: PropTypes.bool,
};

GameDisplay.defaultProps = {
  host: false,
};
