import React, { useState } from 'react';
import { Form } from 'react-bootstrap';
import PropTypes from 'prop-types';
import { createTeam, updateTeam } from '../../api/teamsData';

const nullTeam = {
  name: '',
};

// Separate uid and gameId only needed if teamObj is empty
export default function TeamForm({
  teamObj, uid, gameId, onUpdate,
}) {
  const [formInput, setFormInput] = useState(teamObj || nullTeam);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormInput((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (teamObj.firebaseKey) {
      if (teamObj.name !== formInput.name) {
        updateTeam({ ...formInput, firebaseKey: teamObj.firebaseKey }).then(onUpdate);
      } else {
        onUpdate();
      }
    } else {
      createTeam({ ...formInput, uid, gameId }).then(({ name }) => {
        updateTeam({ firebaseKey: name }).then(onUpdate);
      });
    }
  };

  return (
    <div className="team-form">
      <h1>{`${teamObj.firebaseKey ? 'Edit' : 'Pick a'} Team Name`}</h1>
      <Form onSubmit={handleSubmit} className="form-container">
        <Form.Control type="text" name="name" value={formInput.name} onChange={handleChange} />
        <button type="submit" className="util-btn std-btn" disabled={formInput.name === ''}>{teamObj.firebaseKey ? 'Update' : 'Submit'}</button>
      </Form>
    </div>
  );
}

TeamForm.propTypes = {
  teamObj: PropTypes.shape({
    name: PropTypes.string,
    gameId: PropTypes.string,
    firebaseKey: PropTypes.string,
  }),
  gameId: PropTypes.string,
  uid: PropTypes.string,
  onUpdate: PropTypes.func,
};

TeamForm.defaultProps = {
  teamObj: nullTeam,
  uid: null,
  gameId: null,
  onUpdate: null,
};
