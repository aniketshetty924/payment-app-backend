const { Op } = require("sequelize");
const db = require("../../models");
const { validateUUID } = require("../utils/uuid");

class PaymentRequestConfig {
  constructor() {
    this.fieldMapping = {
      id: "id",
      clientId: "clientId",
      recipientId: "recipientId",
      recipientName: "recipientName",
      recipientType: "recipientType",
      amount: "amount",
      paymentDate: "paymentDate",
      paymentMonth: "paymentMonth",
      status: "status",
      createdAt: "createdAt",
      updatedAt: "updatedAt",
      deletedAt: "deletedAt",
    };

    this.model = db.payment_requests;
    this.modelName = db.payment_requests.name;
    this.tableName = db.payment_requests.options.tableName;

    this.columnMapping = {
      id: this.model.rawAttributes[this.fieldMapping.id].field,
      clientId: this.model.rawAttributes[this.fieldMapping.clientId].field,
      recipientId:
        this.model.rawAttributes[this.fieldMapping.recipientId].field,
      recipientName:
        this.model.rawAttributes[this.fieldMapping.recipientName].field,
      recipientType:
        this.model.rawAttributes[this.fieldMapping.recipientType].field,
      amount: this.model.rawAttributes[this.fieldMapping.amount].field,
      paymentDate:
        this.model.rawAttributes[this.fieldMapping.paymentDate].field,
      paymentMonth:
        this.model.rawAttributes[this.fieldMapping.paymentMonth].field,
      status: this.model.rawAttributes[this.fieldMapping.status].field,
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

      clientId: (val) => {
        validateUUID(val);
        return {
          [`${this.columnMapping.clientId}`]: {
            [Op.eq]: val,
          },
        };
      },

      recipientId: (val) => {
        validateUUID(val);
        return {
          [`${this.columnMapping.recipientId}`]: {
            [Op.eq]: val,
          },
        };
      },

      recipientType: (val) => {
        return {
          [`${this.columnMapping.recipientType}`]: {
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

      paymentDate: (val) => {
        return {
          [`${this.columnMapping.paymentDate}`]: {
            [Op.eq]: val,
          },
        };
      },
      paymentMonth: (val) => {
        return {
          [`${this.columnMapping.paymentMonth}`]: {
            [Op.eq]: val,
          },
        };
      },

      status: (val) => {
        return {
          [`${this.columnMapping.status}`]: {
            [Op.like]: `%${val}%`,
          },
        };
      },
    };
  }
}

const paymentRequestConfig = new PaymentRequestConfig();
module.exports = paymentRequestConfig;
