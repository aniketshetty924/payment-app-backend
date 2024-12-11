"use strict";
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable("dealers", {
      id: {
        allowNull: false,
        primaryKey: true,
        type: Sequelize.UUID,
      },
      dealer_name: {
        allowNull: false,
        type: Sequelize.STRING,
      },

      dealer_email: {
        type: Sequelize.STRING,
      },
      dealer_username: {
        allowNull: false,
        type: Sequelize.STRING,
        unique: true,
      },
      account_id: {
        allowNull: false,
        type: Sequelize.UUID,
        unique: true,
      },
      bank_name: {
        allowNull: false,
        type: Sequelize.STRING,
      },
      ifsc_code: {
        allowNull: false,
        type: Sequelize.STRING,
      },
      client_id: {
        type: Sequelize.UUID,
        references: { key: "id", model: "clients" },
        allowNull: false,
        onDelete: "CASCADE",
      },
      client_company_username: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      created_at: {
        allowNull: false,
        type: Sequelize.DATE,
      },
      updated_at: {
        allowNull: false,
        type: Sequelize.DATE,
      },
      deleted_at: {
        type: Sequelize.DATE,
        allowNull: true,
      },
    });
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable("dealers");
  },
};
