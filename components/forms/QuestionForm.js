import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { Form } from 'react-bootstrap';
import { useRouter } from 'next/router';
import CategoryDropdown from './CategoryDropdown';
import { createQuestion, updateQuestion } from '../../api/questionsData';
import { useAuth } from '../../utils/context/authContext';

const nullQuestion = {
  question: '',
  image: '',
  answer: '',
  status: 'unused',
  timeOpened: 'never',
  categoryId: '',
};
export default function QuestionForm({ questionObj, onUpdate }) {
  const [formInput, setFormInput] = useState(questionObj);
  const router = useRouter();
  const { user } = useAuth();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormInput((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (formInput.firebaseKey) {
      delete formInput.category;
      updateQuestion(formInput).then(onUpdate);
    } else {
      const payload = { ...formInput, uid: user.uid };
      createQuestion(payload).then(({ name }) => {
        updateQuestion({ firebaseKey: name }).then(() => router.push(`/host/question/${name}`));
      });
    }
  };

  return (
    <Form className="question-details">
      <div className="qd-info">
        <Form.Group>
          <h2>Question*</h2>
          <hr />
          <Form.Control name="question" value={formInput.question || ''} onChange={handleChange} />
        </Form.Group>
        <Form.Group>
          <h2>Image URL</h2>
          <hr />
          <Form.Control name="image" value={formInput.image || ''} onChange={handleChange} />
        </Form.Group>
        <Form.Group>
          <h2>Answer*</h2>
          <hr />
          <Form.Control name="answer" value={formInput.answer || ''} onChange={handleChange} />
        </Form.Group>
      </div>
      <div className="qd-buttons">
        <Form.Group>
          <CategoryDropdown selectedCategoryId={questionObj.categoryId} questionId={questionObj.firebaseKey} form={handleChange} />
        </Form.Group>
        <div className="qd-host-tools">
          <button
            type="submit"
            onClick={handleSubmit}
            disabled={formInput.question === '' || formInput.answer === '' || formInput.categoryId === ''}
          >
            {questionObj.firebaseKey ? 'Save Changes' : 'Create'}
          </button>
          <button type="button" onClick={onUpdate || (() => router.push('/host/questions'))}>Cancel</button>
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
    status: PropTypes.string,
    timeOpened: PropTypes.string,
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
