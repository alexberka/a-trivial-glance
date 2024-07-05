import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { Image } from 'react-bootstrap';
import Link from 'next/link';
import { useRouter } from 'next/router';
import QuestionCard from './QuestionCard';
import {
  deleteGame,
  releaseMultipleQuestions,
  resetAllGameQuestions,
  resetGame,
} from '../api/mergedData';
import { updateGame } from '../api/gameData';
import { updateGameQuestion } from '../api/gameQuestionsData';
import { updateQuestion } from '../api/questionsData';

const droppingReset = {
  unused: false,
  open: false,
  closed: false,
  released: false,
};
// 'questions' contains questions for game with attached category objects
export default function GameDisplay({ game, host, onUpdate }) {
  const [dropping, setDropping] = useState(droppingReset);
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
    playerQ: game.questions
      .filter((q) => q.status !== 'unused')
      .sort((a, b) => b.timeOpened.localeCompare(a.timeOpened)),
  };

  const handleDelete = () => {
    if (window.confirm(`Delete "${game.name}"?`)) {
      deleteGame(game.firebaseKey).then(() => router.push('/host/games'));
    }
  };

  const handleGameStatus = (e) => {
    if (e.target.id === 'reset-game') {
      resetGame(game.firebaseKey).then(onUpdate);
    } else {
      const payload = { firebaseKey: game.firebaseKey };
      payload.dateLive = new Date().toISOString();
      if (game.status === 'unused' || game.status === 'closed') {
        payload.status = 'live';
      } else {
        payload.status = 'closed';
      }
      updateGame(payload).then(() => {
        if (payload.status === 'closed' && display.openQ?.firebaseKey) {
          updateGameQuestion({ firebaseKey: display.openQ.gameQuestionId, status: 'closed' }).then(onUpdate);
        } else {
          onUpdate();
        }
      });
    }
  };

  const handleQuestionStatus = (e) => {
    e.preventDefault();
    if (e.target.id === 'reset-questions') {
      if (window.confirm('Are you sure you want to reset all questions in this game? Timestamps will be erased and all responses deleted.')) {
        resetAllGameQuestions(game.questions).then(onUpdate);
      }
    } else if (e.target.id === 'close-question') {
      updateGameQuestion({ firebaseKey: display.openQ.gameQuestionId, status: 'closed' }).then(onUpdate);
    } else if (e.target.id === 'release-questions') {
      releaseMultipleQuestions(display.closedQ).then(onUpdate);
    }
  };

  const handleDrop = (e, code) => {
    e.preventDefault();
    const draggedQ = e.dataTransfer.getData('gameQuestionId');
    if (e.target.id === 'drag-unused' || code === 'drag-unused') {
      if (display.openQ?.gameQuestionId === draggedQ
        || display.closedQ?.some((q) => q.gameQuestionId === draggedQ)
        || display.releasedQ?.some((q) => q.gameQuestionId === draggedQ)) {
        if (window.confirm('Are you sure you want to reset this question? Timestamp and responses will be lost.')) {
          updateGameQuestion({ firebaseKey: draggedQ, status: 'unused', timeOpened: 'never' }).then(onUpdate);
        }
      }
    } else if (e.target.id === 'drag-open' || code === 'drag-open') {
      if (game.status === 'live') {
        const questionObj = game.questions.find((q) => q.gameQuestionId === draggedQ);
        // if there is no currently open question
        if (!display.openQ) {
          // if this question is currently unused
          // OR it is closed or released and user agrees to reopen it
          if (display.unusedQ?.some((q) => q.gameQuestionId === draggedQ)
          || ((display.closedQ?.some((q) => q.gameQuestionId === draggedQ)
            || display.releasedQ?.some((q) => q.gameQuestionId === draggedQ))
          && window.confirm('Reopen Question?'))) {
            updateGameQuestion({ firebaseKey: draggedQ, status: 'open', timeOpened: new Date().toISOString() })
              .then(() => updateQuestion({ firebaseKey: questionObj.firebaseKey, lastUsed: new Date().toISOString() }))
              .then(onUpdate);
          }
        } else if (draggedQ !== display.openQ.gameQuestionId
        && window.confirm(`Another question is already open.\n\nClose and ${display.unusedQ?.some((q) => q.gameQuestionId === draggedQ) ? 'open' : 'reopen'} this question instead?`)) {
          updateGameQuestion({ firebaseKey: display.openQ.gameQuestionId, status: 'closed' })
            .then(() => updateGameQuestion({ firebaseKey: draggedQ, status: 'open', timeOpened: new Date().toISOString() }))
            .then(() => updateQuestion({ firebaseKey: questionObj.firebaseKey, lastUsed: new Date().toISOString() }))
            .then(onUpdate);
        }
      } else {
        window.alert('Game must be live to open a question');
      }
    } else if (e.target.id === 'drag-closed' || code === 'drag-closed') {
      if (game.status === 'live') {
        if (display.openQ?.gameQuestionId === draggedQ) {
          updateGameQuestion({ firebaseKey: draggedQ, status: 'closed' }).then(onUpdate);
        } else if (display.releasedQ?.some((q) => q.gameQuestionId === draggedQ)) {
          if (window.confirm('Hide answer from teams?')) {
            updateGameQuestion({ firebaseKey: draggedQ, status: 'closed' }).then(onUpdate);
          }
        }
      }
    } else if (e.target.id === 'drag-released' || code === 'drag-released') {
      if (game.status === 'live') {
        if (display.closedQ?.some((q) => q.gameQuestionId === draggedQ)) {
          updateGameQuestion({ firebaseKey: draggedQ, status: 'released' }).then(onUpdate);
        } else if (display.openQ?.gameQuestionId === draggedQ) {
          window.alert('Question must be closed first.');
        }
      }
    }
    setDropping(droppingReset);
  };

  const toggleDropHighlight = (e, code) => {
    if ((e.target.id === 'drag-unused' || code === 'drag-unused')) {
      setDropping((prev) => ({ ...prev, unused: !prev.unused }));
    } else if ((e.target.id === 'drag-open' || code === 'drag-open') && game.status === 'live') {
      setDropping((prev) => ({ ...prev, open: !prev.open }));
    } else if ((e.target.id === 'drag-closed' || code === 'drag-closed') && game.status === 'live') {
      setDropping((prev) => ({ ...prev, closed: !prev.closed }));
    } else if ((e.target.id === 'drag-released' || code === 'drag-released') && game.status === 'live') {
      setDropping((prev) => ({ ...prev, released: !prev.released }));
    }
  };

  return (
    <>
      <div className="gd-header header">
        <div className="gd-title-box">
          <h1>{game.name}</h1>
          <h2>{game.location}</h2>
        </div>
        <div className="gd-header-buttons">
          <div>
            <span className={`status-${game.status} gd-game-status`}>
              {game.status.toUpperCase()}
              {game.status === 'closed' && (
                <p>
                  {new Date(game.dateLive).toDateString()
                    .split(' ')
                    .splice(1)
                    .join(' ')}
                </p>
              )}
            </span>
            {host && (
              <>
                <button
                  className={`std-btn gd-status-toggle${game.status === 'live' ? '-closed' : '-live'}`}
                  type="button"
                  id="toggle"
                  onClick={handleGameStatus}
                >
                  {game.status === 'live' ? 'Close Game' : 'Go Live'}
                </button>
                {display.unusedQ.length < game.questions.length ? (
                  <button className="std-btn" type="button" id="reset-questions" onClick={handleQuestionStatus}>Reset Questions</button>
                )
                  : game.status !== 'unused' && (
                  <button className="gd-status-reset std-btn" type="button" id="reset-game" onClick={handleGameStatus}>Reset Game</button>
                  )}
              </>
            )}
          </div>
          {host && (
            <div>
              <button type="button" className="std-btn hidden">Add Question</button>
              <Link passHref href={`/host/game/edit/${game.firebaseKey}`}>
                <button type="button" className="std-btn">Edit Game</button>
              </Link>
              <button type="button" className="std-btn" onClick={handleDelete}>Delete Game</button>
            </div>
          )}
        </div>
      </div>
      <div className="content">
        <div className="gd-container">
          {host && (
            <div className="gd-unused">
              <h3 draggable onDragStart={(e) => e.dataTransfer.setData('text', 'hey')}>Unused</h3>
              <div className={`gd-captive ${dropping.unused && 'unused-highlight'}`}>
                <div
                  id="drag-unused"
                  className="gd-card-container"
                  onDragOver={(e) => e.preventDefault()}
                  onDragEnter={(e) => toggleDropHighlight(e, 'drag-unused')}
                  onDragLeave={(e) => toggleDropHighlight(e, 'drag-unused')}
                  onDrop={(e) => handleDrop(e, 'drag-unused')}
                >
                  {display.unusedQ.map((q) => (<QuestionCard key={q.firebaseKey} questionObj={q} host={host} dragThis />))}
                </div>
                <div className="gd-scroll-fade" />
              </div>
            </div>
          )}
          {host ? (
            <div className="gd-open-closed-host">
              <div className="gd-col-header">
                <h3>Open</h3>
                {display.openQ?.firebaseKey && (
                  <button
                    id="close-question"
                    type="button"
                    className="gd-close-q std-btn"
                    onClick={handleQuestionStatus}
                  >
                    CLOSE
                  </button>
                )}
              </div>
              <div className={`gd-captive gd-fc-open ${dropping.open && 'open-highlight'}`}>
                <div
                  id="drag-open"
                  className="gd-card-container"
                  onDragOver={(e) => e.preventDefault()}
                  onDragEnter={(e) => toggleDropHighlight(e, 'drag-open')}
                  onDragLeave={(e) => toggleDropHighlight(e, 'drag-open')}
                  onDrop={(e) => handleDrop(e, 'drag-open')}
                >
                  {display.openQ && (<QuestionCard questionObj={display.openQ} host={host} dragThis />)}
                </div>
                <div className="gd-scroll-fade" />
              </div>
              <div className="gd-col-header">
                <h3>Closed</h3>
                {display.closedQ.length > 0 && game.status === 'live' && (
                  <button
                    id="release-questions"
                    type="button"
                    className="gd-release-q std-btn"
                    onClick={handleQuestionStatus}
                  >
                    {display.closedQ.length > 1 ? 'RELEASE ALL' : 'RELEASE'}
                  </button>
                )}
              </div>
              <div className={`gd-captive gd-fc-closed ${dropping.closed && 'closed-highlight'}`}>
                <div
                  id="drag-closed"
                  className="gd-card-container"
                  onDragOver={(e) => e.preventDefault()}
                  onDragEnter={(e) => toggleDropHighlight(e, 'drag-closed')}
                  onDragLeave={(e) => toggleDropHighlight(e, 'drag-closed')}
                  onDrop={(e) => handleDrop(e, 'drag-closed')}
                >
                  {display.closedQ.map((q) => (<QuestionCard key={q.firebaseKey} questionObj={q} host={host} dragThis />))}
                </div>
                <div className="gd-scroll-fade" />
              </div>
            </div>
          ) : (
            <div className="gd-open-player">
              {/* Display open question, if any */}
              {display.playerQ.length > 0 && (
              <>
                <div className="gd-open-tags">
                  <p className="gd-open-category" style={{ background: `${display.playerQ[0].category.color}` }}>
                    {display.playerQ[0].category.name.toUpperCase()}
                  </p>
                  <p className={`gd-open-status status-${display.playerQ[0].status === 'open' ? 'open' : 'closed'}`}>
                    {display.playerQ[0].status === 'open' ? 'OPEN' : 'CLOSED'}
                  </p>
                </div>
                {/* Calculate question number based on number of closed questions */}
                <h2>
                  Question #{(display.openQ ? 1 : 0) + display.closedQ.length + display.releasedQ.length}
                </h2>
                <hr />
                <div className="gd-open-question">
                  <p>{display.playerQ[0].question}</p>
                  {display.playerQ[0].status === 'released' && (
                    <>
                      <hr />
                      <p>{display.playerQ[0].answer}</p>
                    </>
                  )}
                  {display.playerQ[0].image && (<Image className="gd-image" src={display.playerQ[0].image} />)}
                </div>
              </>
              )}
            </div>
          )}
          {host && (
            <div className="gd-released">
              {/* Display closed question(s), if any */}
              <h3>{host ? 'Answers Released' : 'Previous Questions'}</h3>
              <div className={`gd-captive ${dropping.released && 'released-highlight'}`}>
                <div
                  id="drag-released"
                  className="gd-card-container"
                  onDragOver={host ? ((e) => e.preventDefault()) : null}
                  onDragEnter={host ? ((e) => toggleDropHighlight(e, 'drag-released')) : null}
                  onDragLeave={host ? ((e) => toggleDropHighlight(e, 'drag-released')) : null}
                  onDrop={host ? ((e) => handleDrop(e, 'drag-released')) : null}
                >
                  {host
                    ? display.releasedQ.map((q) => (<QuestionCard key={q.firebaseKey} questionObj={q} host={host} dragThis={host} />))
                    : display.playerQ
                      .slice(1)
                      ?.map((q) => (<QuestionCard key={q.firebaseKey} questionObj={q} host={host} dragThis={host} />))}
                </div>
                <div className="gd-scroll-fade" />
              </div>
            </div>
          )}
        </div>
      </div>
    </>
  );
}

GameDisplay.propTypes = {
  game: PropTypes.shape({
    name: PropTypes.string,
    location: PropTypes.string,
    status: PropTypes.string,
    firebaseKey: PropTypes.string,
    dateLive: PropTypes.string,
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
  onUpdate: PropTypes.func,
};

GameDisplay.defaultProps = {
  host: false,
  onUpdate: null,
};
