const { DataTypes } = require("sequelize");
const sequelize = require("./dbconnection");

const VendorDetails = sequelize.define("VendorDetails", {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    userId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: "Users",
        key: "id",
      },
      onDelete: "CASCADE",
    },
    companyName: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    gstNumber: {
      type: DataTypes.STRING,
    },
    businessEmail: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    address: {
      type: DataTypes.TEXT,
      allowNull: false,
    },
    status: {
      type: DataTypes.ENUM("pending", "approved", "rejected"),
      defaultValue: "pending",
    },
    businessType:{
      type: DataTypes.STRING,
      allowNull: true,
    },
    PAN:{
      type: DataTypes.STRING,
      allowNull: false,
      unique: true
    }
}, {
    timestamps: true
})

module.exports = VendorDetails