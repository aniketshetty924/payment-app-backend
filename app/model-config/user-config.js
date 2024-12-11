const { Op } = require("sequelize");
const db = require("../../models");
const { validateUUID } = require("../utils/uuid");
class UserConfig {
  constructor() {
    this.fieldMapping = {
      id: "id",

      name: "name",
      username: "username",
      email: "email",

      createdAt: "createdAt",
      updatedAt: "updatedAt",
      deletedAt: "deletedAt",
    };

    this.model = db.user;
    this.modelName = db.user.name;
    this.tableName = db.user.options.tableName;
    this.columnMapping = {
      id: this.model.rawAttributes[this.fieldMapping.id].field,

      name: this.model.rawAttributes[this.fieldMapping.name].field,

      username: this.model.rawAttributes[this.fieldMapping.username].field,

      email: this.model.rawAttributes[this.fieldMapping.email].field,

      createdAt: this.model.rawAttributes[this.fieldMapping.createdAt].field,
      updatedAt: this.model.rawAttributes[this.fieldMapping.updatedAt].field,
      deletedAt: this.model.rawAttributes[this.fieldMapping.deletedAt].field,
    };

    this.association = {
      account: "account",
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

      name: (val) => {
        return {
          [`${this.columnMapping.name}`]: {
            [Op.like]: `%${val}%`,
          },
        };
      },

      fullName: (val) => {
        return {
          [`${this.columnMapping.fullName}`]: {
            [Op.like]: `%${val}%`,
          },
        };
      },
      username: (val) => {
        return {
          [`${this.columnMapping.username}`]: {
            [Op.like]: `%${val}%`,
          },
        };
      },
      email: (val) => {
        return {
          [`${this.columnMapping.email}`]: {
            [Op.like]: `%${val}%`,
          },
        };
      },
    };
  }
}

const userConfig = new UserConfig();
module.exports = userConfig;
