"use strict";
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable("employee_payments", {
      id: {
        allowNull: false,
        primaryKey: true,
        type: Sequelize.UUID,
      },
      amount: {
        allowNull: false,
        type: Sequelize.INTEGER,
      },
      employee_id: {
        type: Sequelize.UUID,
        references: { key: "id", model: "employees" },
        allowNull: false,
        onDelete: "CASCADE",
      },
      client_id: {
        type: Sequelize.UUID,
        references: { key: "id", model: "clients" },
        allowNull: false,
        onDelete: "CASCADE",
      },
      payment_date: {
        allowNull: false,
        type: Sequelize.DATE,
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
    await queryInterface.dropTable("employee_payments");
  },
};
