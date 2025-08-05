'use strict';

const { DataTypes } = require('sequelize');

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    /**
     * Add altering commands here.
     *
     * Example:
     * await queryInterface.createTable('users', { id: Sequelize.INTEGER });
     */
    await queryInterface.createTable('addresses', {
       id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true,
            allowNull: false,
          },
          userId: {
            type: DataTypes.INTEGER,
            references: {
              model: "users",
              key: "id",
            },
            allowNull: false,
          },
          pincode: {
            type: DataTypes.INTEGER,
            allowNull: false,
          },
          addressLine1: {
            type: DataTypes.STRING,
            allowNull: false,
          },
          addressLine2: {
            type: DataTypes.STRING,
            allowNull: true,
          },
          city: {
            type: DataTypes.STRING,
          },
          district: {
            type: DataTypes.STRING,
            allowNull: false,
          },
          state: {
            type: DataTypes.STRING,
          },
          country: {
            type: DataTypes.STRING,
            allowNull: false,
          },
          type: {
            type: DataTypes.ENUM("home", "work"),
            allowNull: false,
            defaultValue: "home",
          },
          isDefault: {
            type: DataTypes.BOOLEAN,
            defaultValue: false,
          },
          createdAt:{
            type:DataTypes.DATE,
            allowNull:false,
            defaultValue: Sequelize.literal("CURRENT_TIMESTAMP"),
          },
          updatedAt:{
            type:DataTypes.DATE,
            allowNull: false,
            defaultValue: Sequelize.literal("CURRENT_TIMESTAMP"),
          }
    })
  },

  async down (queryInterface, Sequelize) {
    /**
     * Add reverting commands here.
     *
     * Example:
     * await queryInterface.dropTable('users');
     */
    await queryInterface.dropTable('addresses');
  }
};
