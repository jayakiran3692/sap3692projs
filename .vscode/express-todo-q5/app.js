const express = require("express");
const {
  listTasks,
  createTask,
  updateTask,
  deleteTask
} = require("./tasksService");

const app = express();
const port = 3000;

app.use(express.json());

app.get("/tasks", (req, res) => {
  res.json(listTasks());
});

app.post("/tasks", (req, res) => {
  const { title, completed } = req.body;
  if (!title) {
    res.status(400).json({ error: "Title is required" });
    return;
  }
  const task = createTask(title, completed);
  res.status(201).json(task);
});

app.put("/tasks/:id", (req, res) => {
  const { id } = req.params;
  const { title, completed } = req.body;
  const data = {};
  if (typeof title !== "undefined") data.title = title;
  if (typeof completed !== "undefined") data.completed = completed;
  const updated = updateTask(id, data);
  if (!updated) {
    res.status(404).json({ error: "Task not found" });
    return;
  }
  res.json(updated);
});

app.delete("/tasks/:id", (req, res) => {
  const { id } = req.params;
  const ok = deleteTask(id);
  if (!ok) {
    res.status(404).json({ error: "Task not found" });
    return;
  }
  res.status(204).send();
});

app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});