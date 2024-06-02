import React from 'react';
import PropTypes from 'prop-types';
import { Image } from 'react-bootstrap';
import CategoryDropdown from './forms/CategoryDropdown';

export default function QuestionDetails({ questionObj, host, onUpdate }) {
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
          {questionObj.status === 'closed' && (`Last Used: ${questionObj.timeOpened.split('T')[0]}`)}
        </p>
        )}
        {host && (
          <div className="qd-host-tools">
            {questionObj.status === 'closed' && (<button type="button">Reset</button>)}
            <button type="button">
              {questionObj.status === 'unused' && 'Open'}
              {questionObj.status === 'open' && 'Close'}
              {questionObj.status === 'closed' && 'Reopen'}
            </button>
            <button type="button" onClick={onUpdate}>Edit</button>
            <button type="button">Delete</button>
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
};

QuestionDetails.defaultProps = {
  host: false,
  onUpdate: null,
};
