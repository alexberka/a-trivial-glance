import React from 'react';
import QuestionForm from '../../../components/forms/QuestionForm';

export default function CreateQuestion() {
  return (
    <>
      <div className="header">
        <h1>New Question</h1>
      </div>
      <div className="content">
        <QuestionForm />
      </div>
    </>
  );
}
