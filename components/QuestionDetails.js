import React from 'react';
import PropTypes from 'prop-types';
import { Image } from 'react-bootstrap';
import CategoryDropdown from './forms/CategoryDropdown';
import { getOpenQuestion, updateQuestion } from '../api/questionsData';
import { useAuth } from '../utils/context/authContext';

export default function QuestionDetails({
  questionObj, host, onUpdate, handleDelete,
}) {
  const { user } = useAuth();

  const updateStatus = (payload, closeId = '') => {
    console.warn(payload, closeId);
    if (closeId) {
      updateQuestion({ firebaseKey: closeId, status: 'closed' })
        .then(() => updateQuestion(payload))
        .then(() => onUpdate(false));
    } else {
      updateQuestion(payload).then(() => onUpdate(false));
    }
  };

  const handleStatus = (e) => {
    // Set to 'reset' if reset is clicked, else observe current status of question
    const trigger = e.target.value || questionObj.status;
    const payload = { firebaseKey: questionObj.firebaseKey };
    switch (trigger) {
      case 'reset':
        if (window.confirm('Are you sure you want to reset this question? The timestamp will be lost')) {
          updateStatus({ ...payload, status: 'unused', timeOpened: 'never' });
        }
        break;
      case 'open':
        // If the question is currently open, then close it.
        updateStatus({ ...payload, status: 'closed' });
        break;
      case 'closed':
      case 'unused':
        getOpenQuestion().then(([openQ]) => {
          if (openQ && openQ.uid !== user.uid) {
            window.alert('Another user has an open question, wait until it is closed and try again');
          } else if (openQ && openQ.uid === user.uid) {
            if (window.confirm(`Another question is already open.\n\nClose\n\n'${openQ.question}'\n\nand open this question?`)) {
              updateStatus({ ...payload, status: 'open', timeOpened: new Date().toISOString() }, openQ.firebaseKey);
            }
          } else {
            updateStatus({ ...payload, status: 'open', timeOpened: new Date().toISOString() });
          }
        });
        break;
      default:
        break;
    }
  };

  return (
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
        {host ? (
          <CategoryDropdown selectedCategoryId={questionObj.category.firebaseKey} questionId={questionObj.firebaseKey} />
        ) : (
          <p className="qd-status" style={{ background: `${questionObj.category.color}` }}>
            {questionObj.category.name.toUpperCase()}
          </p>
        )}
        <p className={`qd-status status-${questionObj.status}`}>
          {questionObj.status.toUpperCase()}
        </p>
        {host
        && (
        <p className="qd-timestamp">
          {questionObj.status === 'closed' && (
            `Last Used: ${new Date(questionObj.timeOpened).toDateString()}`)}
        </p>
        )}
        {host && (
          <div className="qd-host-tools">
            {questionObj.status === 'closed' && (<button type="button" onClick={handleStatus} value="reset">Reset</button>)}
            <button type="button" onClick={handleStatus}>
              {questionObj.status === 'unused' && 'Open'}
              {questionObj.status === 'open' && 'Close'}
              {questionObj.status === 'closed' && 'Reopen'}
            </button>
            <button type="button" onClick={onUpdate}>Edit</button>
            <button type="button" onClick={handleDelete}>Delete</button>
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
    status: PropTypes.string,
    timeOpened: PropTypes.string,
    firebaseKey: PropTypes.string,
    category: PropTypes.shape({
      name: PropTypes.string,
      color: PropTypes.string,
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
