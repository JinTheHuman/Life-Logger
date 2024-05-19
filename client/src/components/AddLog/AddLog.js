import React from "react";
import "./AddLog.css";
import { useState } from "react";
import { v4 as uuidv4 } from "uuid";
import DropdownMenu from "../../styledComponents/DropdownMenu/DropdownMenu";

const AddLog = ({ acts, handleAddLog, existingTags }) => {
  const [selectedAct, setselectedAct] = useState(null);
  const [selectedActIndex, setselectedActIndex] = useState(null);
  const [selectedChapter, setselectedChapter] = useState(null);
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
    setselectedChapter(option);
  };

  const handleActOptionChange = (actId) => {
    setselectedAct(actId);
    setselectedActIndex(acts.findIndex((act) => act.id === actId));
  };

  const [title, setTitle] = useState("");
  const handleTitleChange = (e) => {
    setTitle(e.target.value);
  };

  const [description, setDescription] = useState("");
  const handleDescriptionChange = (e) => {
    setDescription(e.target.value);
  };

  const handleClick = () => {
    if (title === "" || !selectedAct || !selectedChapter) return;

    const newLog = {
      id: `log-${uuidv4()}`,
      title: title,
      description: description,
      dateModified: Date.now(),
      chapter: selectedChapter,
      tags: selectedTags,
      expanded: false,
    };
    handleAddLog(newLog, selectedAct, selectedChapter);
    setSelectedTags([]);
    setSuggestedTags([]);
    setselectedAct(null);
    setselectedChapter(null);
  };

  return (
    <div className="AddLog">
      <div
        onClick={() => {
          setShowModule(!showModule);
        }}
      >
        Add Log
      </div>
      {showModule ? (
        <>
          <DropdownMenu
            options={acts.map((act) => act.title)}
            optionIds={acts.map((act) => act.id)}
            onSelect={handleActOptionChange}
            promptText="Select Act"
            showDefault={!selectedAct}
          ></DropdownMenu>
          <label>
            Title <input type="text" onChange={handleTitleChange} />
          </label>

          <label>
            Description <input type="text" onChange={handleDescriptionChange} />
          </label>
          <div>Chapter</div>
          {selectedAct
            ? acts[selectedActIndex].chapters.map((chapter) => (
                <label key={chapter.id}>
                  <input
                    type="radio"
                    value={chapter.id}
                    checked={selectedChapter === chapter.id}
                    onChange={() => handleOptionChange(chapter.id)}
                  />
                  {chapter.title}
                </label>
              ))
            : null}
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
