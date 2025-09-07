// controllers/usersController.js
// Simple in-memory users controller for demonstration.

let _id = 1;
const users = [
  { id: _id++, name: "Alice", email: "alice@example.com" },
  { id: _id++, name: "Bob", email: "bob@example.com" },
];

function getUsers(req, res) {
  res.json({ data: users });
}

function createUser(req, res) {
  const body = req.body || {};
  if (!body.name || !body.email) {
    return res
      .status(400)
      .json({ error: { message: "name and email required" } });
  }
  const user = { id: _id++, name: body.name, email: body.email };
  users.push(user);
  res.status(201).json({ data: user });
}

function getUserById(req, res) {
  const id = Number(req.params.id);
  const u = users.find((x) => x.id === id);
  if (!u) return res.status(404).json({ error: { message: "User not found" } });
  res.json({ data: u });
}

function updateUser(req, res) {
  const id = Number(req.params.id);
  const u = users.find((x) => x.id === id);
  if (!u) return res.status(404).json({ error: { message: "User not found" } });
  const body = req.body || {};
  if (body.name) u.name = body.name;
  if (body.email) u.email = body.email;
  res.json({ data: u });
}

function deleteUser(req, res) {
  const id = Number(req.params.id);
  const idx = users.findIndex((x) => x.id === id);
  if (idx === -1)
    return res.status(404).json({ error: { message: "User not found" } });
  const removed = users.splice(idx, 1)[0];
  res.json({ data: removed });
}

module.exports = {
  getUsers,
  createUser,
  getUserById,
  updateUser,
  deleteUser,
};
