import React, { useState } from 'react';
import PropTypes from 'prop-types';
import TeamForm from '../forms/TeamForm';

export default function TeamPanel({ teamObj, onUpdate }) {
  const [editing, setEditing] = useState(false);

  const handleToggle = () => {
    if (editing) { onUpdate(); }
    setEditing((prev) => !prev);
  };

  return (
    <div className="team-panel">
      <button type="button" className="std-btn" onClick={handleToggle} disabled={editing}>
        Edit Name
      </button>
      {editing && (
        <TeamForm teamObj={teamObj} onUpdate={handleToggle} />
      )}
    </div>
  );
}

TeamPanel.propTypes = {
  teamObj: PropTypes.shape({
    name: PropTypes.string,
    firebaseKey: PropTypes.string,
  }).isRequired,
  onUpdate: PropTypes.func.isRequired,
};
