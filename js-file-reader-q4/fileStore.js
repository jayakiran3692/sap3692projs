const fs = require("fs/promises");
const path = require("path");

const filePath = path.join(__dirname, "tasks.json");

async function readTasks() {
  const data = await fs.readFile(filePath, "utf8");
  return JSON.parse(data);
}

async function writeTasks(tasks) {
  const json = JSON.stringify(tasks, null, 2);
  await fs.writeFile(filePath, json, "utf8");
}

async function addTask(title) {
  const tasks = await readTasks();
  const nextId =
    tasks.reduce((m, t) => (t.id > m ? t.id : m), 0) + 1;
  const task = { id: nextId, title, completed: false };
  const updated = [...tasks, task];
  await writeTasks(updated);
  return updated;
}

module.exports = {
  readTasks,
  writeTasks,
  addTask
};