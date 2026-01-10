const Emitter = require("./emitter");

const emitter = new Emitter();

emitter.on("taskAdded", t => console.log("New task:", t));

emitter.emit("taskAdded", { id: 101, title: "Study CAPM" });

emitter.off("taskAdded");

emitter.emit("taskAdded", { id: 999, title: "Should not print" });