import "./App.css";
import { useState } from "react";
import Act from "./components/Act/Act";
import {
  DndContext,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  closestCorners,
} from "@dnd-kit/core";
import AddLog from "./components/AddLog/AddLog";

import {
  arrayMove,
  sortableKeyboardCoordinates,
  SortableContext,
} from "@dnd-kit/sortable";

function App() {
  const [acts, setActs] = useState([
    {
      id: "container1",
      title: "Pre Primary",
      logs: [],
    },
    {
      id: "container2",
      title: "Primary School",
      logs: [],
    },
    {
      id: "container3",
      title: "Highschool",
      logs: [],
    },
    {
      id: "container4",
      title: "University",
      logs: [],
    },
  ]);

  const [existingTags, setExistingTags] = useState(["tag1", "tag2"]);

  function findGlobalIndex(logId) {
    let globalIndex = 0;
    for (let i = 0; i < acts.length; i++) {
      const items = acts[i].logs;
      const indexInObject = items.findIndex((log) => log.id === logId);
      if (indexInObject !== -1) {
        globalIndex += indexInObject;
        break;
      }
      globalIndex += items.length;
    }
    return globalIndex;
  }

  const [activeId, setActiveId] = useState(null);

  const handleAddLog = (log) => {
    const act = acts.find((act) => act.id === log.act);
    if (!act) return;
    act.logs.push(log);
    setActs([...acts]);
  };

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  function findValueOfLogs(id, type) {
    if (type === "container") {
      return acts.find((act) => act.id === id);
    }
    if (type === "log") {
      return acts.find((container) =>
        container.logs.find((log) => log.id === id)
      );
    }
  }

  function handleDragStart(event) {
    const { active } = event;
    const { id } = active;
    setActiveId(id);
  }

  const handleDragMove = (event) => {
    const { active, over } = event;

    // Handle Items Sorting
    if (
      active.id.toString().includes("log") &&
      over?.id.toString().includes("log") &&
      active &&
      over &&
      active.id !== over.id
    ) {
      // Find the active container and over container
      const activeContainer = findValueOfLogs(active.id, "log");
      const overContainer = findValueOfLogs(over.id, "log");

      // If the active or over container is not found, return
      if (!activeContainer || !overContainer) return;

      // Find the index of the active and over container
      const activeContainerIndex = acts.findIndex(
        (container) => container.id === activeContainer.id
      );
      const overContainerIndex = acts.findIndex(
        (container) => container.id === overContainer.id
      );

      // Find the index of the active and over item
      const activeitemIndex = activeContainer.logs.findIndex(
        (log) => log.id === active.id
      );
      const overitemIndex = overContainer.logs.findIndex(
        (log) => log.id === over.id
      );
      // In the same container
      if (activeContainerIndex === overContainerIndex) {
        let newItems = [...acts];
        newItems[activeContainerIndex].logs = arrayMove(
          newItems[activeContainerIndex].logs,
          activeitemIndex,
          overitemIndex
        );

        setActs(newItems);
      } else {
        // In different containers
        let newItems = [...acts];
        const [removeditem] = newItems[activeContainerIndex].logs.splice(
          activeitemIndex,
          1
        );
        removeditem.act = newItems[overContainerIndex].title;
        newItems[overContainerIndex].logs.splice(overitemIndex, 0, removeditem);
        setActs(newItems);
      }
    }

    // Handling Item Drop Into a Container
    if (
      active.id.toString().includes("log") &&
      over?.id.toString().includes("container") &&
      active &&
      over &&
      active.id !== over.id
    ) {
      // Find the active and over container
      const activeContainer = findValueOfLogs(active.id, "log");
      const overContainer = findValueOfLogs(over.id, "container");

      // If the active or over container is not found, return
      if (!activeContainer || !overContainer) return;

      // Find the index of the active and over container
      const activeContainerIndex = acts.findIndex(
        (container) => container.id === activeContainer.id
      );
      const overContainerIndex = acts.findIndex(
        (container) => container.id === overContainer.id
      );

      // Find the index of the active and over item
      const activeitemIndex = activeContainer.logs.findIndex(
        (log) => log.id === active.id
      );

      // Remove the active item from the active container and add it to the over container
      let newItems = [...acts];
      const [removeditem] = newItems[activeContainerIndex].logs.splice(
        activeitemIndex,
        1
      );
      newItems[overContainerIndex].logs.push(removeditem);
      removeditem.act = newItems[overContainerIndex].title;
      setActs(newItems);
    }
  };

  // this MIGHT BE A BUG TODO
  function handleDragEnd(event) {
    const { active, over } = event;

    // Handling Container Sorting
    if (
      active.id.toString().includes("container") &&
      over?.id.toString().includes("container") &&
      active &&
      over &&
      active.id !== over.id
    ) {
      // Find the index of the active and over container
      const activeContainerIndex = acts.findIndex(
        (container) => container.id === active.id
      );
      const overContainerIndex = acts.findIndex(
        (container) => container.id === over.id
      );
      // Swap the active and over container
      let newItems = [...acts];
      newItems = arrayMove(newItems, activeContainerIndex, overContainerIndex);
      setActs(newItems);
    }

    // Handling item Sorting
    if (
      active.id.toString().includes("log") &&
      over?.id.toString().includes("log") &&
      active &&
      over &&
      active.id !== over.id
    ) {
      // Find the active and over container
      const activeContainer = findValueOfLogs(active.id, "log");
      const overContainer = findValueOfLogs(over.id, "log");

      // If the active or over container is not found, return
      if (!activeContainer || !overContainer) return;
      // Find the index of the active and over container
      const activeContainerIndex = acts.findIndex(
        (container) => container.id === activeContainer.id
      );
      const overContainerIndex = acts.findIndex(
        (container) => container.id === overContainer.id
      );
      // Find the index of the active and over item
      const activeitemIndex = activeContainer.logs.findIndex(
        (log) => log.id === active.id
      );
      const overitemIndex = overContainer.logs.findIndex(
        (log) => log.id === over.id
      );

      // In the same container
      if (activeContainerIndex === overContainerIndex) {
        let newItems = [...acts];
        newItems[activeContainerIndex].logs = arrayMove(
          newItems[activeContainerIndex].logs,
          activeitemIndex,
          overitemIndex
        );
        setActs(newItems);
      } else {
        // In different containers
        let newItems = [...acts];
        const [removeditem] = newItems[activeContainerIndex].logs.splice(
          activeitemIndex,
          1
        );
        newItems[overContainerIndex].logs.splice(overitemIndex, 0, removeditem);
        setActs(newItems);
      }
    }
    // Handling item dropping into Container
    if (
      active.id.toString().includes("log") &&
      over?.id.toString().includes("container") &&
      active &&
      over &&
      active.id !== over.id
    ) {
      // Find the active and over container
      const activeContainer = findValueOfLogs(active.id, "log");
      const overContainer = findValueOfLogs(over.id, "container");

      // If the active or over container is not found, return
      if (!activeContainer || !overContainer) return;
      // Find the index of the active and over container
      const activeContainerIndex = acts.findIndex(
        (container) => container.id === activeContainer.id
      );
      const overContainerIndex = acts.findIndex(
        (container) => container.id === overContainer.id
      );
      // Find the index of the active and over item
      const activeitemIndex = activeContainer.logs.findIndex(
        (log) => log.id === active.id
      );

      let newItems = [...acts];
      const [removeditem] = newItems[activeContainerIndex].logs.splice(
        activeitemIndex,
        1
      );
      newItems[overContainerIndex].logs.push(removeditem);
      setActs(newItems);
    }
    setActiveId(null);
  }

  return (
    <div className="App">
      <AddLog
        acts={acts}
        handleAddLog={handleAddLog}
        existingTags={existingTags}
      ></AddLog>
      <div className="lifeLogView">
        <DndContext
          sensors={sensors}
          collisionDetection={closestCorners}
          onDragStart={handleDragStart}
          onDragMove={handleDragMove}
          onDragEnd={handleDragEnd}
        >
          <SortableContext items={acts.map((i) => i.id)}>
            {acts.map((act) => (
              <Act
                id={act.id}
                key={act.id}
                title={act.title}
                logs={act.logs}
                findGlobalIndex={findGlobalIndex}
              ></Act>
            ))}
          </SortableContext>
        </DndContext>
      </div>
    </div>
  );
}

export default App;
