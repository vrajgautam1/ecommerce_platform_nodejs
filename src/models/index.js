"use strict";

const Sequelize = require("sequelize");
const sequelize = require("./db");

const Users = require("./users");
const Address = require("./address"); //model name is address but here we are using it as Address so in controller it'll be db.Address
const VendorDetails = require("./vendorDetails");
const AdminLogs = require("./adminLogs");
const Category = require("./categories");
const SubCategory = require("./subCategories");
const Product = require("./products");
const ProductImages = require("./productImages");
const Products = require("./products");

Users.hasMany(Address, {
  foreignKey: "userId",
  onDelete: "CASCADE", // If user is deleted → delete their addresses
  onUpdate: "CASCADE",
});

Address.belongsTo(Users, {
  foreignKey: "userId",
  onDelete: "CASCADE",
  onUpdate: "CASCADE",
});

Users.hasOne(VendorDetails, {
  foreignKey: "userId",
  onDelete: "CASCADE",
  onUpdate: "CASCADE",
});

VendorDetails.belongsTo(Users, {
  foreignKey: "userId",
  onDelete: "CASCADE",
  onUpdate: "CASCADE",
});

VendorDetails.belongsTo(Address, {
  foreignKey: "addressId",
  onDelete: "SET NULL",
  onUpdate: "CASCADE",
});

Users.hasOne(AdminLogs, {
  foreignKey: "userId",
});

AdminLogs.belongsTo(Users, {
  foreignKey: "userId",
  onDelete: "CASCADE", //if a user gets deleted then logs(rows) with userId key will be deleted
  onUpdate: "CASCADE",
});

// One category can have many subcategories
Category.hasMany(SubCategory, {
  foreignKey: "categoryId",
});

// Each subcategory belongs to one category
SubCategory.belongsTo(Category, {
  foreignKey: "categoryId",
  onDelete: "CASCADE",
  onUpdate: "CASCADE",
});

Users.hasMany(Products, {
  foreignKey: "vendorId",
  as: "products"
});

Category.hasMany(Products, {
  foreignKey: "categoryId",
});

SubCategory.hasMany(Products, {
  foreignKey: "subCategoryId",
});

Products.belongsTo(Users, {
  foreignKey: "vendorId",
  onDelete: "CASCADE",
  onUpdate: "CASCADE",
  as: "vendor"
});

Products.belongsTo(Category, {
  foreignKey: "categoryId",
  onDelete: "CASCADE",
  onUpdate: "CASCADE",
});

Products.belongsTo(SubCategory, {
  foreignKey: "subCategoryId",
  onDelete: "CASCADE",
  onUpdate: "CASCADE",  
})

module.exports = {
  sequelize,
  Sequelize,
  Users,
  Address,
  AdminLogs,
  VendorDetails,
  Category,
  SubCategory,
};
