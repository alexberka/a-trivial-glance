/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { useAuth } from '../../utils/context/authContext';
import QuestionCard from '../../components/QuestionCard';
import { getQuestionsByHost } from '../../api/mergedData';

export default function HostQuestions() {
  const [questions, setQuestions] = useState([]);
  const { user } = useAuth();

  useEffect(() => {
    getQuestionsByHost(user.uid).then(setQuestions);
  }, []);

  return (
    <>
      <div className="questions-header">
        <h1 className="page-header">Questions</h1>
        <Link passHref href="/host/question/new">
          <button type="button" className="">New Question</button>
        </Link>
      </div>
      <div className="question-container">
        {questions.length ? questions.map((q) => <QuestionCard key={q.firebaseKey} questionObj={q} />) : (<span>Loading Questions</span>)}
      </div>
    </>
  );
}
