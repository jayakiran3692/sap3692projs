let seq = 1;
let tasks = [];

function listTasks() {
  return tasks;
}

function createTask(title, completed = false) {
  const task = { id: seq++, title, completed };
  tasks = [...tasks, task];
  return task;
}

function updateTask(id, data) {
  const taskId = Number(id);
  const index = tasks.findIndex(t => t.id === taskId);
  if (index === -1) return null;
  const existing = tasks[index];
  const updated = { ...existing, ...data, id: existing.id };
  tasks = [...tasks.slice(0, index), updated, ...tasks.slice(index + 1)];
  return updated;
}

function deleteTask(id) {
  const taskId = Number(id);
  const existing = tasks.find(t => t.id === taskId);
  if (!existing) return false;
  tasks = tasks.filter(t => t.id !== taskId);
  return true;
}

module.exports = {
  listTasks,
  createTask,
  updateTask,
  deleteTask
};