const { Op } = require("sequelize");
const db = require("../../models");
const { validateUUID } = require("../utils/uuid");

class EmployeePaymentConfig {
  constructor() {
    this.fieldMapping = {
      id: "id",
      amount: "amount",
      employeeId: "employee_id",
      clientId: "client_id",
      paymentDate: "payment_date",
      createdAt: "created_at",
      updatedAt: "updated_at",
      deletedAt: "deletedAt",
    };

    this.model = db.employee_payments;
    this.modelName = db.employee_payments.name;
    this.tableName = db.employee_payments.options.tableName;
    this.columnMapping = {
      id: this.model.rawAttributes[this.fieldMapping.id].field,
      amount: this.model.rawAttributes[this.fieldMapping.amount].field,
      employeeId: this.model.rawAttributes[this.fieldMapping.employeeId].field,
      clientId: this.model.rawAttributes[this.fieldMapping.clientId].field,
      paymentDate:
        this.model.rawAttributes[this.fieldMapping.paymentDate].field,
      createdAt: this.model.rawAttributes[this.fieldMapping.createdAt].field,
      updatedAt: this.model.rawAttributes[this.fieldMapping.updatedAt].field,
      deletedAt: this.model.rawAttributes[this.fieldMapping.deletedAt].field,
    };

    this.filters = {
      id: (val) => {
        validateUUID(val);
        return {
          [`${this.columnMapping.id}`]: {
            [Op.eq]: val,
          },
        };
      },

      amount: (val) => {
        return {
          [`${this.columnMapping.amount}`]: {
            [Op.eq]: val,
          },
        };
      },

      employeeId: (val) => {
        validateUUID(val);
        return {
          [`${this.columnMapping.employeeId}`]: {
            [Op.eq]: val,
          },
        };
      },

      clientId: (val) => {
        validateUUID(val);
        return {
          [`${this.columnMapping.clientId}`]: {
            [Op.eq]: val,
          },
        };
      },

      paymentDate: (val) => {
        return {
          [`${this.columnMapping.paymentDate}`]: {
            [Op.eq]: val,
          },
        };
      },
    };
  }
}

const employeePaymentConfig = new EmployeePaymentConfig();
module.exports = employeePaymentConfig;
