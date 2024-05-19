import "./App.css";
import { useState } from "react";
import {
  DndContext,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  closestCorners,
} from "@dnd-kit/core";
import {
  arrayMove,
  sortableKeyboardCoordinates,
  SortableContext,
} from "@dnd-kit/sortable";

import AddLog from "./components/AddLog/AddLog";
import Act from "./components/Act/Act";
import { findIndicesOfItem, getType } from "./utils";

function App() {
  const [acts, setActs] = useState([
    {
      id: "act1",
      title: "Early",
      chapters: [
        {
          id: "chapter1",
          title: "Pre Primary",
          logs: [],
        },
        {
          id: "chapter2",
          title: "Primary School",
          logs: [],
        },
      ],
    },
    {
      id: "act2",
      title: "Late",
      chapters: [
        {
          id: "chapter3",
          title: "Uni",
          logs: [],
        },
        {
          id: "chapter4",
          title: "High school",
          logs: [],
        },
      ],
    },
  ]);

  const [existingTags, setExistingTags] = useState(["tag1", "tag2"]);

  function findGlobalIndex(logId) {
    let globalIndex = -1;
    let found = false;

    acts.some((act) => {
      return act.chapters.some((chapter) => {
        return chapter.logs.some((log) => {
          globalIndex += 1;
          if (log.id === logId) {
            found = true;
            return true;
          }
        });
      });
    });

    return globalIndex;
  }

  const handleAddLog = (log, act, chapter) => {
    const newAct = acts.find((acti) => acti.id === act); // change this to be prettier
    const newChapter = newAct.chapters.find(
      (chapteri) => chapteri.id === chapter
    );
    if (!newChapter) return;
    newChapter.logs.push(log);
    setActs([...acts]);
  };

  const minimizeLog = (id, minimize) => {
    const [log, chapter, act] = findIndicesOfItem(id, acts, "log");
    acts[act].chapters[chapter].logs[log].expanded = minimize;
    setActs([...acts]);
  };

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  const handleDragMove = (event) => {
    const { active, over } = event;

    const [activeLogIndex, activeChapterIndex, activeActIndex] =
      findIndicesOfItem(active.id, acts, "log");

    if (activeActIndex === -1) return;
    if (active.id === over.id) return;
    if (!active || !over) return;

    const activeType = getType(active);
    const overType = getType(over);

    if (activeType === overType && activeType === "log") {
      const [overLogIndex, overChapterIndex, overActIndex] = findIndicesOfItem(
        over.id,
        acts,
        "log"
      );

      if (overActIndex === -1) return;

      // same chapter look at the buggines TODO
      if (activeActIndex === overActIndex) {
        let newChapters = [...acts[activeActIndex].chapters];
        if (activeChapterIndex === overChapterIndex) {
          // Same act same chapter
          newChapters[activeChapterIndex].logs = arrayMove(
            newChapters[activeChapterIndex].logs,
            activeLogIndex,
            overLogIndex
          );
        } else {
          // same act different chapter
          const [removeditem] = newChapters[activeChapterIndex].logs.splice(
            activeLogIndex,
            1
          );
          removeditem.chapter = newChapters[overChapterIndex].title;
          newChapters[overChapterIndex].logs.splice(
            overLogIndex,
            0,
            removeditem
          );
        }
        acts[activeActIndex].chapters = newChapters;
        setActs([...acts]);
      } else {
        // different chapter different act
        let newChapters = [...acts[activeActIndex].chapters];
        let otherNewChapters = [...acts[overActIndex].chapters];

        const [removeditem] = newChapters[activeChapterIndex].logs.splice(
          activeLogIndex,
          1
        );
        otherNewChapters[overChapterIndex].logs.splice(
          overLogIndex,
          0,
          removeditem
        );

        acts[activeActIndex].chapters = newChapters;
        acts[overActIndex].chapters = otherNewChapters;
        setActs([...acts]);
        return;
      }
    }

    // Handling Item Drop Into a chapter but same act
    if (overType === "chapter" && activeType === "log") {
      const [overChapterIndex, overActIndex] = findIndicesOfItem(
        over.id,
        acts,
        "chapter"
      );

      if (overActIndex === -1) return;

      let newChapters = [...acts[activeActIndex].chapters];

      if (activeActIndex === overActIndex) {
        const [removeditem] = newChapters[activeChapterIndex].logs.splice(
          activeLogIndex,
          1
        );
        newChapters[overChapterIndex].logs.push(removeditem);
        removeditem.chapter = newChapters[overChapterIndex].title;

        acts[activeActIndex].chapters = newChapters;
        setActs([...acts]);
      } else {
        let otherNewChapters = [...acts[overActIndex].chapters];

        const [removeditem] = newChapters[activeChapterIndex].logs.splice(
          activeLogIndex,
          1
        );
        otherNewChapters[overChapterIndex].logs.push(removeditem);

        acts[activeActIndex].chapters = newChapters;
        acts[overActIndex].chapters = otherNewChapters;
        setActs([...acts]);
        return;
      }
    }
  };

  const postData = () => {
    console.log("sending", JSON.stringify(acts));

    fetch("http://localhost:5000/api/writeFile", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(acts),
    })
      .then((response) => response.text())
      .then((data) => console.log(data))
      .catch((error) => console.error("Error:", error));
  };
  return (
    <div className="App">
      <button onClick={postData}>post</button>
      <AddLog
        acts={acts}
        handleAddLog={handleAddLog}
        existingTags={existingTags}
      ></AddLog>
      <div className="lifeLogView">
        <DndContext
          sensors={sensors}
          collisionDetection={closestCorners}
          onDragMove={handleDragMove}
        >
          <SortableContext items={acts.map((i) => i.id)}>
            {acts.map((act) => (
              <Act
                id={act.id}
                key={act.id}
                title={act.title}
                chapters={act.chapters}
                findGlobalIndex={findGlobalIndex}
                minimizeLog={minimizeLog}
              ></Act>
            ))}
          </SortableContext>
        </DndContext>
      </div>
    </div>
  );
}

export default App;
