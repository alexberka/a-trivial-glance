import React, { useEffect, useState } from 'react';
import GameDisplay from '../components/GameDisplay';
import { getQuestions } from '../api/mergedData';

export default function PlayerGame() {
  const [questions, setQuestions] = useState();

  // Update /game page every two seconds to reflect opening/closing/editing of questions by host
  useEffect(() => {
    const interval = setInterval(() => {
      getQuestions().then(setQuestions);
    }, 2000);

    return () => clearInterval(interval);
  }, [questions]);

  useEffect(() => {
    getQuestions().then(setQuestions);
  }, []);

  return (
    <div>
      {questions && (<GameDisplay questions={questions} />)}
    </div>
  );
}
