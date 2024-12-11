"use strict";
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable("payment_requests", {
      id: {
        allowNull: false,
        primaryKey: true,
        type: Sequelize.UUID,
      },
      client_id: {
        type: Sequelize.UUID,
        references: {
          model: "clients",
          key: "id",
        },
        allowNull: false,
        onDelete: "CASCADE",
      },
      recipient_id: {
        type: Sequelize.UUID,
        allowNull: false,
      },
      recipient_name: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      recipient_type: {
        type: Sequelize.STRING,
        allowNull: false, // dealer or employee
      },
      amount: {
        type: Sequelize.INTEGER,
        allowNull: false,
      },
      payment_date: {
        type: Sequelize.DATE,
        allowNull: false,
      },
      payment_month: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      status: {
        type: Sequelize.STRING,
        defaultValue: "pending",
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
    await queryInterface.dropTable("payment_requests");
  },
};
