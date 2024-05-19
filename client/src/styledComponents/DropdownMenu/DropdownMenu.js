import React, { useState } from "react";
import "./DropdownMenu.css";

const DropdownMenu = ({
  options,
  optionIds = null,
  onSelect,
  promptText = "Open Menu",
  showDefault = false,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [selected, setSelected] = useState(false);
  const [selectedOption, setSelectedOption] = useState(null);

  const handleSelect = (option) => {
    setSelectedOption(options[option]);
    if (optionIds) {
      onSelect(optionIds[option]);
    } else {
      onSelect(options[option]);
    }
    setIsOpen(false);
    setSelected(true);
  };

  return (
    <div className="dropdown">
      <button className="dropdownButton" onClick={() => setIsOpen(!isOpen)}>
        {!showDefault && selected ? selectedOption : promptText}
      </button>
      {isOpen && (
        <ul className="dropdown-menu">
          {options.map((option, index) => (
            <li key={index} onClick={() => handleSelect(index)}>
              {option}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default DropdownMenu;
