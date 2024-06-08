import { getCategories, getCategoryById } from './categoriesData';
import { deleteGameOnly, getGameById, getGamesByHost } from './gameData';
import { deleteGameQuestion, getGameQuestionsByGame } from './gameQuestionsData';
import { getQuestionByIdNoCat, getQuestionsByHostNoCats, getQuestionsNoCats } from './questionsData';

const getQuestions = async () => {
  const questions = await getQuestionsNoCats();
  const categories = await getCategories();
  const qWithCats = questions.map((q) => ({ ...q, category: categories[q.categoryId] }));
  return qWithCats;
};

const getQuestionsByHost = async (uid) => {
  const questions = await getQuestionsByHostNoCats(uid);
  const categories = await getCategories();
  const qWithCats = questions.map((q) => ({ ...q, category: categories[q.categoryId] }));
  return qWithCats;
};

const getQuestionById = async (firebaseKey) => {
  const question = await getQuestionByIdNoCat(firebaseKey);
  const category = question ? await getCategoryById(question.categoryId) : null;
  return { ...question, category };
};

// Retrieves a game's questions with status information
const getGameQuestions = async (gameId) => {
  const gameQuestions = await getGameQuestionsByGame(gameId);
  const promisedQs = gameQuestions.map((q) => getQuestionById(q.questionId));
  const realQs = await Promise.all(promisedQs);
  return gameQuestions.map((gq, index) => ({
    ...realQs[index],
    status: gq.status,
    timeOpened: gq.timeOpened,
    queue: gq.queue,
    gameQuestionId: gq.firebaseKey,
  }));
};

// Retrieves a game with its gameQuestions(+associated question & category data)
const getFullGameData = async (gameId) => {
  const gameInfo = await getGameById(gameId);
  const questions = await getGameQuestions(gameId);
  return { ...gameInfo, questions };
};

const getGameCardsData = async (uid) => {
  const gamesInfo = await getGamesByHost(uid);
  const promisedGQs = gamesInfo.map((g) => getGameQuestionsByGame(g.firebaseKey));
  const realGQs = await Promise.all(promisedGQs);
  return gamesInfo.map((g, index) => ({ ...g, size: realGQs[index].length }));
};

const deleteGame = async (firebaseKey) => {
  const toDelete = await getGameQuestionsByGame(firebaseKey);
  const deleted = toDelete.map((gq) => deleteGameQuestion(gq.firebaseKey));
  await Promise.all(deleted);
  await deleteGameOnly(firebaseKey);
};

export {
  getQuestions,
  getQuestionsByHost,
  getQuestionById,
  getGameQuestions,
  getFullGameData,
  getGameCardsData,
  deleteGame,
};
