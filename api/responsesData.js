import { clientCredentials } from '../utils/client';

const ENDPOINT = clientCredentials.databaseURL;

const getResponsesByTeamId = (teamId) => new Promise((resolve, reject) => {
  fetch(`${ENDPOINT}/responses.json?orderBy="teamId"&equalTo="${teamId}"`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application.json',
    },
  })
    .then((response) => response.json())
    .then((data) => resolve(data ? Object.values(data) : []))
    .catch(reject);
});

const getResponsesByGameQuestionId = (gameQuestionId) => new Promise((resolve, reject) => {
  fetch(`${ENDPOINT}/responses.json?orderBy="gameQuestionId"&equalTo="${gameQuestionId}"`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application.json',
    },
  })
    .then((response) => response.json())
    .then((data) => resolve(data ? Object.values(data) : []))
    .catch(reject);
});

const createResponse = (payload) => new Promise((resolve, reject) => {
  fetch(`${ENDPOINT}/responses.json`, {
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

const updateResponse = (payload) => new Promise((resolve, reject) => {
  fetch(`${ENDPOINT}/responses/${payload.firebaseKey}.json`, {
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

const deleteResponse = (firebaseKey) => new Promise((resolve, reject) => {
  fetch(`${ENDPOINT}/responses/${firebaseKey}.json`, {
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
  getResponsesByTeamId,
  getResponsesByGameQuestionId,
  createResponse,
  updateResponse,
  deleteResponse,
};
