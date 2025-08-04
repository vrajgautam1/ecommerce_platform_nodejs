"use strict";

const Sequelize = require("sequelize");
const sequelize = require("./db");

const Users = require("./users");

module.exports = {
  sequelize,
  Sequelize,
  Users,
};