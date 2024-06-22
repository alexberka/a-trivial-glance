import React from 'react';
import GameForm from '../../../components/forms/GameForm';

export default function CreateGame() {
  return (
    <>
      <h1 className="header">New Game</h1>
      <div className="content">
        <GameForm />
      </div>
    </>
  );
}
