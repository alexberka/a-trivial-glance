/* eslint-disable no-nested-ternary */
import React from 'react';
import PropTypes from 'prop-types';
import Link from 'next/link';

export default function GameCard({ gameObj, host }) {
  return (
    // If host is set to true, clicking the card will direct to the game's details page with host tools
    // Otherwise, clicking will direct player to gameplay view (/game/[id])
    <Link passHref href={`${host ? '/host' : ''}/game/${gameObj.firebaseKey}`}>
      <div className="g-card">
        <div className="g-card-tags">
          <p className={`g-status status-${gameObj.status}`}>
            {gameObj.status.toUpperCase()}
          </p>
          {/* Include the date of game played if in host view (creates date from ISO String in database) */}
          {host && (
            <p className="g-card-infobox">
              {gameObj.status === 'closed'
                ? new Date(gameObj.dateLive)
                  .toDateString()
                  .split(' ')
                  .slice(1)
                  .join(' ')
                : gameObj.size === 1 ? (
                  '1 Question'
                ) : (
                  `${gameObj.size} Questions`
                )}
            </p>
          )}
        </div>
        <div>
          <p className="g-card-name">{gameObj.name}</p>
          <p className="g-card-location">{gameObj.location}</p>
        </div>
      </div>
    </Link>
  );
}

GameCard.propTypes = {
  gameObj: PropTypes.shape({
    name: PropTypes.string,
    location: PropTypes.string,
    status: PropTypes.string,
    dateLive: PropTypes.string,
    firebaseKey: PropTypes.string,
    size: PropTypes.number,
  }).isRequired,
  host: PropTypes.bool,
};

GameCard.defaultProps = {
  host: false,
};
