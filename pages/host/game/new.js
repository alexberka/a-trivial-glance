import React from 'react';
import GameForm from '../../../components/forms/GameForm';

export default function CreateGame() {
  return (
    <>
      <div className="header">
        <h1>New Game</h1>
      </div>
      <div className="content">
        <GameForm />
      </div>
    </>
  );
}
