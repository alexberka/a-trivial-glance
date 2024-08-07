import React, { useState } from 'react';
import { Form } from 'react-bootstrap';
import PropTypes from 'prop-types';
import Link from 'next/link';
import { createResponse, updateResponse } from '../../api/responsesData';

export default function PlayerResponsePanel({
  responses, teamObj, onUpdate, visibleQuestions,
}) {
  const currQ = visibleQuestions[0] || {};
  const currRes = responses.find((res) => res.gameQuestionId === currQ.gameQuestionId) || {};
  const otherQs = visibleQuestions.length > 1
    ? visibleQuestions.slice(1).map((q) => {
      const { response, grade } = responses.find((r) => r.gameQuestionId === q.gameQuestionId)
                    || { response: '<No Response>', grade: '' };
      return { ...q, response, grade };
    })
    : [];
  const score = `${responses
    .filter((res) => res.grade === 'correct'
                  && visibleQuestions
                    .some((q) => q.gameQuestionId === res.gameQuestionId
                              && q.status === 'released'))
    .length}/${visibleQuestions.filter((q) => q.status === 'released').length}`;
  const [formInput, setFormInput] = useState(currRes || { response: '' });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormInput((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const payload = {
      ...formInput,
      teamId: teamObj.firebaseKey,
      gameQuestionId: currQ.gameQuestionId,
      grade: 'NA',
      timeSubmitted: new Date().toISOString(),
    };
    if (formInput.firebaseKey) {
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
        {(currQ.status !== 'open' || currRes.firebaseKey) && !score.includes('/0') && (
          <p className="res-tab-score">
            {`(${score})`}
          </p>
        )}
        <p className={`res-tab-text ${currQ.status === 'open' && !currRes.firebaseKey && ('blinking')}`}>
          {currRes.firebaseKey || currQ.status !== 'open' ? `${teamObj.name}` : 'Submit Answer'}
        </p>
        <div className="tab-shadow-cover" />
      </div>
      <div className="response-panel">
        {currRes.firebaseKey || currQ.status !== 'open' ? (
          <div className={`res-card grade-${currQ.status !== 'released' ? 'NA' : currRes.grade}`}>
            <p className={currRes.response ? 'player-response res-card-response' : ''}>{currRes.response || (<i>No Response</i>)}</p>
            {currQ.status === 'released' && currRes.grade !== 'NA' ? (
              <p className="res-card-grade">{currRes.grade}</p>
            ) : currRes.grade && (
              <p className="res-card-grade">pending</p>
            )}
          </div>
        ) : (
          <Form onSubmit={handleSubmit} className="response-form">
            <input
              className="response-input"
              name="response"
              type="text"
              placeholder="Type answer..."
              value={formInput.response || ''}
              onChange={handleChange}
              onKeyDown={(e) => { if (e.key === 'Enter') { e.preventDefault(); } }}
            />
            <button type="submit" className="std-btn" disabled={formInput.response === ''}>Submit</button>
            <p>Warning: Answers are final and may not be edited once submitted</p>
          </Form>
        )}
        {otherQs.length > 0 && (
          <>
            <h6>Previous Questions</h6>
            <div className="res-card-container">
              {otherQs.map((q) => (
                <Link
                  key={q.firebaseKey}
                  passHref
                  href={`/question/${q.firebaseKey}/${q.gameQuestionId}`}
                >
                  <div className={`res-card grade-${q.status === 'released' ? q.grade : 'NA'}`}>
                    <div className="res-card-q">
                      {q.status === 'released' ? (
                        <>
                          <p>Q: {q.question.length > 30 ? `${q.question.slice(0, 30)}...` : q.question}</p>
                          <p>A: {q.answer}</p>
                        </>
                      ) : (
                        <p>Q: {q.question.length > 50 ? `${q.question.slice(0, 50)}...` : q.question}</p>
                      )}
                    </div>
                    <p className={q.grade && ('res-card-response')}>{q.response}</p>
                    {q.grade && (
                      <p className="res-card-grade">
                        {q.grade !== 'NA' && q.status === 'released' ? q.grade : 'pending'}
                      </p>
                    )}
                  </div>
                </Link>
              ))}
            </div>
          </>
        )}
      </div>
    </div>
  );
}

PlayerResponsePanel.propTypes = {
  responses: PropTypes.arrayOf(PropTypes.shape({
    firebaseKey: PropTypes.string,
    teamId: PropTypes.string,
    gameQuestionId: PropTypes.string,
    response: PropTypes.string,
    grade: PropTypes.string,
  })).isRequired,
  teamObj: PropTypes.shape({
    name: PropTypes.string,
    firebaseKey: PropTypes.string,
  }).isRequired,
  onUpdate: PropTypes.func.isRequired,
  visibleQuestions: PropTypes.arrayOf(PropTypes.shape({
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
  })).isRequired,
};
