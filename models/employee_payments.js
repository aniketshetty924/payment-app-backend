"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class employee_payments extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      employee_payments.belongsTo(models.client);
      employee_payments.belongsTo(models.employee);
    }
  }
  employee_payments.init(
    {
      amount: DataTypes.INTEGER,
      paymentDate: DataTypes.DATE,
      employeeId: DataTypes.UUID,
      clientId: DataTypes.UUID,
    },
    {
      sequelize,
      modelName: "employee_payments",
      underscored: true,
      paranoid: true,
    }
  );
  return employee_payments;
};
