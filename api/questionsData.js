import { clientCredentials } from '../utils/client';

const ENDPOINT = clientCredentials.databaseURL;

const getQuestions = () => new Promise((resolve, reject) => {
  fetch(`${ENDPOINT}/questions.json`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application.json',
    },
  })
    .then((response) => response.json())
    .then((data) => resolve(data ? Object.values(data) : []))
    .catch(reject);
});

const getQuestionsByHostNoCats = (uid) => new Promise((resolve, reject) => {
  fetch(`${ENDPOINT}/questions.json?orderBy="uid"&equalTo="${uid}"`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application.json',
    },
  })
    .then((response) => response.json())
    .then((data) => resolve(data ? Object.values(data) : []))
    .catch(reject);
});

const getQuestionByIdNoCat = (firebaseKey) => new Promise((resolve, reject) => {
  fetch(`${ENDPOINT}/questions/${firebaseKey}.json`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application.json',
    },
  })
    .then((response) => response.json())
    .then(resolve)
    .catch(reject);
});

const createQuestion = (payload) => new Promise((resolve, reject) => {
  fetch(`${ENDPOINT}/questions.json`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application.json',
    },
    body: JSON.stringify(payload),
  })
    .then((response) => response.json())
    .then(resolve)
    .catch(reject);
});

const updateQuestion = (payload) => new Promise((resolve, reject) => {
  fetch(`${ENDPOINT}/questions/${payload.firebaseKey}.json`, {
    method: 'PATCH',
    headers: {
      'Content-Type': 'application.json',
    },
    body: JSON.stringify(payload),
  })
    .then((response) => response.json())
    .then(resolve)
    .catch(reject);
});

const deleteQuestion = (firebaseKey) => new Promise((resolve, reject) => {
  fetch(`${ENDPOINT}/questions/${firebaseKey}.json`, {
    method: 'DELETE',
    headers: {
      'Content-Type': 'application.json',
    },
  })
    .then((response) => response.json())
    .then(resolve)
    .catch(reject);
});

export {
  getQuestions,
  getQuestionsByHostNoCats,
  getQuestionByIdNoCat,
  createQuestion,
  updateQuestion,
  deleteQuestion,
};
