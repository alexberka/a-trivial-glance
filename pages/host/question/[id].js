import { useRouter } from 'next/router';
import React, { useEffect, useState } from 'react';
import { getQuestionById } from '../../../api/mergedData';
import QuestionDetails from '../../../components/QuestionDetails';

export default function ManageQuestion() {
  const router = useRouter();
  const [question, setQuestion] = useState({});

  useEffect(() => {
    getQuestionById(router.query.id).then(setQuestion);
  }, []);

  return (
    <div>
      {question.question && <QuestionDetails questionObj={question} host />}
    </div>
  );
}
