import { useRouter } from 'next/router';
import React, { useEffect, useState } from 'react';
import QuestionDetails from '../../../components/QuestionDetails';
import { useAuth } from '../../../utils/context/authContext';
import QuestionForm from '../../../components/forms/QuestionForm';
import { getQuestionById } from '../../../api/mergedData';
import { deleteQuestion } from '../../../api/questionsData';

export default function ManageQuestion() {
  const [question, setQuestion] = useState({});
  // Indicates whether page is in editing mode
  const [editing, setEditing] = useState(false);
  const router = useRouter();
  const { user } = useAuth();

  // 'qCheck' is the question object to check before setting it as the 'question' state
  const confirmAccess = (qCheck) => {
    // If non-host user is attempting to access the host panel for a question they did not create
    // OR the question endpoint does not exist
    // then redirect user to welcome page
    if (!qCheck.uid || qCheck.uid !== user.uid) {
      router.push('/');
    } else {
      // Otherwise, set that question as 'question' state
      setQuestion(qCheck);
    }
  };

  // Called in onUpdate to toggle 'editing' state
  const toggleEdit = () => {
    setEditing((prev) => !prev);
  };

  // Makes another call to firebase to retrieve the question data
  // (also includes category object from getQuestionById merge call)
  // 'toggle' can be set to false to bypass toggle of 'editing' state
  const onUpdate = (toggle = true) => {
    getQuestionById(router.query.id)
      .then(setQuestion)
      .then(() => { if (toggle) { toggleEdit(); } });
  };

  // Called to delete the question (passed into question details)
  const handleDelete = () => {
    if (window.confirm('Delete question?')) {
      // On confirmation, deletes question then redirects to all questions view
      deleteQuestion(router.query.id).then(() => router.push('/host/questions'));
    }
  };

  useEffect(() => {
    getQuestionById(router.query.id).then(confirmAccess);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <>
      {/* If the question state has been updated (that question.firebaseKey exists) */}
      {/* then display QuestionForm if editing, QuestionDetails if not */}
      {question.firebaseKey && (
        editing ? (
          <QuestionForm questionObj={question} onUpdate={onUpdate} />
        ) : (
          <QuestionDetails questionObj={question} host onUpdate={onUpdate} handleDelete={handleDelete} />
        )
      )};
    </>
  );
}
