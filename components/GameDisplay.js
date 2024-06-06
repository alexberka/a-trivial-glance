import React from 'react';
import PropTypes from 'prop-types';
import { Image } from 'react-bootstrap';
import QuestionCard from './QuestionCard';

// 'questions' contains questions for game with attached category objects
export default function GameDisplay({ questions }) {
  const display = {
    // Game's open question (should only be one, but will grab first in array regardless)
    openQ: questions.filter((q) => q.status === 'open')[0],
    // Game's closed questions (will be displayed on '/game' in reverse order from when used)
    closedQ: questions
      .filter((q) => q.status === 'closed')
      .sort((a, b) => b.timeOpened.localeCompare(a.timeOpened)),
  };

  return (
    <div className="game-display">
      <div className="gd-open">
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
      <div className="gd-closed">
        {/* Display closed question(s), if any */}
        {display.closedQ && (
          <>
            <h3>Past Questions</h3>
            <div className="gd-closed-container">
              {display.closedQ.map((q) => (<QuestionCard key={q.firebaseKey} questionObj={q} />))}
            </div>
          </>
        )}
      </div>
    </div>
  );
}

GameDisplay.propTypes = {
  questions: PropTypes.arrayOf(PropTypes.shape({
    question: PropTypes.string,
    answer: PropTypes.string,
    lastUsed: PropTypes.string,
    firebaseKey: PropTypes.string,
    category: PropTypes.shape({
      name: PropTypes.string,
      color: PropTypes.string,
    }),
    gameQuestion: PropTypes.shape({
      status: PropTypes.string,
      timeOpened: PropTypes.string,
    }),
  })).isRequired,
};
