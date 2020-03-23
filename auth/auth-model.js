const database = require("../data/db-config");

function addUser(user) {
  return database("users").insert(user);
}

function getUsers() {
  return database("users");
}

function getUserByID(id) {
  return database("users")
    .where({ id })
    .first();
}

function getUserByUsername(username) {
  return database("users")
    .where({ username })
    .first();
}

module.exports = {
  addUser,
  getUsers,
  getUserByID,
  getUserByUsername
};
