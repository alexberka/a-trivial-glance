import React from 'react';
import PropTypes from 'prop-types';
import Link from 'next/link';

export default function QuestionCard({ questionObj }) {
  return (
    <Link passHref href={`/host/question/${questionObj.firebaseKey}`}>
      <div className="q-card">
        <div className="q-card-tags">
          <p className="q-category" style={{ background: `${questionObj.category.color}` }}>
            {questionObj.category.name.toUpperCase()}
          </p>
          <p className={`q-status status-${questionObj.status}`}>
            {questionObj.status.toUpperCase()}
          </p>
          <p className="q-timestamp">{questionObj.status === 'closed' && (`Last Used: ${questionObj.timeOpened.split('T')[0]}`)}</p>
        </div>
        <p className="q-card-text">
          {questionObj.question}
        </p>
      </div>
    </Link>
  );
}

QuestionCard.propTypes = {
  questionObj: PropTypes.shape({
    question: PropTypes.string,
    answer: PropTypes.string,
    status: PropTypes.string,
    timeOpened: PropTypes.string,
    firebaseKey: PropTypes.string,
    category: PropTypes.shape({
      name: PropTypes.string,
      color: PropTypes.string,
    }),
  }).isRequired,
};
