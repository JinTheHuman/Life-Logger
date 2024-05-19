import React from "react";
import "./Act.css";
import {
  SortableContext,
  verticalListSortingStrategy,
  useSortable,
} from "@dnd-kit/sortable";
import Log from "../Log/Log";
import { CSS } from "@dnd-kit/utilities";
import MinimizeButton from "../../styledComponents/MinimizeButton/MinimizeButton";
import Chapter from "../Chapter/Chapter";

const Act = ({ id, title, chapters, findGlobalIndex, minimizeLog }) => {
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
      type: "act",
    },
  });
  return (
    <div
      className="actContainer"
      {...attributes}
      ref={setNodeRef}
      style={{
        transition,
        transform: CSS.Translate.toString(transform),
      }}
    >
      <div>{title}</div>
      <SortableContext items={chapters.map((chapter) => chapter.id)}>
        {chapters.map((chapter) => (
          <Chapter
            id={chapter.id}
            key={chapter.id}
            title={chapter.title}
            logs={chapter.logs}
            findGlobalIndex={findGlobalIndex}
            minimizeLog={minimizeLog}
          ></Chapter>
        ))}
      </SortableContext>
    </div>
  );
};

export default Act;
