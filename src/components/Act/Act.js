import React, { useState } from "react";
import {
  SortableContext,
  verticalListSortingStrategy,
  useSortable,
} from "@dnd-kit/sortable";
import Log from "../Log/Log";
import { CSS } from "@dnd-kit/utilities";
import "./Act.css";
import MinimizeButton from "../../styledComponents/MinimizeButton";

const Act = ({ id, logs, title, findGlobalIndex }) => {
  const {
    attributes,
    setNodeRef,
    listeners,
    transform,
    transition,
    isDragging,
  } = useSortable({
    id: id,
    data: {
      type: "container",
    },
  });

  const [showAct, setShowAct] = useState(true);

  return (
    <div className="Box">
      <div className="actTopBar">
        <div className="actTitle">{title}</div>
        <MinimizeButton
          className="minimizeAct"
          initial={false}
          onClick={() => {
            setShowAct(!showAct);
          }}
        ></MinimizeButton>
      </div>
      <div
        className="view"
        {...attributes}
        ref={setNodeRef}
        style={{
          transition,
          transform: CSS.Translate.toString(transform),
        }}
      >
        <SortableContext
          items={logs.map((log) => log.id)}
          strategy={verticalListSortingStrategy}
        >
          {showAct
            ? logs.map((log) => (
                <Log
                  key={log.id}
                  {...log}
                  findGlobalIndex={findGlobalIndex}
                ></Log>
              ))
            : null}
        </SortableContext>
      </div>
    </div>
  );
};

export default Act;
