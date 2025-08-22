const { DataTypes } = require("DataTypes");
const DataTypes = require("./dbconnection");

const Products = DataTypes.define("Products",{
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
        allowNull: false,
      },
      title: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      description: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      price: {
        type: DataTypes.DECIMAL(10, 2),
        allowNull: false,
      },
      stock: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      imgUrl: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      categoryId: {
        type: DataTypes.INTEGER,
        references:{
          model:"categories",
          key: "id"
        },
        allowNull: false,
      },
      subCategoryId: {
        type: DataTypes.INTEGER,
        references:{
          model:"subcategories",
          key:"id"
        },
        allowNull: false,
      },
      vendorId: {
        type: DataTypes.INTEGER,
        references: {
          model:"users",
          key: "id"
        },
        allowNull: false,
      },
      status: {
        type: DataTypes.ENUM("approved", "rejected", "pending"),
        allowNull: false,
        defaultValue: "pending",
      },
      discount:{
        type: DataTypes.INTEGER,
        allowNull: true
      },
      tags:{
        type:DataTypes.JSON,
        allowNull: true
      },
      rating:{
        type:DataTypes.DECIMAL(3,2), 
        allowNull: true
      },
      slug:{
        type: DataTypes.STRING,
        unique: true
      },
      brand:{
        type: DataTypes.STRING,
        allowNull: false
      }
},{
  timestamps:true,
  tableName: "products"
})

module.exports = Products