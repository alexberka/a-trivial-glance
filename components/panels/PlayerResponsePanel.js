import React, { useState } from 'react';
import { Form } from 'react-bootstrap';
import PropTypes from 'prop-types';
import { createResponse, updateResponse } from '../../api/responsesData';

export default function PlayerResponsePanel({ responseObj, onUpdate, questionStatus }) {
  const [formInput, setFormInput] = useState(responseObj);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormInput((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const payload = { ...formInput, grade: 'NA', timeSubmitted: new Date().toISOString() };
    if (responseObj.firebaseKey) {
      updateResponse(payload);
    } else {
      createResponse(payload).then(({ name }) => {
        updateResponse({ firebaseKey: name }).then(() => onUpdate());
      });
    }
  };

  return (
    <div className="response-container">
      <div className="response-tab">
        <p className={`${questionStatus === 'open' && !responseObj.firebaseKey && ('blinking')}`}>
          {responseObj.firebaseKey || questionStatus !== 'open' ? 'Your Answer' : 'Submit Answer'}
        </p>
        <div className="tab-shadow-cover" />
      </div>
      <div className="response-panel">
        {responseObj.firebaseKey || questionStatus !== 'open' ? (
          <>
            <p className={responseObj.response ? 'player-response' : ''}>{responseObj.response || (<i>No Response</i>)}</p>
            {questionStatus === 'released' && responseObj.grade !== 'NA' && (<span>{responseObj.grade}</span>)}
          </>
        ) : (
          <Form onSubmit={handleSubmit}>
            <input
              className="response-input"
              name="response"
              type="text"
              placeholder="Type answer..."
              value={formInput.response || ''}
              onChange={handleChange}
              onKeyDown={(e) => { if (e.key === 'Enter') { e.preventDefault(); } }}
            />
            <button type="submit" disabled={formInput.response === ''}>Submit</button>
            <p>Warning: Answers are final and may not be edited once submitted</p>
          </Form>
        )}
      </div>
    </div>
  );
}

PlayerResponsePanel.propTypes = {
  responseObj: PropTypes.shape({
    firebaseKey: PropTypes.string,
    teamId: PropTypes.string,
    gameQuestionId: PropTypes.string,
    response: PropTypes.string,
    grade: PropTypes.string,
  }).isRequired,
  onUpdate: PropTypes.func.isRequired,
  questionStatus: PropTypes.string.isRequired,
};
