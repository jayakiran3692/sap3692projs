const express = require("express");
const {
  listTasks,
  createTask,
  updateTask,
  deleteTask
} = require("./tasksService");
const { logger, validateTask } = require("./handlers");

const app = express();
const port = 3000;

app.use(express.json());
app.use(logger);

app.get("/", (req, res) => {
  res.send("Express middleware demo");
});

app.get("/tasks", (req, res) => {
  res.json(listTasks());
});

app.post("/tasks", validateTask, (req, res) => {
  const { title, completed } = req.body;
  const task = createTask(title, completed);
  res.status(201).json(task);
});

app.put("/tasks/:id", validateTask, (req, res) => {
  const { id } = req.params;
  const { title, completed } = req.body;
  const updated = updateTask(id, { title, completed });
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