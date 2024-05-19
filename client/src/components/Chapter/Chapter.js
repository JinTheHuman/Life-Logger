import React, { useState } from "react";
import {
  SortableContext,
  verticalListSortingStrategy,
  useSortable,
} from "@dnd-kit/sortable";
import Log from "../Log/Log";
import { CSS } from "@dnd-kit/utilities";
import "./Chapter.css";
import MinimizeButton from "../../styledComponents/MinimizeButton/MinimizeButton";

const Chapter = ({ id, logs, title, findGlobalIndex, minimizeLog }) => {
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
      type: "chapter",
    },
  });

  const [showChapter, setShowChapter] = useState(true);

  return (
    <div className="Box">
      <div className="chapterTopBar">
        <div className="chapterTitle">{title}</div>
        <MinimizeButton
          className="minimizeChapter"
          initial={false}
          onClick={() => {
            setShowChapter(!showChapter);
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
          {showChapter
            ? logs.map((log) => (
                <Log
                  key={log.id}
                  {...log}
                  findGlobalIndex={findGlobalIndex}
                  minimizeLog={minimizeLog}
                ></Log>
              ))
            : null}
        </SortableContext>
      </div>
    </div>
  );
};

export default Chapter;
