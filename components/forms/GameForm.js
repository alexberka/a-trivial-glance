/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect, useState } from 'react';
import { Form } from 'react-bootstrap';
import PropTypes from 'prop-types';
import { useRouter } from 'next/router';
import { createGame, updateGame } from '../../api/gameData';
import { useAuth } from '../../utils/context/authContext';

const nullGame = {
  name: '',
  location: '',
  status: 'unused',
  dateLive: 'never',
};
export default function GameForm({ gameObj }) {
  const [formInput, setFormInput] = useState(nullGame);
  const router = useRouter();
  const { user } = useAuth();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormInput((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (gameObj.firebaseKey) {
      updateGame(formInput).then(() => router.push(`/host/game/${gameObj.firebaseKey}`));
    } else {
      createGame({ ...formInput, uid: user.uid }).then(({ name }) => {
        updateGame({ firebaseKey: name }).then(() => router.push(`/host/game/${name}`));
      });
    }
  };

  useEffect(() => {
    if (gameObj.firebaseKey) { setFormInput(gameObj); }
  }, [gameObj.firebaseKey]);

  return (
    <div>
      <Form className="game-form" onSubmit={handleSubmit}>
        <Form.Group className="mb-3" controlId="name">
          <Form.Label className="gf-label">Name*</Form.Label>
          <hr />
          <Form.Control
            className="gf-input"
            type="text"
            placeholder=""
            name="name"
            value={formInput.name}
            onChange={handleChange}
          />
        </Form.Group>
        <Form.Group className="mb-3" controlId="location">
          <Form.Label className="gf-label">Location*</Form.Label>
          <hr />
          <Form.Control
            className="gf-input"
            type="text"
            name="location"
            value={formInput.location}
            onChange={handleChange}
          />
        </Form.Group>
        <div className="gf-buttons">
          <button
            type="submit"
            className="std-btn"
            disabled={!formInput.name || !formInput.location}
          >
            {gameObj.firebaseKey ? 'Update Game' : 'Create'}
          </button>
          <button
            type="button"
            className="std-btn"
            onClick={() => router.push(router.pathname.includes('/new') ? '/host/games' : `/host/game/${gameObj.firebaseKey}`)}
          >
            Cancel
          </button>
        </div>
      </Form>
    </div>
  );
}

GameForm.propTypes = {
  gameObj: PropTypes.shape({
    firebaseKey: PropTypes.string,
    name: PropTypes.string,
    location: PropTypes.string,
  }),
};

GameForm.defaultProps = {
  gameObj: nullGame,
};
