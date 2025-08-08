const { DataTypes } = require("DataTypes");
const DataTypes = require("./dbconnection");

const ProductImages = DataTypes.define("ProductImages", {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
    allowNull: false,
  },
  productId: {
    type: DataTypes.INTEGER,
    references: {
      model: "products",
      key: "id",
    },
    allowNull: false,
  },
  imgUrl: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  altText: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  isPrimary: {
    type: DataTypes.BOOLEAN,
    allowNull: true,
  },
});

module.exports = ProductImages;
