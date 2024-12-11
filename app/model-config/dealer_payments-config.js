const { Op } = require("sequelize");
const db = require("../../models");
const { validateUUID } = require("../utils/uuid");

class DealerPaymentConfig {
  constructor() {
    this.fieldMapping = {
      id: "id",
      amount: "amount",
      paymentDate: "payment_date",
      dealerId: "dealer_id",
      clientId: "client_id",
      createdAt: "created_at",
      updatedAt: "updated_at",
      deletedAt: "deletedAt",
    };

    this.model = db.dealer_payments;
    this.modelName = db.dealer_payments.name;
    this.tableName = db.dealer_payments.options.tableName;
    this.columnMapping = {
      id: this.model.rawAttributes[this.fieldMapping.id].field,
      amount: this.model.rawAttributes[this.fieldMapping.amount].field,
      paymentDate:
        this.model.rawAttributes[this.fieldMapping.paymentDate].field,
      dealerId: this.model.rawAttributes[this.fieldMapping.dealerId].field,
      clientId: this.model.rawAttributes[this.fieldMapping.clientId].field,
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

      paymentDate: (val) => {
        return {
          [`${this.columnMapping.paymentDate}`]: {
            [Op.eq]: val,
          },
        };
      },

      dealerId: (val) => {
        validateUUID(val);
        return {
          [`${this.columnMapping.dealerId}`]: {
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
    };
  }
}

const dealerPaymentConfig = new DealerPaymentConfig();
module.exports = dealerPaymentConfig;
