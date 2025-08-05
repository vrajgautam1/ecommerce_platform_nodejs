const { DataTypes } = require("sequelize");
const sequelize = require("./dbconnection");

const AdminLogs = sequelize.define("AdminLogs", {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true,
  },
  userId: {
    type: DataTypes.INTEGER,
    references: {
      model: "users",
      key: "id",
    },
    allowNull: false,
  },
  type: {
    type: DataTypes.ENUM(
      "vendor_approval",
      "category_approval",
      "subcategory_approval",
      "category_and_subcategory"
    ),
    allowNull: false,
  },
  data: {
    type: DataTypes.JSON,
    allowNull: false,
  },
  status: {
    type: DataTypes.ENUM("pending", "approved", "rejected"),
    defaultValue: "pending",
  },
});

module.exports = AdminLogs;
