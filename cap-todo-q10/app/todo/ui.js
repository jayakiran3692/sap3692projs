const base = "/odata/v4/todo/Tasks";
const actionUrl = "/odata/v4/todo/markAllDone";

const bodyEl = document.getElementById("task-body");
const formEl = document.getElementById("task-form");
const titleEl = document.getElementById("title");
const markAllBtn = document.getElementById("mark-all");

async function request(url, options) {
  const res = await fetch(url, options);
  if (!res.ok) {
    let message = `Request failed: ${res.status}`;
    try {
      const json = await res.json();
      if (json.error?.message) message = json.error.message;
    } catch (e) {}
    alert(message);
    throw new Error(message);
  }
  return res;
}

async function loadTasks() {
  const res = await request(base);
  const json = await res.json();
  const items = json.value || [];

  bodyEl.innerHTML = "";

  items.forEach(t => {
    const tr = document.createElement("tr");

    const tdTitle = document.createElement("td");
    tdTitle.textContent = t.title;

    const tdCompleted = document.createElement("td");
    const badge = document.createElement("span");
    badge.className = "badge " + (t.completed ? "done" : "pending");
    badge.textContent = t.completed ? "Done" : "Pending";
    tdCompleted.appendChild(badge);

    const tdCreated = document.createElement("td");
    tdCreated.textContent = t.createdAt || "";

    const tdDays = document.createElement("td");
    tdDays.textContent =
      typeof t.daysOld === "number" ? String(t.daysOld) : "";

    const tdActions = document.createElement("td");

    const toggleBtn = document.createElement("button");
    toggleBtn.className = "btn ghost";
    toggleBtn.textContent = t.completed ? "Mark pending" : "Mark done";
    toggleBtn.onclick = () => toggleCompleted(t);

    const delBtn = document.createElement("button");
    delBtn.className = "btn danger";
    delBtn.textContent = "Delete";
    delBtn.onclick = () => deleteTask(t);

    tdActions.appendChild(toggleBtn);
    tdActions.appendChild(delBtn);

    tr.appendChild(tdTitle);
    tr.appendChild(tdCompleted);
    tr.appendChild(tdCreated);
    tr.appendChild(tdDays);
    tr.appendChild(tdActions);

    bodyEl.appendChild(tr);
  });
}

async function createTask(title) {
  await request(base, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ title })
  });
  await loadTasks();
}

async function toggleCompleted(task) {
  await request(`${base}(ID=${task.ID})`, {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ completed: !task.completed })
  });
  await loadTasks();
}

async function deleteTask(task) {
  await request(`${base}(ID=${task.ID})`, {
    method: "DELETE"
  });
  await loadTasks();
}

async function markAllDone() {
  await request(actionUrl, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: "{}"
  });
  await loadTasks();
}

formEl.onsubmit = e => {
  e.preventDefault();
  const title = titleEl.value.trim();
  if (!title) return;
  createTask(title);
  titleEl.value = "";
};

markAllBtn.onclick = () => {
  markAllDone();
};

loadTasks();