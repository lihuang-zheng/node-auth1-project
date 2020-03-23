const bcrypt = require("bcryptjs");
const express = require("express");

const middleware = require("./auth-middleware");

const database = require("./auth-model");

const router = express.Router();

router.get("/users", middleware, (req, res) => {
  database
    .getUsers()
    .then(users => {
      res.status(200).json(users);
    })
    .catch(error => {
      res.status(500).json({ message: "Could not get users." });
    });
});

router.get("/users/:id", middleware, (req, res) => {
  database
    .getUserByID(req.params.id)
    .then(user => {
      if (user) {
        res.status(200).json(user);
      } else {
        res
          .status(404)
          .json({ message: "No user with ID " + req.params.id + " found." });
      }
    })
    .catch(error => {
      res.status(500).json({ message: "Could not get user." });
    });
});

router.post("/signup", (req, res) => {
  if (!req.body || !req.body.username || !req.body.password) {
    res
      .status(400)
      .json({ message: "Username and password are both required." });
  } else {
    let hashedPassword = bcrypt.hashSync(req.body.password, 14);
    req.body.password = hashedPassword;

    req.session.isLoggedIn = true;
    req.session.username = req.body.username;

    console.log("Upon signup: req.session:", req.session);

    database
      .addUser(req.body)
      .then(usersAdded => {
        res.status(200).json(usersAdded);
      })
      .catch(error => {
        res.status(500).json({ message: "Could not add user." });
      });
  }
});

router.post("/login", (req, res) => {
  if (!req.body || !req.body.username || !req.body.password) {
    res
      .status(400)
      .json({ message: "Username and password are both required." });
  } else {
    database
      .getUserByUsername(req.body.username)
      .then(databaseInfo => {
        if (
          databaseInfo &&
          bcrypt.compareSync(req.body.password, databaseInfo.password)
        ) {
          req.session.isLoggedIn = true;
          req.session.username = databaseInfo.username;

          console.log("Upon logging in: req.session:", req.session);

          res
            .status(200)
            .json({ message: "Welcome, " + databaseInfo.username });
        } else {
          res.status(401).json({ message: "Invalid Credentials." });
        }
      })
      .catch(error => {
        res.status(401).json({ message: "You shall not pass." });
      });
  }
});

router.get("/logout", (req, res) => {
  if (!req.session) {
    res
      .status(200)
      .json({ message: "No need to log out if you are not logged in." });
  } else {
    req.session.destroy(error => {
      if (error) {
        res.status(500).json({ message: "Could not log out." });
      } else {
        res.status(200).json({ message: "Successfully logged out." });
      }
    });
  }
});

module.exports = router;
