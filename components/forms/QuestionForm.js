import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { Form } from 'react-bootstrap';
import { useRouter } from 'next/router';
import CategoryDropdown from './CategoryDropdown';
import { createQuestion, updateQuestion } from '../../api/questionsData';
import { useAuth } from '../../utils/context/authContext';

// When no questionObj is passed as a prop, create template for new question (assigned to questionObj in defaultProps)
const nullQuestion = {
  question: '',
  image: '',
  answer: '',
  categoryId: '',
  lastUsed: 'never',
};

// 'questionObj' contains information to populate form on edit
// 'onUpdate' is the page's update function following submission (or cancellation) of the form
export default function QuestionForm({ questionObj, onUpdate }) {
  const [formInput, setFormInput] = useState(questionObj);
  const router = useRouter();
  const { user } = useAuth();

  // On any change to form, update the formInput
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormInput((prev) => ({ ...prev, [name]: value }));
  };

  // Called on form submit
  const handleSubmit = (e) => {
    e.preventDefault();
    if (formInput.firebaseKey) {
      // NOTE: With QuestionForm nested in '/host/question/[id]', the questionObj is retrieved via merge call,
      // which adds category information to the object, and then passed to both QuestionDetails and QuestionForm,
      // depending on the 'editing' state. This extra information is only used in the former, and must be removed
      // from the question prior to updating to maintain clean data.
      // Category firebase key is still included via formInput.categoryId
      delete formInput.category;
      updateQuestion(formInput).then(onUpdate);
    } else {
      const payload = { ...formInput, uid: user.uid };
      createQuestion(payload).then(({ name }) => {
        // Push user to question details page for newly created question
        updateQuestion({ firebaseKey: name }).then(() => router.push(`/host/question/${name}`));
      });
    }
  };

  return (
    // Structure and classes mirror those of QuestionDetails
    <Form className={`question-details ${router.pathname.includes('new') && 'qf-standalone'}`} onSubmit={handleSubmit}>
      <div className="qd-info">
        <Form.Group>
          <h2>Question*</h2>
          <hr />
          <Form.Control className="qf-input" name="question" value={formInput.question || ''} onChange={handleChange} />
        </Form.Group>
        <Form.Group>
          <h2>Image URL</h2>
          <hr />
          <Form.Control className="qf-input" name="image" value={formInput.image || ''} onChange={handleChange} />
        </Form.Group>
        <Form.Group>
          <h2>Answer*</h2>
          <hr />
          <Form.Control className="qf-input" name="answer" value={formInput.answer || ''} onChange={handleChange} />
        </Form.Group>
      </div>
      <div className="qd-buttons">
        <Form.Group>
          {/* See CategoryDropdown.js for prop notes */}
          <CategoryDropdown selectedCategoryId={questionObj.categoryId} questionId={questionObj.firebaseKey} form={handleChange} />
        </Form.Group>
        <div className="qd-host-tools">
          {/* Submission is locked if question, answer, or categoryId (from CategoryDropdown) are blank */}
          <button
            type="submit"
            className="std-btn qd-btn"
            disabled={formInput.question === '' || formInput.answer === '' || formInput.categoryId === ''}
          >
            {questionObj.firebaseKey ? 'Save Changes' : 'Create'}
          </button>
          {/* If no onUpdate behavior is provided, return to all questions page upon Cancel */}
          <button type="button" className="std-btn qd-btn" onClick={onUpdate || (() => router.push('/host/questions'))}>Cancel</button>
        </div>
      </div>
    </Form>
  );
}

QuestionForm.propTypes = {
  questionObj: PropTypes.shape({
    question: PropTypes.string,
    image: PropTypes.string,
    answer: PropTypes.string,
    categoryId: PropTypes.string,
    firebaseKey: PropTypes.string,
    category: PropTypes.shape({
      name: PropTypes.string,
      color: PropTypes.string,
      firebaseKey: PropTypes.string,
    }),
  }),
  onUpdate: PropTypes.func,
};

QuestionForm.defaultProps = {
  questionObj: nullQuestion,
  onUpdate: null,
};
