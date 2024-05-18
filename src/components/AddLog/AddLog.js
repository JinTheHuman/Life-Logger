import React from "react";
import "./AddLog.css";
import { useState } from "react";
import { v4 as uuidv4 } from "uuid";

const AddLog = ({ acts, handleAddLog, existingTags }) => {
  const [selectedAct, setselectedAct] = useState(null);
  const [showModule, setShowModule] = useState(true);

  const [tagInputValue, setTagInputValue] = useState("");
  const [suggestedTags, setSuggestedTags] = useState([]);
  const [selectedTags, setSelectedTags] = useState([]);

  const unselectTag = (index) => {
    const newSelectedTags = [...selectedTags];
    // Remove the element at the specified index
    newSelectedTags.splice(index, 1);
    setSelectedTags(newSelectedTags);
  };

  const selectTag = (tag) => {
    setSelectedTags([...selectedTags, tag]);
  };

  const handleTagInputChange = (e) => {
    const value = e.target.value;
    setTagInputValue(value);

    // Filter existing tags based on the input value
    let filteredTags = existingTags.filter((tag) =>
      tag.toLowerCase().includes(value.toLowerCase())
    );

    if (value == "") {
      filteredTags = [];
    }

    setSuggestedTags(filteredTags);
  };

  const handleOptionChange = (option) => {
    setselectedAct(option);
  };

  const [title, setTitle] = useState("");
  const handleTitleChange = (e) => {
    console.log(e.target.value);
    setTitle(e.target.value);
  };

  const [description, setDescription] = useState("");
  const handleDescriptionChange = (e) => {
    setDescription(e.target.value);
  };

  const handleClick = () => {
    const newLog = {
      id: `log-${uuidv4()}`,
      title: title,
      description: description,
      dateModified: Date.now(),
      act: selectedAct,
      tags: selectedTags,
    };
    handleAddLog(newLog);
  };

  return (
    <div className="AddLog">
      <h3
        onClick={() => {
          setShowModule(!showModule);
        }}
      >
        Add Log
      </h3>
      {showModule ? (
        <>
          <label>
            Title <input type="text" onChange={handleTitleChange} />
          </label>

          <label>
            Description <input type="text" onChange={handleDescriptionChange} />
          </label>
          {acts.map((act) => (
            <label key={act.id}>
              <input
                type="radio"
                value={act.id}
                checked={selectedAct === act.id}
                onChange={() => handleOptionChange(act.id)}
              />
              {act.title}
            </label>
          ))}
          <div className="suggestedTags">
            {selectedTags.map((tag, index) => (
              <button key={index} onClick={() => unselectTag(index)}>
                {tag}
              </button>
            ))}
          </div>
          <input
            type="text"
            value={tagInputValue}
            onChange={handleTagInputChange}
            placeholder="Enter tags (comma-separated)"
          />
          <div className="suggestedTags">
            {suggestedTags.map((tag, index) => (
              <button key={index} onClick={() => selectTag(tag)}>
                {tag}
              </button>
            ))}
          </div>
          <button onClick={handleClick}>Add</button>
        </>
      ) : null}
    </div>
  );
};

export default AddLog;
