import { clientCredentials } from '../utils/client';

const ENDPOINT = clientCredentials.databaseURL;

const getTeamById = (firebaseKey) => new Promise((resolve, reject) => {
  fetch(`${ENDPOINT}/teams/${firebaseKey}.json`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application.json',
    },
  })
    .then((response) => response.json())
    .then(resolve)
    .catch(reject);
});

const getTeamsByUid = (uid) => new Promise((resolve, reject) => {
  fetch(`${ENDPOINT}/teams.json?orderBy="uid"&equalTo="${uid}"`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application.json',
    },
  })
    .then((response) => response.json())
    .then((data) => resolve(data ? Object.values(data) : []))
    .catch(reject);
});

const getTeamsByGameId = (gameId) => new Promise((resolve, reject) => {
  fetch(`${ENDPOINT}/teams.json?orderBy="gameId"&equalTo="${gameId}"`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application.json',
    },
  })
    .then((response) => response.json())
    .then((data) => resolve(data ? Object.values(data) : []))
    .catch(reject);
});

const createTeam = (payload) => new Promise((resolve, reject) => {
  fetch(`${ENDPOINT}/teams.json`, {
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

const updateTeam = (payload) => new Promise((resolve, reject) => {
  fetch(`${ENDPOINT}/teams/${payload.firebaseKey}.json`, {
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

const deleteTeam = (firebaseKey) => new Promise((resolve, reject) => {
  fetch(`${ENDPOINT}/teams/${firebaseKey}.json`, {
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
  getTeamById,
  getTeamsByUid,
  getTeamsByGameId,
  createTeam,
  updateTeam,
  deleteTeam,
};
