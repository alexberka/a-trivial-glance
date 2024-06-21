/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect, useRef, useState } from 'react';
import { useRouter } from 'next/router';
import QuestionDetails from '../../../../components/QuestionDetails';
import { getFullGameQuestion, getQuestionResponses } from '../../../../api/mergedData';
import HostResponsePanel from '../../../../components/panels/HostResponsePanel';

export default function ManageGameQuestion() {
  const [question, setQuestion] = useState({});
  const [responses, setResponses] = useState([]);
  const router = useRouter();
  const isMounted = useRef(false);

  useEffect(() => {
    isMounted.current = true;

    return () => { (isMounted.current = false); };
  }, []);

  const grabResponses = () => {
    getQuestionResponses(router.query.gameQuestionId).then((res) => {
      if (isMounted.current) { setResponses(res); }
    });
  };

  const onUpdate = () => {
    getFullGameQuestion(router.query.gameQuestionId).then((q) => {
      if (isMounted.current) { setQuestion(q); }
    });
    grabResponses();
  };

  useEffect(() => {
    onUpdate();
  }, []);

  // eslint-disable-next-line consistent-return
  useEffect(() => {
    if (question.status === 'open') {
      const interval = setInterval(() => {
        grabResponses();
      }, 2000);

      return () => clearInterval(interval);
    }
  }, [question.status]);

  return (
    <div>
      {question.firebaseKey && (<QuestionDetails questionObj={question} host onUpdate={onUpdate} />)}
      {question?.game?.status === 'live' && (<HostResponsePanel responses={responses} onUpdate={onUpdate} />)}
    </div>
  );
}
