import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { getCategories } from '../../api/categoriesData';
import { updateQuestion } from '../../api/questionsData';

// 'questionId' is not needed when CategoryDropdown is being used in a form
// 'selectedCategoryId' indicates the category to display on the dropdown
// 'form' represents the handleChange function from the form it is nested in, used to pass category information back to formInput
export default function CategoryDropdown({ questionId, selectedCategoryId, form }) {
  const [categories, setCategories] = useState();
  const [menuState, setMenuState] = useState({
    // Indicates whether dropdown menu is open
    open: false,
    // Indicates currently selected category
    selected: selectedCategoryId,
  });

  // Categories only retrieved on component mount
  useEffect(() => {
    getCategories().then(setCategories);
  }, []);

  // Toggles menu open and closed
  // If called as handleToggle('only-if-open'), menu is only closed if open, but not opened if currently closed
  const handleToggle = (restrict) => {
    setMenuState((prev) => ({ ...prev, open: restrict === 'only-if-open' ? false : !prev.open }));
  };

  // Called when an option is selected from the dropdown
  // Accepts both event information and category firebase key
  const handleClick = (e, categoryId) => {
    if (form) {
      // When used in a form, pass the event into the form's handleChange function for name & value extraction
      form(e);
    } else {
      // When used solo, push the new category immediately to the database
      const payload = { firebaseKey: questionId, categoryId };
      updateQuestion(payload);
    }
    // Close the menu
    handleToggle();
    // Change selected display to the new category
    setMenuState((prev) => ({ ...prev, selected: categoryId }));
  };

  return (
    // If menu is open and the mouse leaves, close the menu
    <div className="category-dropdown" onMouseLeave={() => handleToggle('only-if-open')}>
      <div className="qd-category qd-btn" style={{ background: `${form || !categories ? 'white' : categories[menuState.selected].color}` }}>
        {/* Display loading message until categories have been retrieved */}
        {categories ? (
          <div className="qd-category-name">
            {/* Menu text reads 'Select Category*' when no category has been assigned (new question) */}
            {menuState.selected ? categories[menuState.selected].name.toUpperCase() : 'Select Category*'}
          </div>
        ) : (
          <div className="qd-category-name">
            LOADING...
          </div>
        )}
        {/* Toggle dropdown open/close on click of arrow button */}
        <button type="button" className="qd-category-toggle" onClick={handleToggle}>
          {menuState.open ? '▲' : '▼'}
        </button>
      </div>
      {/* Only render dropdown menu when open is set to true */}
      {menuState.open && (
        <div className="category-menu">
          {/* Alphabetize categories for menu */}
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
  questionId: PropTypes.string,
  selectedCategoryId: PropTypes.string,
  form: PropTypes.func,
};

CategoryDropdown.defaultProps = {
  questionId: '',
  selectedCategoryId: '',
  form: null,
};
