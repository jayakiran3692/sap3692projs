const {
  addTask,
  removeTask,
  searchTask,
  countCompletedTasks,
  findTask
} = require("./taskManager");

let tasks = [];

tasks = addTask(tasks, "Learn JS");
tasks = addTask(tasks, "Study CAPM");
tasks = addTask(tasks, "Build Task Manager");

tasks = tasks.map((t, i) => (i === 0 ? { ...t, completed: true } : t));

console.log("All tasks:", tasks);
console.log("Search 'learn':", searchTask(tasks, "learn"));
console.log("Completed count:", countCompletedTasks(tasks));
console.log("Find ID 2:", findTask(tasks, 2));
console.log("After removing ID 2:", removeTask(tasks, 2));