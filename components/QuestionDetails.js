import React from 'react';
import PropTypes from 'prop-types';
import { Image } from 'react-bootstrap';
import Link from 'next/link';
import CategoryDropdown from './forms/CategoryDropdown';
import { getGameQuestionsByGame, updateGameQuestion } from '../api/gameQuestionsData';
import { updateQuestion } from '../api/questionsData';
import GameDropdown from './forms/GameDropdown';
import { resetSingleQuestion } from '../api/mergedData';

// 'questionObj' includes a single question object with associated category object embedded
// 'host' is a boolean indicating whether user is in host mode (defaults to false)
// 'onUpdate' is a function describing page behavior when 'Edit' or status change buttons are clicked
// 'handleDelete' is a function for deleting the current question from database
export default function QuestionDetails({
  questionObj,
  host,
  onUpdate,
  handleDelete,
}) {
  // Called from handleStatus when 'Open/Close/Reopen' or 'Reset' buttons are clicked.
  // Accepts payload (including gameQuestion's firebase key and new status)
  // and closeId (firebase key of gameQuestion to close).
  const updateStatus = (payload, closeId = '') => {
    if (closeId) {
      // If a question needs to be closed first, close the currently open question
      updateGameQuestion({ firebaseKey: closeId, status: 'closed' })
        // Then open the new question
        .then(() => updateGameQuestion(payload))
        // Update the lastUsed key on the main question entity
        .then(() => updateQuestion({ firebaseKey: questionObj.firebaseKey, lastUsed: payload.timeOpened }))
        // And refresh the page
        .then(() => onUpdate());
    } else if (payload.status === 'unused') {
      resetSingleQuestion(payload.firebaseKey).then(onUpdate);
    } else {
      // Otherwise open the question and update the page
      updateGameQuestion(payload)
        .then(() => updateQuestion({ firebaseKey: questionObj.firebaseKey, lastUsed: payload.timeOpened }))
        .then(() => onUpdate());
    }
  };

  // Called when 'Open/Close/Reopen' and 'Reset' buttons are clicked
  // Accepts event information, if necessary
  const handleStatus = (e) => {
    // NOTE: The 'Reset' button has a value of 'reset', other buttons have an empty string. The trigger will then
    // default to the current status of the question.
    const trigger = e.target.value || questionObj.status;
    // Initialize payload with question's Firebase key
    const payload = { firebaseKey: questionObj.gameQuestionId };
    switch (trigger) {
      case 'reset':
        // If the 'Reset' button was clicked, confirm with user that this is the desired action.
        if (window.confirm('Are you sure you want to reset this question? The timestamp will be lost and all responses deleted.')) {
          // Then reset it (calls updateStatus for continuity, but ultimately calls
          // resetSingleQuestion merge call rather than updateGameQuestion)
          updateStatus({ ...payload, status: 'unused' });
        }
        break;
      case 'release':
        updateStatus({ ...payload, status: 'released' });
        break;
      case 'unrelease':
        updateStatus({ ...payload, status: 'closed' });
        break;
      case 'open':
        // If the question is currently open, then close it.
        updateStatus({ ...payload, status: 'closed' });
        break;
      case 'closed':
      case 'unused':
      case 'released':
        // If the question is closed or unused and user is attempting to open it,
        // check first for another open question
        getGameQuestionsByGame(questionObj.game.firebaseKey).then((gameQuestions) => {
          const [openQ] = gameQuestions.filter((gq) => gq.status === 'open');
          if (openQ) {
            // If a question is already open in the game, give the user option to close it
            if (window.confirm(`Another question is already open in ${questionObj.game.name}.\n\nClose and open this question instead?`)) {
              // And open the new one if confirmed (openQ.firebaseKey is the key of the question to close)
              updateStatus({ ...payload, status: 'open', timeOpened: new Date().toISOString() }, openQ.firebaseKey);
            }
          } else {
            // If no open question is found, open this question
            updateStatus({ ...payload, status: 'open', timeOpened: new Date().toISOString() });
          }
        });
        break;
      default:
        break;
    }
  };

  return (
    // Structure and classes mirror those of QuestionForm
    <div className="question-details">
      <div className="qd-info">
        <div>
          <h2>Question</h2>
          <hr />
          <h4>{questionObj.question}</h4>
        </div>
        {questionObj.image && (<Image className="qd-image" src={questionObj.image} />)}
        {(host || questionObj.status === 'released') && (
          <div>
            <h2>Answer</h2>
            <hr />
            <h4>{questionObj.answer}</h4>
          </div>
        )}
      </div>
      <div className="qd-buttons">
        {/* If in host view, use CategoryDropdown component (see CategoryDropdown.js for prop notes) */}
        {/* Otherwise display category as non-interactive element */}
        {host && !questionObj.gameQuestionId ? (
          <CategoryDropdown selectedCategoryId={questionObj.category.firebaseKey} questionId={questionObj.firebaseKey} />
        ) : (
          <p className="qd-btn qd-status" style={{ background: `${questionObj.category.color}` }}>
            {questionObj.category.name.toUpperCase()}
          </p>
        )}
        {/* If in host view, display the timestamp of the last day the question was used */}
        {(host && !questionObj.gameQuestionId)
        && (
        <p className="qd-timestamp">
          {questionObj.lastUsed !== 'never'
            ? `Last Used: ${new Date(questionObj.lastUsed)
              .toDateString()
              .split(' ')
              .join(' ')}`
            : 'Last Used: Never'}
        </p>
        )}
        {host
        && (questionObj.gameQuestionId ? (
          <>
            <p className={`qd-btn qd-status status-${questionObj.status}`}>
              {questionObj.status.toUpperCase()}
            </p>
            <Link passHref href={`/host/game/${questionObj.game.firebaseKey}`}>
              <button type="button" className={`qd-btn qd-game-status status-${questionObj.game.status}`}>
                <i>{questionObj.game.name}</i>
              </button>
            </Link>
            <Link passHref href={`/host/question/${questionObj.firebaseKey}`}>
              <button type="button" className="qd-btn">
                Edit Question...
              </button>
            </Link>
          </>
        ) : (
          <>
            <GameDropdown />
          </>
        ))}
        {/* If in player view, include button to return to current game */}
        {!host
        && (
          <Link passHref href={`/game/${questionObj.game.firebaseKey}`}>
            <button type="button" className="qd-return qd-btn">
              RETURN TO GAME
            </button>
          </Link>
        )}
        {/* If in host view, display status, edit, and delete host tools */}
        {host && (
          <div className="qd-host-tools">
            {questionObj.gameQuestionId ? (
              <>
                {(questionObj.status === 'closed' || questionObj.status === 'released') && (
                  <button type="button" onClick={handleStatus} value="reset" className="qd-btn">
                    Reset Question
                  </button>
                )}
                {questionObj.status === 'closed' && (
                  <button type="button" onClick={handleStatus} value="release" className="qd-btn">
                    Release Answer
                  </button>
                )}
                {questionObj.status === 'released' && (
                  <button type="button" onClick={handleStatus} value="unrelease" className="qd-btn">
                    Hide Answer
                  </button>
                )}
                {questionObj.game.status === 'live' && (
                  <button type="button" onClick={handleStatus} className="qd-btn">
                    {questionObj.status === 'unused' && 'Open Question'}
                    {questionObj.status === 'open' && 'Close Question'}
                    {(questionObj.status === 'closed' || questionObj.status === 'released') && 'Reopen Question'}
                  </button>
                )}
              </>
            ) : (
              <>
                <button type="button" onClick={onUpdate} className="qd-btn">Edit</button>
                <button type="button" onClick={handleDelete} className="qd-btn">Delete</button>
              </>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

QuestionDetails.propTypes = {
  questionObj: PropTypes.shape({
    question: PropTypes.string,
    image: PropTypes.string,
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
      firebaseKey: PropTypes.string,
    }),
    game: PropTypes.shape({
      name: PropTypes.string,
      status: PropTypes.string,
      firebaseKey: PropTypes.string,
    }),
  }).isRequired,
  host: PropTypes.bool,
  onUpdate: PropTypes.func,
  handleDelete: PropTypes.func,
};

QuestionDetails.defaultProps = {
  host: false,
  onUpdate: null,
  handleDelete: null,
};
