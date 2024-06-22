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
    let mounted = true;
    getQuestionsByHost(user.uid).then((data) => {
      if (mounted) { setQuestions(data); }
    });

    return () => { (mounted = false); };
  }, []);

  return (
    <>
      <div className="header">
        <h1>Questions</h1>
        <div className="header-misc">
          <Link passHref href="/host/question/new">
            <button type="button" className="std-btn">New Question</button>
          </Link>
        </div>
      </div>
      <div className="content">
        <div className="question-container">
          {questions.length ? (
            questions.map((q) => <QuestionCard key={q.firebaseKey} questionObj={q} host />)
          ) : (
            <span>Loading Questions</span>
          )}
        </div>
      </div>
    </>
  );
}
