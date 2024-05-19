import { useSortable } from "@dnd-kit/sortable";
import React, { useState } from "react";
import "./Log.css";
import { CSS } from "@dnd-kit/utilities";
import MinimizeButton from "../../styledComponents/MinimizeButton";

const Log = ({
  id,
  title,
  description,
  dateModified,
  act,
  tags,
  findGlobalIndex,
}) => {
  const { attributes, listeners, setNodeRef, transform, transition } =
    useSortable({ id });

  const [showLog, setShowLog] = useState(false);

  const style = {
    transition,
    transform: CSS.Transform.toString(transform),
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      {...attributes}
      className={"task " + (!showLog ? "notShowingLog" : "")}
    >
      <div className="logTopBar">
        <div {...listeners} className="logTitle draggable">
          title: {title}
        </div>
        <MinimizeButton
          className="minimizeLog"
          initial={true}
          onClick={() => {
            setShowLog(!showLog);
          }}
        />
      </div>
      <div className="dragHandle">
        {showLog ? (
          <>
            <div>id: {id}</div>
            <div>description: {description}</div>
            <div>Date Modified: {new Date(dateModified).toLocaleString()}</div>
            <div>act: {act}</div>
            <div>Tags: {tags}</div>
            <div>Global Index: {findGlobalIndex(id)}</div>
          </>
        ) : null}
      </div>
    </div>
  );
};

export default Log;
