import { clientCredentials } from '../utils/client';

const ENDPOINT = clientCredentials.databaseURL;

const getGames = () => new Promise((resolve, reject) => {
  fetch(`${ENDPOINT}/games.json`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application.json',
    },
  })
    .then((response) => response.json())
    .then((data) => resolve(data ? Object.values(data) : []))
    .catch(reject);
});

const getGamesByHost = (uid) => new Promise((resolve, reject) => {
  fetch(`${ENDPOINT}/games.json?orderBy="uid"&equalTo="${uid}"`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application.json',
    },
  })
    .then((response) => response.json())
    .then((data) => resolve(data ? Object.values(data) : []))
    .catch(reject);
});

const getLiveGames = () => new Promise((resolve, reject) => {
  fetch(`${ENDPOINT}/games.json?orderBy="isLive"&equalTo="${true}"`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application.json',
    },
  })
    .then((response) => response.json())
    .then((data) => resolve(data ? Object.values(data) : []))
    .catch(reject);
});

const getGameById = (firebaseKey) => new Promise((resolve, reject) => {
  fetch(`${ENDPOINT}/games/${firebaseKey}.json`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application.json',
    },
  })
    .then((response) => response.json())
    .then(resolve)
    .catch(reject);
});

const createGame = (payload) => new Promise((resolve, reject) => {
  fetch(`${ENDPOINT}/games.json`, {
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

const updateGame = (payload) => new Promise((resolve, reject) => {
  fetch(`${ENDPOINT}/games/${payload.firebaseKey}.json`, {
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

const deleteGameOnly = (firebaseKey) => new Promise((resolve, reject) => {
  fetch(`${ENDPOINT}/games/${firebaseKey}.json`, {
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
  getGames,
  getGamesByHost,
  getLiveGames,
  getGameById,
  createGame,
  updateGame,
  deleteGameOnly,
};
