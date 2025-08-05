const { DataTypes } = require("sequelize");
const sequelize = require("./dbconnection");

const Users = sequelize.define(
  "Users",
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
      allowNull: false,
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    email: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
    },
    username: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
    },
    password: {
      type: DataTypes.STRING,
    },
    company: {
      type: DataTypes.STRING,
    },
    role: {
      type: DataTypes.ENUM("admin", "user", "vendor"),
      allowNull: false,
      defaultValue: "user",
    },
    gender: {
      type: DataTypes.ENUM("male", "female", "others"),
    },
    accountStatus: {
      type: DataTypes.ENUM("active", "inactive", "pending"),
      allowNull: false,
      defaultValue: "inactive",
    },
    lastLoginAt: {
      type: DataTypes.DATE,
      allowNull: true,
    },
    lastLogoutAt: {
      type: DataTypes.DATE,
      allowNull: true,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = Users;
