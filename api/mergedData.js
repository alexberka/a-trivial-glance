import { getCategories, getCategoryById } from './categoriesData';
import { deleteGameOnly, getGameById, getGamesByHost } from './gameData';
import {
  getGameQuestionById,
  getGameQuestionsByGame,
  updateGameQuestion,
  deleteGameQuestion,
} from './gameQuestionsData';
import { getQuestionByIdNoCat, getQuestionsByHostNoCats, getQuestionsNoCats } from './questionsData';
import { deleteResponse, getResponsesByGameQuestionId, getResponsesByTeamId } from './responsesData';
import {
  deleteTeam,
  getTeamById,
  getTeamsByGameId,
  getTeamsByUid,
} from './teamsData';

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
  return { ...gameInfo, questions: questions.sort((a, b) => b.timeOpened.localeCompare(a.timeOpened)) };
};

const getGameCardsData = async (uid) => {
  const gamesInfo = await getGamesByHost(uid);
  const promisedGQs = gamesInfo.map((g) => getGameQuestionsByGame(g.firebaseKey));
  const realGQs = await Promise.all(promisedGQs);
  return gamesInfo.map((g, index) => ({ ...g, size: realGQs[index].length }));
};

const getSingleTeamData = async (uid, gameId) => {
  const userTeams = await getTeamsByUid(uid);
  const gameTeam = userTeams.find((t) => t.gameId === gameId);
  const teamResponses = await getResponsesByTeamId(gameTeam?.firebaseKey);
  return { ...gameTeam, responses: teamResponses };
};

const getGameResponses = async (gameId) => {
  const gameTeams = await getTeamsByGameId(gameId);
  const responsePromises = gameTeams.map((t) => getResponsesByTeamId(t.firebaseKey));
  const gameResponses = (await Promise.all(responsePromises)).flat();
  return gameResponses.map((res) => ({
    ...res,
    team: gameTeams.find((team) => team.firebaseKey === res.teamId),
  }));
};

const getQuestionResponses = async (gameQuestionId) => {
  const responsesOnly = await getResponsesByGameQuestionId(gameQuestionId);
  const teamPromises = responsesOnly.map((res) => getTeamById(res.teamId));
  const teams = (await Promise.all(teamPromises));
  return responsesOnly.map((res) => ({
    ...res,
    team: teams.find((t) => res.teamId === t.firebaseKey),
  }));
};

const deleteGame = async (firebaseKey) => {
  const gqToDelete = await getGameQuestionsByGame(firebaseKey);
  const teamsToDelete = await getTeamsByGameId(firebaseKey);
  const deleted = gqToDelete.map((gq) => deleteGameQuestion(gq.firebaseKey));
  deleted.concat(teamsToDelete.map((t) => deleteTeam(t.firebaseKey)));
  await Promise.all(deleted);
  await deleteGameOnly(firebaseKey);
};

const releaseMultipleQuestions = async (questions) => {
  const releasePromises = questions.map((q) => updateGameQuestion({ firebaseKey: q.gameQuestionId, status: 'released' }));
  await Promise.all(releasePromises);
};

const resetAllQuestions = async (questions) => {
  const resPromises = questions.map((q) => getResponsesByGameQuestionId(q.gameQuestionId));
  const responses = (await Promise.all(resPromises)).flat();
  const deleteResponses = responses.map((res) => deleteResponse(res.firebaseKey));
  await Promise.all(deleteResponses);
  const resetGQs = questions.map((q) => updateGameQuestion({ firebaseKey: q.gameQuestionId, status: 'unused', timeOpened: 'never' }));
  await Promise.all(resetGQs);
};

const resetSingleQuestion = async (gameQuestionId) => {
  const resPromises = await getResponsesByGameQuestionId(gameQuestionId);
  const responses = await Promise.all(resPromises);
  const deleteResponses = responses.map((res) => deleteResponse(res.firebaseKey));
  await Promise.all(deleteResponses);
  updateGameQuestion({ firebaseKey: gameQuestionId, status: 'unused', timeOpened: 'never' });
};

export {
  getQuestions,
  getQuestionsByHost,
  getQuestionById,
  getGameQuestions,
  getFullGameQuestion,
  getFullGameData,
  getGameCardsData,
  getSingleTeamData,
  getGameResponses,
  getQuestionResponses,
  deleteGame,
  releaseMultipleQuestions,
  resetAllQuestions,
  resetSingleQuestion,
};
