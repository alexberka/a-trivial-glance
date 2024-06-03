import { useRouter } from 'next/router';
import React, { useEffect, useState } from 'react';
import QuestionDetails from '../../../components/QuestionDetails';
import { useAuth } from '../../../utils/context/authContext';
import QuestionForm from '../../../components/forms/QuestionForm';
import { getQuestionById } from '../../../api/mergedData';
import { deleteQuestion } from '../../../api/questionsData';

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

  const onUpdate = (toggle = true) => {
    getQuestionById(router.query.id)
      .then(setQuestion)
      .then(() => { if (toggle) { toggleEdit(); } });
  };

  const handleDelete = () => {
    if (window.confirm('Delete question?')) {
      deleteQuestion(router.query.id).then(() => router.push('/host/questions'));
    }
  };

  useEffect(() => {
    getQuestionById(router.query.id).then(confirmAccess);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <>
      {question.question && (
        editing ? (
          <QuestionForm questionObj={question} onUpdate={onUpdate} />
        ) : (
          <QuestionDetails questionObj={question} host onUpdate={onUpdate} handleDelete={handleDelete} />
        )
      )};
    </>
  );
}
