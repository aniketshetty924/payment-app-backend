"use strict";
const { Model } = require("sequelize");
const { Sequelize } = require(".");
module.exports = (sequelize, DataTypes) => {
  class employee extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      employee.belongsTo(models.client);
      employee.hasMany(models.employee_payments);
    }
  }
  employee.init(
    {
      firstName: DataTypes.STRING,
      lastName: DataTypes.STRING,
      fullName: DataTypes.STRING,
      dateOfBirth: DataTypes.DATEONLY,
      email: DataTypes.STRING,
      username: DataTypes.STRING,
      accountId: DataTypes.UUID,
      bankName: DataTypes.STRING,
      ifscCode: DataTypes.STRING,
      salary: DataTypes.INTEGER,
      role: DataTypes.STRING,
      clientId: DataTypes.UUID,
      clientCompanyUsername: DataTypes.STRING,
    },
    {
      sequelize,
      modelName: "employee",
      underscored: true,
      paranoid: true,

      hooks: {
        beforeUpdate: (user) => {
          if (user.changed("firstName") || user.changed("lastName")) {
            user.fullName = `${user.firstName} ${user.lastName}`;
          }
        },
      },
    }
  );
  return employee;
};
