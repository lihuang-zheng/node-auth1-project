const express = require("express");
const cors = require("cors");
const helmet = require("helmet");

const usersRouter = require("./users/usersRouter");

const server = express();

server.use(express.json());
server.use(cors());
server.use(helmet());

server.use("/api/users", usersRouter);

module.exports = server;
