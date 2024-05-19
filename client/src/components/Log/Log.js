import { useSortable } from "@dnd-kit/sortable";
import React, { useState } from "react";
import "./Log.css";
import { CSS } from "@dnd-kit/utilities";
import MinimizeButton from "../../styledComponents/MinimizeButton/MinimizeButton";

const Log = ({
  id,
  title,
  description,
  dateModified,
  chapter,
  tags,
  expanded,
  findGlobalIndex,
  minimizeLog,
}) => {
  const { attributes, listeners, setNodeRef, transform, transition } =
    useSortable({ id });

  const style = {
    transition,
    transform: CSS.Transform.toString(transform),
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      {...attributes}
      className={"task " + (!expanded ? "notShowingLog" : "")}
    >
      <div className="logTopBar">
        <div {...listeners} className="logTitle draggable">
          {title}
        </div>
        <MinimizeButton
          className="minimizeLog"
          initial={true}
          onClick={() => {
            minimizeLog(id, !expanded);
          }}
        />
      </div>
      <div className="dragHandle">
        {expanded ? (
          <>
            <div>id: {id}</div>
            <div>description: {description}</div>
            <div>Date Modified: {new Date(dateModified).toLocaleString()}</div>
            <div>chapter: {chapter}</div>
            <div>Tags: {tags}</div>
            <div>Global Index: {findGlobalIndex(id)}</div>
          </>
        ) : null}
      </div>
    </div>
  );
};

export default Log;
