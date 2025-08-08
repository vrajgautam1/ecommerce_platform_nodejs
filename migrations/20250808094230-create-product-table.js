"use strict";

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    /**
     * Add altering commands here.
     *
     * Example:
     * await queryInterface.createTable('users', { id: Sequelize.INTEGER });
     */

    await queryInterface.createTable("products", {
      id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true,
        allowNull: false,
      },
      title: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      description: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      price: {
        type: Sequelize.DECIMAL(10, 2),
        allowNull: false,
      },
      stock: {
        type: Sequelize.INTEGER,
        allowNull: false,
      },
      imgUrl: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      categoryId: {
        type: Sequelize.INTEGER,
        references:{
          model:"categories",
          key: "id"
        },
        allowNull: false,
      },
      subCategoryId: {
        type: Sequelize.INTEGER,
        references:{
          model:"subcategories",
          key:"id"
        },
        allowNull: false,
      },
      vendorId: {
        type: Sequelize.INTEGER,
        references: {
          model:"users",
          key: "id"
        },
        allowNull: false,
      },
      status: {
        type: Sequelize.ENUM("approved", "rejected", "pending"),
        allowNull: false,
        defaultValue: "pending",
      },
      createdAt: {
        type: Sequelize.DATE,
        allowNull: false,
        defaultValue: Sequelize.literal("CURRENT_TIMESTAMP"),
      },
      updatedAt: {
        type: Sequelize.DATE,
        allowNull: false,
        defaultValue: Sequelize.literal("CURRENT_TIMESTAMP"),
      },
      discount:{
        type: Sequelize.INTEGER,
        allowNull: true
      },
      tags:{
        type:Sequelize.JSON,
        allowNull: true
      },
      rating:{
        type:Sequelize.DECIMAL(3,2), 
        allowNull: true
      },
      slug:{
        type: Sequelize.STRING,
        unique: true
      }
    });
  },

  async down(queryInterface, Sequelize) {
    /**
     * Add reverting commands here.
     *
     * Example:
     * await queryInterface.dropTable('users');
     */
    await queryInterface.dropTable('products');
  },
};
