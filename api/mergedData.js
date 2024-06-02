import { getCategories, getCategoryById } from './categoriesData';
import { getQuestionByIdNoCat, getQuestionsByHostNoCats } from './questionsData';

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

export {
  getQuestionsByHost,
  getQuestionById,
};
