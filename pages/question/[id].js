/* eslint-disable react-hooks/exhaustive-deps */
import { useRouter } from 'next/router';
import React, { useEffect, useState } from 'react';
import QuestionDetails from '../../components/QuestionDetails';
import { getQuestionById } from '../../api/mergedData';

export default function ReviewQuestion() {
  const router = useRouter();
  const [question, setQuestion] = useState({});

  useEffect(() => {
    getQuestionById(router.query.id)
      .then((q) => {
        if (q.status === 'closed') {
          setQuestion(q);
        } else {
          window.alert('Question Not Available');
          router.push('/game');
        }
      });
  }, []);

  return (
    <div>
      {question.question && <QuestionDetails questionObj={question} />}
    </div>
  );
}
