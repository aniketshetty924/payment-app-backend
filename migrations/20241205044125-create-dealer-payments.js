"use strict";
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable("dealer_payments", {
      id: {
        allowNull: false,
        primaryKey: true,
        type: Sequelize.UUID,
      },
      amount: {
        allowNull: false,
        type: Sequelize.INTEGER,
      },
      payment_date: {
        allowNull: false,
        type: Sequelize.DATE,
      },
      dealer_id: {
        type: Sequelize.UUID,
        references: { key: "id", model: "dealers" },
        allowNull: false,
        onDelete: "CASCADE",
      },
      client_id: {
        type: Sequelize.UUID,
        references: { key: "id", model: "clients" },
        allowNull: false,
        onDelete: "CASCADE",
      },
      created_at: {
        allowNull: false,
        type: Sequelize.DATE,
      },
      updated_at: {
        allowNull: false,
        type: Sequelize.DATE,
      },
      deletedAt: {
        type: Sequelize.DATE,
        allowNull: true,
      },
    });
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable("dealer_payments");
  },
};
