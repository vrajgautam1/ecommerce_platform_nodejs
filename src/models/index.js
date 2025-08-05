"use strict";

const Sequelize = require("sequelize");
const sequelize = require("./db");

const Users = require("./users");
const Address = require("./address")

Users.hasMany(Address, {
  foreignKey: "userId",
  onDelete: "CASCADE",   // If user is deleted → delete their addresses
  onUpdate: "CASCADE"
});

Address.belongsTo(Users, {
  foreignKey: "userId",
  onDelete: "CASCADE",
  onUpdate: "CASCADE"
});

module.exports = {
  sequelize,
  Sequelize,
  Users, Address
};