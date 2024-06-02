import { useRouter } from 'next/router';
import React, { useEffect, useState } from 'react';
import QuestionDetails from '../../../components/QuestionDetails';
import { useAuth } from '../../../utils/context/authContext';
import QuestionForm from '../../../components/forms/QuestionForm';
import { getQuestionById } from '../../../api/mergedData';

export default function ManageQuestion() {
  const router = useRouter();
  const [question, setQuestion] = useState({});
  const [editing, setEditing] = useState(false);
  const { user } = useAuth();

  const confirmAccess = (qCheck) => {
    // If non-host user is attempting to access editing panel for a question
    // OR question endpoint does not exist
    // then redirect user to welcome page
    if (!qCheck.uid || qCheck.uid !== user.uid) {
      router.push('/');
    } else {
      setQuestion(qCheck);
    }
  };

  const toggleEdit = () => {
    setEditing((prev) => !prev);
  };

  const onUpdate = () => {
    getQuestionById(router.query.id)
      .then(setQuestion)
      .then(() => toggleEdit());
  };

  useEffect(() => {
    getQuestionById(router.query.id).then(confirmAccess);
  }, []);

  return (
    <>
      {question.question && (
        editing ? (
          <QuestionForm questionObj={question} onUpdate={onUpdate} />
        ) : (
          <QuestionDetails questionObj={question} host onUpdate={onUpdate} />
        )
      )};
    </>
  );
}
