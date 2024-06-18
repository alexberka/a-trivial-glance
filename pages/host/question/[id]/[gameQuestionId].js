/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect, useRef, useState } from 'react';
import { useRouter } from 'next/router';
import QuestionDetails from '../../../../components/QuestionDetails';
import { getFullGameQuestion } from '../../../../api/mergedData';

export default function ManageGameQuestion() {
  const [question, setQuestion] = useState({});
  const router = useRouter();
  const isMounted = useRef(false);

  useEffect(() => {
    isMounted.current = true;

    return () => { (isMounted.current = false); };
  }, []);

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
