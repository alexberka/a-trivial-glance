/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import QuestionDetails from '../../../../components/QuestionDetails';
import { getFullGameQuestion } from '../../../../api/mergedData';

export default function ManageGameQuestion() {
  const [question, setQuestion] = useState({});
  const router = useRouter();

  const onUpdate = () => {
    getFullGameQuestion(router.query.gameQuestionId).then(setQuestion);
  };

  useEffect(() => {
    onUpdate();
  }, []);

  return (
    <div>
      {question.firebaseKey && (<QuestionDetails questionObj={question} host onUpdate={onUpdate} />)}
    </div>
  );
}
