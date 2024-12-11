const { Op } = require("sequelize");
const db = require("../../models");
const { validateUUID } = require("../utils/uuid");
class EmployeeConfig {
  constructor() {
    this.fieldMapping = {
      id: "id",
      firstName: "firstName",
      lastName: "lastName",
      fullName: "fullName",
      dateOfBirth: "dateOfBirth",
      email: "email",
      username: "username",
      accountId: "accountId",
      bankName: "bankName",
      ifscCode: "ifscCode",
      salary: "salary",
      role: "role",
      clientId: "clientId",
      clientCompanyUsername: "clientCompanyUsername",

      createdAt: "createdAt",
      updatedAt: "updatedAt",
      deletedAt: "deletedAt",
    };

    this.model = db.employee;
    this.modelName = db.employee.name;
    this.tableName = db.employee.options.tableName;
    this.columnMapping = {
      id: this.model.rawAttributes[this.fieldMapping.id].field,
      firstName: this.model.rawAttributes[this.fieldMapping.firstName].field,
      lastName: this.model.rawAttributes[this.fieldMapping.lastName].field,
      fullName: this.model.rawAttributes[this.fieldMapping.fullName].field,
      dateOfBirth:
        this.model.rawAttributes[this.fieldMapping.dateOfBirth].field,
      email: this.model.rawAttributes[this.fieldMapping.email].field,
      username: this.model.rawAttributes[this.fieldMapping.username].field,

      accountId: this.model.rawAttributes[this.fieldMapping.accountId].field,
      bankName: this.model.rawAttributes[this.fieldMapping.bankName].field,
      ifscCode: this.model.rawAttributes[this.fieldMapping.ifscCode].field,
      salary: this.model.rawAttributes[this.fieldMapping.salary].field,
      role: this.model.rawAttributes[this.fieldMapping.role].field,
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

      firstName: (val) => {
        return {
          [`${this.columnMapping.firstName}`]: {
            [Op.like]: `%${val}%`,
          },
        };
      },

      lastName: (val) => {
        return {
          [`${this.columnMapping.lastName}`]: {
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

      dateOfBirth: (val) => {
        return {
          [`${this.columnMapping.dateOfBirth}`]: {
            [Op.eq]: val,
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

      username: (val) => {
        return {
          [`${this.columnMapping.username}`]: {
            [Op.eq]: val,
          },
        };
      },

      dateOfJoining: (val) => {
        return {
          [`${this.columnMapping.dateOfJoining}`]: {
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

      salary: (val) => {
        return {
          [`${this.columnMapping.salary}`]: {
            [Op.eq]: val,
          },
        };
      },

      role: (val) => {
        return {
          [`${this.columnMapping.role}`]: {
            [Op.like]: `%${val}%`,
          },
        };
      },

      clientCompanyId: (val) => {
        return {
          [`${this.columnMapping.clientCompanyId}`]: {
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

const employeeConfig = new EmployeeConfig();
module.exports = employeeConfig;
