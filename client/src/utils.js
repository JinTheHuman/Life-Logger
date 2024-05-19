const findChapterIndex = (id, acts) => {
  let chapterIndex;
  let actIndex;

  const found = acts.find((act, acti) =>
    act.chapters.find((chapters, chapteri) => {
      if (chapters.id === id) {
        chapterIndex = chapteri;
        actIndex = acti;
        return true;
      }
      return false;
    })
  );

  if (!found) {
    return [-1, -1];
  }

  return [chapterIndex, actIndex];
};

export function findIndicesOfItem(id, acts, type) {
  let logIndex;
  let chapterIndex;
  let actIndex;

  if (type === "chapter") return findChapterIndex(id, acts);

  const found = acts.find((act, acti) =>
    act.chapters.find((chapter, chapteri) =>
      chapter.logs.find((log, logi) => {
        if (log.id === id) {
          logIndex = logi;
          chapterIndex = chapteri;
          actIndex = acti;
          return true;
        }
        return false;
      })
    )
  );

  if (!found) {
    return [-1, -1, -1];
  }

  return [logIndex, chapterIndex, actIndex];
}

export function getType(item) {
  const id = item.id.toString();
  if (id.includes("log")) return "log";
  if (id.includes("chapter")) return "chapter";
  if (id.includes("act")) return "act";
  return null;
}

export function loadLogs(path) {
  const fs = require("fs");

  fs.readFile(path, "utf8", (err, data) => {
    if (err) {
      console.error(err);
      return;
    }

    const lines = data.split("\n");

    lines.forEach((line, index) => {
      console.log(`Line ${index + 1}: ${line}`);
    });
  });
}
