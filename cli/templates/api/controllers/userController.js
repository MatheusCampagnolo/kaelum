function getUsers(req, res) {
  res.json([{ id: 1, name: "Alice" }, { id: 2, name: "Bob" }]);
}

function createUser(req, res) {
  const newUser = req.body;
  res.status(201).json({ message: "User created", user: newUser });
}

module.exports = {
  getUsers,
  createUser
};