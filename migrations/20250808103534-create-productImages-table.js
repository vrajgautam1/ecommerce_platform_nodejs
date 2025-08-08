'use strict';

const { SELECT } = require('sequelize/lib/query-types');

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    /**
     * Add altering commands here.
     *
     * Example:
     * await queryInterface.createTable('users', { id: Sequelize.INTEGER });
     */
    await queryInterface.createTable('productImages', {
      id:{
        type:Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true,
        allowNull: false
      },
      productId:{
        type:Sequelize.INTEGER,
        references:{
          model: "products",
          key: "id"
        },
        allowNull: false
      },
      imgUrl:{
        type:Sequelize.STRING,
        allowNull: false
      },
      altText:{
        type:Sequelize.STRING,
        allowNull: true
      },
      isPrimary:{
        type:Sequelize.BOOLEAN,
        allowNull: true
      },
      createdAt:{
        type:Sequelize.DATE,
        allowNull: false,
        defaultValue: Sequelize.literal("CURRENT_TIMESTAMP")
      },
      updatedAt:{
        type:Sequelize.DATE,
        allowNull: false,
        defaultValue: Sequelize.literal("CURRENT_TIMESTAMP")
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
    await queryInterface.dropTable('productImages');
  }
};
