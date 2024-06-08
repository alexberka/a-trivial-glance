import { getCategories, getCategoryById } from './categoriesData';
import { getGameById } from './gameData';
import { getGameQuestionsByGame } from './gameQuestionsData';
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

export {
  getQuestions,
  getQuestionsByHost,
  getQuestionById,
  getGameQuestions,
  getFullGameData,
};
