import { getCategories } from './categoriesData';
import { getQuestionsByHostNoCats } from './questionsData';

const getQuestionsByHost = async (uid) => {
  const questions = await getQuestionsByHostNoCats(uid);
  const categories = await getCategories();
  const qWithCats = questions.map((q) => ({ ...q, category: categories[q.categoryId] }));
  return qWithCats;
};

export default getQuestionsByHost;
