import React, { useState } from "react";
import "./MinimizeButton.css";

const MinimizeButton = ({ initial, onClick, className }) => {
  const [minimized, setMinimized] = useState(initial);

  const handleClick = () => {
    onClick();
    setMinimized(!minimized);
  };

  return (
    <div
      onClick={handleClick}
      className={className + " minimizeButton " + (minimized ? "flipped" : "")}
    >
      <svg width="26" height="13" viewBox="0 0 68 38" fill="none">
        <path
          d="M4 34L34 4L64 34"
          stroke="black"
          strokeWidth="8"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    </div>
  );
};

export default MinimizeButton;
