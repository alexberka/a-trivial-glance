import React from 'react';
import PropTypes from 'prop-types';
import { updateResponse } from '../../api/responsesData';

export default function HostResponsePanel({ responses, onUpdate }) {
  const handleClick = (e) => {
    const [grade, firebaseKey] = e.target.value.split(' ');
    updateResponse({ firebaseKey, grade }).then(() => onUpdate());
  };

  // eslint-disable-next-line consistent-return
  const sortResponses = (a, b) => {
    if (a.grade === 'NA') {
      if ((a.grade === b.grade && a.timeSubmitted < b.timeSubmitted) || a.grade !== b.grade) {
        // if both are ungraded AND a is an older response than b
        // OR a is ungraded and b is not
        // then sort a first
        return -1;
      // eslint-disable-next-line no-else-return
      } else if (a.timeSubmitted > b.timeSubmitted) {
        // else if b is an older response than a (and implicitly both are ungraded)
        // sort b first
        return 1;
      }
    } else if (b.grade === 'NA') {
      // if b is ungraded (and implicitly a is not, given the first if)
      // then sort b first
      return 1;
    } else if (a.timeSubmitted < b.timeSubmitted) {
      // if both are graded (given first two conditions)
      // and a is older than b
      // then sort b first
      return 1;
    } else if (a.timeSubmitted > b.timeSubmitted) {
      // if both are graded (given first two conditions)
      // and b is older than a
      // then sort a first
      return -1;
    } else {
      // if both are graded/ungraded and of equal timestamp (improbable)
      // sort evenly
      return 0;
    }
  };

  return (
    <div className="response-container host-res">
      <div className="response-tab">
        <p className={responses.some((res) => res.grade === 'NA') ? 'new-responses' : ''}>Responses</p>
        <div className="tab-shadow-cover" />
      </div>
      <div className="response-panel">
        <div className="res-card-container">
          {responses
            .sort((a, b) => sortResponses(a, b))
            .map((res) => (
              <div key={res.firebaseKey} className={`res-card grade-${res.grade}`}>
                {res.grade === 'NA' ? (
                  <>
                    <button type="button" value={`correct ${res.firebaseKey}`} onClick={handleClick}>Correct</button>
                    <button type="button" value={`incorrect ${res.firebaseKey}`} onClick={handleClick}>Incorrect</button>
                  </>
                ) : (
                  <button
                    type="button"
                    value={`${res.grade === 'correct' ? 'incorrect' : 'correct'} ${res.firebaseKey}`}
                    onClick={handleClick}
                  >
                    {`Mark ${res.grade === 'correct' ? 'Incorrect' : 'Correct'}`}
                  </button>
                )}
                {res.question && (
                  <p>Q: {res.question.length > 30 ? `${res.question.slice(0, 30)}...` : res.question}&emsp;A: {res.answer}</p>
                )}
                <p className="res-card-team">{res.team.name}</p>
                <p className="res-card-response">{res.response}</p>
                {res.grade !== 'NA' && (<p className="res-card-grade">{res.grade}</p>)}
              </div>
            ))}
        </div>
      </div>
    </div>
  );
}

HostResponsePanel.propTypes = {
  responses: PropTypes.arrayOf(PropTypes.shape({
    firebaseKey: PropTypes.string,
    team: PropTypes.shape({
      name: PropTypes.string,
    }),
    question: PropTypes.string,
    answer: PropTypes.string,
  })).isRequired,
  onUpdate: PropTypes.func.isRequired,
};
