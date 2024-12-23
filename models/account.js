"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class account extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      account.belongsTo(models.user);
      account.belongsTo(models.bank);
    }
  }
  account.init(
    {
      userId: DataTypes.UUID,
      bankId: DataTypes.UUID,
      bankName: DataTypes.STRING,
      balance: DataTypes.INTEGER,
    },
    {
      sequelize,
      modelName: "account",
      underscored: true,
      paranoid: true,
    }
  );
  return account;
};
