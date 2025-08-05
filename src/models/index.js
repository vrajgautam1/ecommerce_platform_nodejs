"use strict";

const Sequelize = require("sequelize");
const sequelize = require("./db");

const Users = require("./users");
const Address = require("./address")
const VendorDetails = require("./vendorDetails");
const AdminLogs = require("./adminLogs")

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

Users.hasOne(VendorDetails, {
  foreignKey: "userId",
  onDelete: "CASCADE",
  onUpdate: "CASCADE"
});

VendorDetails.belongsTo(Users, {
  foreignKey: "userId",
  onDelete: "CASCADE",
  onUpdate: "CASCADE"
});

VendorDetails.belongsTo(Address, {
  foreignKey: "addressId",
  onDelete: "SET NULL",
  onUpdate: "CASCADE"
});

Users.hasOne(AdminLogs, {
  foreignKey: "userId",
})

AdminLogs.belongsTo(Users, {
  foreignKey: "userId",
  onDelete: "CASCADE",  //if a user gets deleted then logs(rows) with userId key will be deleted 
  onUpdate: "CASCADE"
})



module.exports = {
  sequelize,
  Sequelize,
  Users, Address, AdminLogs, VendorDetails
};