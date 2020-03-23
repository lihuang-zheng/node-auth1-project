const bcrypt = require("bcryptjs");

exports.seed = function(knex) {
  return knex("users").insert([
    { username: "qwerty", password: bcrypt.hashSync("qwerty") },
    { username: "asdf", password: bcrypt.hashSync("asdf") },
    { username: "zxcv", password: bcrypt.hashSync("zxcv") }
  ]);
};
