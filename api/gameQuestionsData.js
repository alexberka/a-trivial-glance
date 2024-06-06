import { clientCredentials } from '../utils/client';

const ENDPOINT = clientCredentials.databaseURL;

const getGameQuestionsByHost = (uid) => new Promise((resolve, reject) => {
  fetch(`${ENDPOINT}/gameQuestions.json?orderBy="uid"&equalTo="${uid}"`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application.json',
    },
  })
    .then((response) => response.json())
    .then((data) => resolve(data ? Object.values(data) : []))
    .catch(reject);
});

const getGameQuestionsByGame = (gameId) => new Promise((resolve, reject) => {
  fetch(`${ENDPOINT}/gameQuestions.json?orderBy="gameId"&equalTo="${gameId}"`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application.json',
    },
  })
    .then((response) => response.json())
    .then((data) => resolve(data ? Object.values(data) : []))
    .catch(reject);
});

const getGameQuestionsByQuestion = (questionId) => new Promise((resolve, reject) => {
  fetch(`${ENDPOINT}/gameQuestions.json?orderBy="questionId"&equalTo="${questionId}"`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application.json',
    },
  })
    .then((response) => response.json())
    .then((data) => resolve(data ? Object.values(data) : []))
    .catch(reject);
});

const getGameQuestionById = (firebaseKey) => new Promise((resolve, reject) => {
  fetch(`${ENDPOINT}/gameQuestions/${firebaseKey}.json`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application.json',
    },
  })
    .then((response) => response.json())
    .then(resolve)
    .catch(reject);
});

const createGameQuestion = (payload) => new Promise((resolve, reject) => {
  fetch(`${ENDPOINT}/gameQuestions.json`, {
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

const updateGameQuestion = (payload) => new Promise((resolve, reject) => {
  fetch(`${ENDPOINT}/gameQuestions/${payload.firebaseKey}.json`, {
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

const deleteGameQuestion = (firebaseKey) => new Promise((resolve, reject) => {
  fetch(`${ENDPOINT}/gameQuestions/${firebaseKey}.json`, {
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
  getGameQuestionsByHost,
  getGameQuestionsByGame,
  getGameQuestionsByQuestion,
  getGameQuestionById,
  createGameQuestion,
  updateGameQuestion,
  deleteGameQuestion,
};
