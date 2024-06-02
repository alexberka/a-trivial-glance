import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { getCategories } from '../../api/categoriesData';
import { updateQuestion } from '../../api/questionsData';

export default function CategoryDropdown({ questionId, selectedCategoryId, form }) {
  const [categories, setCategories] = useState();
  const [menuState, setMenuState] = useState({
    open: false,
    selected: selectedCategoryId,
  });

  useEffect(() => {
    getCategories().then(setCategories);
  }, []);

  const handleToggle = () => {
    setMenuState((prev) => ({ ...prev, open: !prev.open }));
  };

  const handleClick = (e, categoryId) => {
    const payload = { firebaseKey: questionId, categoryId };
    if (form) { form(e); } else { updateQuestion(payload); }
    handleToggle();
    setMenuState((prev) => ({ ...prev, selected: categoryId }));
  };

  return (
    <div className="category-dropdown">
      {categories && (
        <div className="qd-category" style={{ background: `${form ? 'white' : categories[menuState.selected].color}` }}>
          <div className="qd-category-name">
            {menuState.selected ? categories[menuState.selected].name.toUpperCase() : 'Select Category'}
          </div>
          <button type="button" className="qd-category-toggle" onClick={handleToggle}>
            {menuState.open ? '▲' : '▼'}
          </button>
        </div>
      )}
      {menuState.open && (
        <div className="category-menu">
          {Object.values(categories)
            .sort((a, b) => a.name.localeCompare(b.name))
            .map((cat) => (
              <button type="button" className="category-item" key={cat.firebaseKey} name="categoryId" value={cat.firebaseKey} onClick={(e) => handleClick(e, cat.firebaseKey)}>{cat.name}</button>
            ))}
        </div>
      )}
    </div>
  );
}

CategoryDropdown.propTypes = {
  questionId: PropTypes.string.isRequired,
  selectedCategoryId: PropTypes.string,
  form: PropTypes.func,
};

CategoryDropdown.defaultProps = {
  selectedCategoryId: '',
  form: null,
};
