import React from 'react';
import PropTypes from 'prop-types';
import Link from 'next/link';

// 'questionObj' includes a single question object with associated category object
// 'host' is a boolean that indicates whether user is in host view or not (defaults to false)
export default function QuestionCard({ questionObj, host }) {
  return (
    // If host is set to true, clicking the card will direct to the question's details page with host tools
    // Otherwise, clicking will direct to player view of question (/question/[id] redirects if question isn't closed)
    <Link passHref href={`${host ? '/host' : ''}/question/${questionObj.firebaseKey}`}>
      <div className="q-card">
        <div className="q-card-tags">
          <p className="q-category" style={{ background: `${questionObj.category.color}` }}>
            {questionObj.category.name.toUpperCase()}
          </p>
          <p className={`q-status status-${questionObj.status}`}>
            {questionObj.status.toUpperCase()}
          </p>
          {/* Include the date of last usage if in host view (creates date from ISO String in database) */}
          {host && (
            <p className="q-timestamp">
              {questionObj.status === 'closed' && (
                `Last Used: ${new Date(questionObj.timeOpened)
                  .toDateString()
                  .split(' ')
                  .slice(1)
                  .join(' ')}`)}
            </p>
          )}
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
  host: PropTypes.bool,
};

QuestionCard.defaultProps = {
  host: false,
};
