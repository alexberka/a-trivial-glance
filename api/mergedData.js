import { getCategories, getCategoryById } from './categoriesData';
import {
  deleteGameOnly,
  getGameById,
  getGamesByHost,
  updateGame,
} from './gameData';
import {
  getGameQuestionById,
  getGameQuestionsByGame,
  updateGameQuestion,
  deleteGameQuestion,
  getGameQuestionsByQuestion,
} from './gameQuestionsData';
import {
  deleteQuestion,
  getQuestionByIdNoCat,
  getQuestionsByHostNoCats,
  getQuestionsNoCats,
} from './questionsData';
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

// Retrieves games by host uid
// Counts and appends number of associated gameQuestions
const getGameCardsData = async (uid) => {
  const gamesInfo = await getGamesByHost(uid);
  const promisedGQs = gamesInfo.map((g) => getGameQuestionsByGame(g.firebaseKey));
  const realGQs = await Promise.all(promisedGQs);
  return gamesInfo.map((g, index) => ({ ...g, size: realGQs[index].length }));
};

const getSingleTeamData = async (uid, gameId) => {
  const userTeams = await getTeamsByUid(uid);
  const gameTeam = userTeams.find((t) => t.gameId === gameId);
  return gameTeam;
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

// Deletes all teams and responses for a single game
// Used below for both deleteGame and resetGame
const deleteTeamsAndResponsesByGame = async (gameId) => {
  const teamsToDelete = await getTeamsByGameId(gameId);
  const resPromises = teamsToDelete.map((t) => getResponsesByTeamId(t.firebaseKey));
  const responsesToDelete = (await Promise.all(resPromises)).flat();

  const deleteTeams = teamsToDelete.map((t) => deleteTeam(t.firebaseKey));
  const deleteResponses = responsesToDelete.map((res) => deleteResponse(res.firebaseKey));

  await Promise.all([deleteTeams, deleteResponses].flat());
};

// Deletes game and all its dependent entities
const deleteGame = async (gameId) => {
  const gqToDelete = await getGameQuestionsByGame(gameId);
  const deleteGQs = gqToDelete.map((gq) => deleteGameQuestion(gq.firebaseKey));

  await Promise.all(deleteGQs);
  await deleteTeamsAndResponsesByGame(gameId);
  await deleteGameOnly(gameId);
};

const deleteQuestionAndInstances = async (firebaseKey) => {
  const instances = await getGameQuestionsByQuestion(firebaseKey);
  const resPromises = instances.map((gq) => getResponsesByGameQuestionId(gq.firebaseKey));
  const responses = (await Promise.all(resPromises)).flat();
  const deleteResponses = responses.map((res) => deleteResponse(res.firebaseKey));
  const deleteInstances = instances.map((i) => deleteGameQuestion(i.firebaseKey));
  await Promise.all([deleteInstances, deleteResponses].flat());
  await deleteQuestion(firebaseKey);
};

const deleteGameQuestionAndResponses = async (firebaseKey) => {
  const resPromises = await getResponsesByGameQuestionId(firebaseKey);
  const deleteResponses = resPromises.map((res) => deleteResponse(res.firebaseKey));
  await Promise.all(deleteResponses);
  await deleteGameQuestion(firebaseKey);
};

const releaseMultipleQuestions = async (questions) => {
  const releasePromises = questions.map((q) => updateGameQuestion({ firebaseKey: q.gameQuestionId, status: 'released' }));
  await Promise.all(releasePromises);
};

// Receives list of questions with gameQuestionIds
// Deletes related responses and turns Game Questions back to 'unused'
const resetAllGameQuestions = async (questions) => {
  const resPromises = questions
    .filter((q) => q.status !== 'unused')
    .map((q) => getResponsesByGameQuestionId(q.gameQuestionId));
  const responses = (await Promise.all(resPromises)).flat();
  const deleteResponses = responses.map((res) => deleteResponse(res.firebaseKey));
  await Promise.all(deleteResponses);
  const resetGQs = questions
    .filter((q) => q.status !== 'unused')
    .map((q) => updateGameQuestion({ firebaseKey: q.gameQuestionId, status: 'unused', timeOpened: 'never' }));
  await Promise.all(resetGQs);
};

// Receives gameQuestionId
// Deletes related responses and turns Game Question back to 'unused'
const resetSingleGameQuestion = async (gameQuestionId) => {
  const responses = await getResponsesByGameQuestionId(gameQuestionId);
  const deleteResponses = responses.map((res) => deleteResponse(res.firebaseKey));
  await Promise.all(deleteResponses);
  updateGameQuestion({ firebaseKey: gameQuestionId, status: 'unused', timeOpened: 'never' });
};

// Deletes teams and responses, resets gameQuestions (if necessary) and game status
const resetGame = async (gameId) => {
  const gameQuestions = await getGameQuestionsByGame(gameId);
  const resetGQs = gameQuestions
    .filter((gq) => gq.status !== 'unused')
    .map((gq) => updateGameQuestion({ firebaseKey: gq.firebaseKey, status: 'unused', timeOpened: 'never' }));

  await Promise.all(resetGQs);
  await deleteTeamsAndResponsesByGame(gameId);
  await updateGame({ firebaseKey: gameId, status: 'unused', dateLive: 'never' });
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
  deleteQuestionAndInstances,
  deleteGameQuestionAndResponses,
  releaseMultipleQuestions,
  resetAllGameQuestions,
  resetSingleGameQuestion,
  resetGame,
};
