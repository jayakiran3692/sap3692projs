const { addTask } = require("./fileStore");

async function main() {
  const title = process.argv[2] || "New Task From Script";
  const updated = await addTask(title);
  console.log("Updated tasks:", updated);
}

main().catch(err => {
  console.error("Error:", err);
  process.exit(1);
});