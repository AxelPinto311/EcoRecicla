import React, { useState } from 'react';

const filterOptions = [
  { value: 'Papel', label: 'Papel' },
  { value: 'Cartón', label: 'Cartón' },
  { value: 'Plástico', label: 'Plástico' },
  { value: 'Vidrio', label: 'Vidrio' },
  { value: 'Metal', label: 'Metal' },
  { value: 'Electrónicos', label: 'Electrónicos' },
  { value: 'Organicos', label: 'Orgánicos' },
  { value: 'Textiles', label: 'Textiles' },
];

function FilterButtons({ onFilterChange }) {
  const [activeButtons, setActiveButtons] = useState([]);

  const toggleButton = (value) => {
    const currentIndex = activeButtons.indexOf(value);
    const newActiveButtons = [...activeButtons];

    if (currentIndex === -1) {
      newActiveButtons.push(value);
    } else {
      newActiveButtons.splice(currentIndex, 1);
    }
    setActiveButtons(newActiveButtons);
    onFilterChange(newActiveButtons);
  };

  return (
    <div className="filtro_container_pubs">
      {filterOptions.map(option => (
        <button
          key={option.value}
          type="button"
          className={`btn filter-btn ${activeButtons.includes(option.value) ? 'active' : ''}`}
          onClick={() => toggleButton(option.value)}
        >
          {option.label}
        </button>
      ))}
    </div>
  );
}

export default FilterButtons;