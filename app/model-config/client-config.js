const { Op } = require("sequelize");
const db = require("../../models");
const { validateUUID } = require("../utils/uuid");
class ClientConfig {
  constructor() {
    this.fieldMapping = {
      id: "id",
      clientName: "clientName",
      founder: "founder",
      username: "username",
      password: "password",
      email: "email",
      city: "city",
      state: "state",
      accountId: "accountId",
      businessLicense: "businessLicense",
      gstCertificate: "gstCertificate",
      isAdmin: "isAdmin",

      createdAt: "createdAt",
      updatedAt: "updatedAt",
      deletedAt: "deletedAt",
    };

    this.model = db.client;
    this.modelName = db.client.name;
    this.tableName = db.client.options.tableName;
    this.columnMapping = {
      id: this.model.rawAttributes[this.fieldMapping.id].field,

      clientName: this.model.rawAttributes[this.fieldMapping.clientName].field,

      founder: this.model.rawAttributes[this.fieldMapping.founder].field,

      city: this.model.rawAttributes[this.fieldMapping.city].field,

      state: this.model.rawAttributes[this.fieldMapping.state].field,

      accountId: this.model.rawAttributes[this.fieldMapping.accountId].field,

      businessLicense:
        this.model.rawAttributes[this.fieldMapping.businessLicense].field,

      gstCertificate:
        this.model.rawAttributes[this.fieldMapping.gstCertificate].field,

      isAdmin: this.model.rawAttributes[this.fieldMapping.isAdmin].field,

      createdAt: this.model.rawAttributes[this.fieldMapping.createdAt].field,
      updatedAt: this.model.rawAttributes[this.fieldMapping.updatedAt].field,
      deletedAt: this.model.rawAttributes[this.fieldMapping.deletedAt].field,
    };

    this.association = {
      employee: "employee",
      dealer: "dealer",
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
      username: (val) => {
        return {
          [`${this.columnMapping.username}`]: {
            [Op.eq]: val,
          },
        };
      },

      clientName: (val) => {
        return {
          [`${this.columnMapping.clientName}`]: {
            [Op.like]: `%${val}%`,
          },
        };
      },

      founder: (val) => {
        return {
          [`${this.columnMapping.founder}`]: {
            [Op.like]: `%${val}%`,
          },
        };
      },
      city: (val) => {
        return {
          [`${this.columnMapping.city}`]: {
            [Op.like]: `%${val}%`,
          },
        };
      },
      state: (val) => {
        return {
          [`${this.columnMapping.state}`]: {
            [Op.like]: `%${val}%`,
          },
        };
      },

      email: (val) => {
        return {
          [`${this.columnMapping.email}`]: {
            [Op.eq]: `%${val}%`,
          },
        };
      },
    };
  }
}

const clientConfig = new ClientConfig();
module.exports = clientConfig;
