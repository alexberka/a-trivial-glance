import { clientCredentials } from '../utils/client';

const ENDPOINT = clientCredentials.databaseURL;

const getCategories = () => new Promise((resolve, reject) => {
  fetch(`${ENDPOINT}/categories.json`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application.json',
    },
  })
    .then((response) => response.json())
    .then((data) => resolve(data))
    .catch(reject);
});

const getCategoryById = (firebaseKey) => new Promise((resolve, reject) => {
  fetch(`${ENDPOINT}/categories/${firebaseKey}.json`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application.json',
    },
  })
    .then((response) => response.json())
    .then(resolve)
    .catch(reject);
});

export {
  getCategories,
  getCategoryById,
};
