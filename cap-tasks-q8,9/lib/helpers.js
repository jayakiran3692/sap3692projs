const crypto = require("crypto");

function generateId() {
  return crypto.randomUUID();
}

function markCompleted(task) {
  if (!task) return task;
  return { ...task, completed: true };
}

function calculateStats(tasks) {
  const list = Array.isArray(tasks) ? tasks.filter(Boolean) : [];
  const total = list.length;
  const completed = list.filter(t => t.completed).length;
  const pending = total - completed;
  return { total, completed, pending };
}

module.exports = {
  generateId,
  markCompleted,
  calculateStats
};