const { Op } = require("sequelize");
const db = require("../../models");
const { validateUUID } = require("../utils/uuid");

class DealerConfig {
  constructor() {
    this.fieldMapping = {
      id: "id",
      dealerName: "dealerName",
      dealerEmail: "dealerEmail",
      dealerUsername: "dealerUsername",
      accountId: "accountId",
      bankName: "bankName",
      ifscCode: "ifscCode",
      clientId: "clientId",
      clientCompanyUsername: "clientCompanyUsername",
      createdAt: "createdAt",
      updatedAt: "updatedAt",
      deletedAt: "deletedAt",
    };

    this.model = db.dealer;
    this.modelName = db.dealer.name;
    this.tableName = db.dealer.options.tableName;

    this.columnMapping = {
      id: this.model.rawAttributes[this.fieldMapping.id].field,
      dealerName: this.model.rawAttributes[this.fieldMapping.dealerName].field,
      dealerEmail:
        this.model.rawAttributes[this.fieldMapping.dealerEmail].field,
      dealerUsername:
        this.model.rawAttributes[this.fieldMapping.dealerUsername].field,
      accountId: this.model.rawAttributes[this.fieldMapping.accountId].field,
      bankName: this.model.rawAttributes[this.fieldMapping.bankName].field,
      ifscCode: this.model.rawAttributes[this.fieldMapping.ifscCode].field,
      clientId: this.model.rawAttributes[this.fieldMapping.clientId].field,
      clientCompanyUsername:
        this.model.rawAttributes[this.fieldMapping.clientCompanyUsername].field,
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

      dealerName: (val) => {
        return {
          [`${this.columnMapping.dealerName}`]: {
            [Op.like]: `%${val}%`,
          },
        };
      },

      dealerEmail: (val) => {
        return {
          [`${this.columnMapping.dealerEmail}`]: {
            [Op.like]: `%${val}%`,
          },
        };
      },

      dealerUsername: (val) => {
        return {
          [`${this.columnMapping.dealerUsername}`]: {
            [Op.eq]: val,
          },
        };
      },

      accountId: (val) => {
        return {
          [`${this.columnMapping.accountId}`]: {
            [Op.eq]: val,
          },
        };
      },

      bankName: (val) => {
        return {
          [`${this.columnMapping.bankName}`]: {
            [Op.like]: `%${val}%`,
          },
        };
      },

      ifscCode: (val) => {
        return {
          [`${this.columnMapping.ifscCode}`]: {
            [Op.like]: `%${val}%`,
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

      clientCompanyUsername: (val) => {
        return {
          [`${this.columnMapping.clientCompanyUsername}`]: {
            [Op.like]: `%${val}%`,
          },
        };
      },
    };
  }
}

const dealerConfig = new DealerConfig();
module.exports = dealerConfig;
