import { getCategories, getCategoryById } from './categoriesData';
import { deleteGameOnly, getGameById, getGamesByHost } from './gameData';
import {
  getGameQuestionById,
  getGameQuestionsByGame,
  updateGameQuestion,
  deleteGameQuestion,
} from './gameQuestionsData';
import { getQuestionByIdNoCat, getQuestionsByHostNoCats, getQuestionsNoCats } from './questionsData';
import { deleteTeam, getTeamsByGameId } from './teamsData';

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
  const promisedQsNoCats = gameQuestions.map((q) => getQuestionByIdNoCat(q.questionId));
  const realQsNoCats = await Promise.all(promisedQsNoCats);
  const categories = await getCategories();
  const realQs = realQsNoCats.map((q) => ({ ...q, category: categories[q.categoryId] }));
  return gameQuestions.map((gq, index) => ({
    ...realQs[index],
    status: gq.status,
    timeOpened: gq.timeOpened,
    queue: gq.queue,
    gameQuestionId: gq.firebaseKey,
  }));
};

const getFullGameQuestion = async (gameQuestionId) => {
  const gameQuestion = await getGameQuestionById(gameQuestionId);
  const question = await getQuestionById(gameQuestion.questionId);
  const game = await getGameById(gameQuestion.gameId);
  return {
    ...question,
    status: gameQuestion.status,
    timeOpened: gameQuestion.timeOpened,
    queue: gameQuestion.queue,
    gameQuestionId: gameQuestion.firebaseKey,
    game,
  };
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
  const gqToDelete = await getGameQuestionsByGame(firebaseKey);
  const teamsToDelete = await getTeamsByGameId(firebaseKey);
  const deleted = gqToDelete.map((gq) => deleteGameQuestion(gq.firebaseKey));
  deleted.concat(teamsToDelete.map((t) => deleteTeam(t.firebaseKey)));
  console.warn(gqToDelete.length, teamsToDelete.length, deleted.length);
  await Promise.all(deleted);
  await deleteGameOnly(firebaseKey);
};

const resetAllQuestions = async (questions) => {
  const resetGQs = questions.map((q) => updateGameQuestion({ firebaseKey: q.gameQuestionId, status: 'unused', timeOpened: 'never' }));
  await Promise.all(resetGQs);
};

export {
  getQuestions,
  getQuestionsByHost,
  getQuestionById,
  getGameQuestions,
  getFullGameQuestion,
  getFullGameData,
  getGameCardsData,
  deleteGame,
  resetAllQuestions,
};
