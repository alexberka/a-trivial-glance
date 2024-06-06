import React from 'react';
import PropTypes from 'prop-types';
import { Image } from 'react-bootstrap';
import Link from 'next/link';
import CategoryDropdown from './forms/CategoryDropdown';
import { getOpenQuestion, updateQuestion } from '../api/questionsData';
import { useAuth } from '../utils/context/authContext';

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
  const { user } = useAuth();

  // Called from handleStatus when 'Open/Close/Reopen' or 'Reset' buttons are clicked.
  // Accepts payload (including question's firebase key and new status)
  // and closeId (firebase key of question to close).
  const updateStatus = (payload, closeId = '') => {
    if (closeId) {
      // If a question needs to be closed first, close the currently open question
      updateQuestion({ firebaseKey: closeId, status: 'closed' })
        // Then open the new question
        .then(() => updateQuestion(payload))
        // NOTE: The onUpdate function passed from '/host/question/[id]' will take a parameter indicating whether
        // to toggle the page's 'editing' state. As the status update buttons are visible outside of editing mode.
        // clicking them should not cause the state to toggle, and thus onUpdate(false) is called.
        .then(() => onUpdate(false));
    } else {
      // Otherwise open the question and update the page
      updateQuestion(payload).then(() => onUpdate(false));
    }
  };

  // Called when 'Open/Close/Reopen' and 'Reset' buttons are clicked
  // Accepts event information, if necessary
  const handleStatus = (e) => {
    // NOTE: The 'Reset' button has a value of 'reset', other buttons have an empty string. The trigger will then
    // default to the current status of the question.
    const trigger = e.target.value || questionObj.gameQuestion.status;
    // Initialize payload with question's Firebase key
    const payload = { firebaseKey: questionObj.gameQuestion.firebaseKey };
    switch (trigger) {
      case 'reset':
        // If the 'Reset' button was clicked, confirm with user that this is the desired action.
        if (window.confirm('Are you sure you want to reset this question? The timestamp will be lost')) {
          // Then reset it
          updateStatus({ ...payload, status: 'unused', timeOpened: 'never' });
        }
        break;
      case 'open':
        // If the question is currently open, then close it.
        updateStatus({ ...payload, status: 'closed' });
        break;
      case 'closed':
      case 'unused':
        // If the question is closed or unused and user is attempting to open it,
        // check first for another open question
        getOpenQuestion().then(([openQ]) => {
          if (openQ && openQ.uid !== user.uid) {
            // If a question is open that does NOT belong to the user, do not close it
            // User must wait for other question to be closed before opening theirs
            window.alert('Another user has an open question, wait until it is closed and try again');
          } else if (openQ && openQ.uid === user.uid) {
            // If a question is open that DOES belong to the user, give user option to close it
            if (window.confirm(`Another question is already open.\n\nClose\n\n'${openQ.question}'\n\nand open this question?`)) {
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
        <div>
          <h2>Answer</h2>
          <hr />
          <h4>{questionObj.answer}</h4>
        </div>
      </div>
      <div className="qd-buttons">
        {/* If in host view, use CategoryDropdown component (see CategoryDropdown.js for prop notes) */}
        {/* Otherwise display category as non-interactive element */}
        {host ? (
          <CategoryDropdown selectedCategoryId={questionObj.category.firebaseKey} questionId={questionObj.firebaseKey} />
        ) : (
          <p className="qd-status" style={{ background: `${questionObj.category.color}` }}>
            {questionObj.category.name.toUpperCase()}
          </p>
        )}
        {questionObj.gameQuestion && (
          <p className={`qd-status status-${questionObj.gameQuestion.status}`}>
            {questionObj.gameQuestion.status.toUpperCase()}
          </p>
        )}
        {/* If in player view, include button to return to current game */}
        {!host
        && (
          <Link passHref href="/game">
            <button type="button" className="qd-return">
              RETURN TO GAME
            </button>
          </Link>
        )}
        {/* If in host view, display the timestamp of the last day the question was used */}
        {host
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
        {/* If in host view, display status, edit, and delete host tools */}
        {host && (
          <div className="qd-host-tools">
            {questionObj.gameQuestion ? (
              <>
                {questionObj.gameQuestion.status === 'closed' && (
                  <button type="button" onClick={handleStatus} value="reset">Reset</button>
                )}
                <button type="button" onClick={handleStatus}>
                  {questionObj.gameQuestion.status === 'unused' && 'Open'}
                  {questionObj.gameQuestion.status === 'open' && 'Close'}
                  {questionObj.gameQuestion.status === 'closed' && 'Reopen'}
                </button>
              </>
            ) : (
              <>
                <button type="button" onClick={onUpdate}>Edit</button>
                <button type="button" onClick={handleDelete}>Delete</button>
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
    category: PropTypes.shape({
      name: PropTypes.string,
      color: PropTypes.string,
      firebaseKey: PropTypes.string,
    }),
    gameQuestion: PropTypes.shape({
      status: PropTypes.string,
      timeOpened: PropTypes.string,
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
