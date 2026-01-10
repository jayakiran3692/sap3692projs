const cds = require("@sap/cds");
const {
  generateId,
  markCompleted,
  calculateStats
} = require("../lib/helpers");

module.exports = srv => {
  const { Tasks } = srv.entities;

  srv.before("CREATE", "Tasks", req => {
    const title = req.data.title;
    if (!title || !String(title).trim()) {
      req.error(400, "Title must not be empty");
    }
    const correlationId = generateId();
    req._correlationId = correlationId;
    console.log("CREATE Tasks correlation", correlationId);
  });

  srv.after("READ", "Tasks", data => {
    const list = Array.isArray(data) ? data : [data];
    const stats = calculateStats(list);
    console.log("Task stats", stats);
    list.forEach(t => {
      if (!t) return;
      if (t.priority == null) {
        t.priority = "Normal";
      }
    });
  });

  srv.on("completeTask", async req => {
    const { ID } = req.data;
    const tx = cds.transaction(req);
    const rows = await tx.read(Tasks).where({ ID });
    if (!rows || rows.length === 0) {
      req.error(404, "Task not found");
      return;
    }
    const updatedTask = markCompleted(rows[0]);
    await tx
      .update(Tasks)
      .set({ completed: updatedTask.completed })
      .where({ ID });
    const refreshed = await tx.read(Tasks).where({ ID });
    return Array.isArray(refreshed) ? refreshed[0] : refreshed;
  });

  srv.on("DELETE", "Tasks", async req => {
    const tx = cds.transaction(req);
    const { ID } = req.data;
    const rows = await tx.read(Tasks).where({ ID });
    if (rows && rows.length > 0) {
      const t = rows[0];
      console.log(`Deleting task ${t.ID}: ${t.title}`);
    }
    return tx.run(req.query);
  });
};