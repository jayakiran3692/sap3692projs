const cds = require("@sap/cds");

module.exports = srv => {
  const { Tasks } = srv.entities;

  srv.before("CREATE", "Tasks", req => {
    const title = req.data.title;
    if (!title || String(title).trim().length < 3) {
      req.error(400, "Title must be at least 3 characters");
    }
    if (!req.data.createdAt) {
      req.data.createdAt = new Date().toISOString();
    }
  });

  srv.after("READ", "Tasks", data => {
    const list = Array.isArray(data) ? data : [data];
    const now = Date.now();
    const dayMs = 24 * 60 * 60 * 1000;
    list.forEach(row => {
      if (!row) return;
      if (!row.createdAt) {
        row.daysOld = null;
        return;
      }
      const ts = new Date(row.createdAt).getTime();
      if (Number.isNaN(ts)) {
        row.daysOld = null;
        return;
      }
      row.daysOld = Math.floor((now - ts) / dayMs);
    });
  });

  srv.on("markAllDone", async req => {
    const tx = cds.transaction(req);
    await tx.update(Tasks).set({ completed: true });
    const rows = await tx.read(Tasks);
    return rows;
  });
};