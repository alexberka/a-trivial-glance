/* eslint-disable react-hooks/exhaustive-deps */
import { useRouter } from 'next/router';
import React, { useEffect, useState } from 'react';
import { getFullGameQuestion } from '../../../api/mergedData';
import QuestionDetails from '../../../components/QuestionDetails';

export default function ReviewGameQuestion() {
  const router = useRouter();
  const [question, setQuestion] = useState({});

  useEffect(() => {
    let mounted = true;
    getFullGameQuestion(router.query.gameQuestionId)
      .then((q) => {
        // Only allow player access to view questions that are closed
        if (q.game.status === 'live' && (q.status === 'closed' || q.status === 'released') && mounted) {
          setQuestion(q);
        } else {
          // Otherwise, redirect to '/game'
          window.alert('Question Not Available');
          if (q.game.status !== 'live') {
            router.push('/games');
          } else {
            router.push(`/game/${q.game.firebaseKey}`);
          }
        }
      });

    return () => { (mounted = false); };
  }, []);

  return (
    <>
      {question.question && <QuestionDetails questionObj={question} />}
    </>
  );
}
