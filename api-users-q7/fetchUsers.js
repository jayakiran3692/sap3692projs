const fs = require("fs/promises");

const url = "https://jsonplaceholder.typicode.com/users";

async function fetchAndTransformUsers() {
  const res = await fetch(url);
  if (!res.ok) {
    throw new Error(`Request failed with status ${res.status}`);
  }
  const users = await res.json();
  const cleaned = users
    .reduce((acc, u) => {
      if (!u || !u.id || !u.name || !u.email) return acc;
      acc.push({ id: u.id, name: u.name, email: u.email });
      return acc;
    }, [])
    .sort((a, b) => a.name.localeCompare(b.name));
  const json = JSON.stringify(cleaned, null, 2);
  await fs.writeFile("users-clean.json", json, "utf8");
  return cleaned;
}

fetchAndTransformUsers()
  .then(list => {
    console.log("Users saved:", list.length);
  })
  .catch(err => {
    console.error("Error:", err.message || err);
    process.exit(1);
  });