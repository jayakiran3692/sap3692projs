let seq = 1;

const clone = tasks => tasks.map(t => ({ ...t }));

function addTask(tasks, title) {
  const list = clone(tasks);
  const task = { id: seq++, title, completed: false };
  return [...list, task];
}

function removeTask(tasks, id) {
  const list = clone(tasks);
  return list.filter(t => t.id !== id);
}

function searchTask(tasks, keyword) {
  const list = clone(tasks);
  const k = String(keyword || "").toLowerCase();
  return list.filter(t => t.title.toLowerCase().includes(k));
}

function countCompletedTasks(tasks) {
  return tasks.reduce((count, t) => (t.completed ? count + 1 : count), 0);
}

function findTask(tasks, id) {
  return clone(tasks).find(t => t.id === id);
}

module.exports = {
  addTask,
  removeTask,
  searchTask,
  countCompletedTasks,
  findTask
};