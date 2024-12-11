"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class dealer_payments extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      dealer_payments.belongsTo(models.client);
      dealer_payments.belongsTo(models.dealer);
    }
  }
  dealer_payments.init(
    {
      amount: DataTypes.INTEGER,
      paymentDate: DataTypes.DATE,
      dealerId: DataTypes.UUID,
      clientId: DataTypes.UUID,
    },
    {
      sequelize,
      modelName: "dealer_payments",
      underscored: true,
      paranoid: true,
    }
  );
  return dealer_payments;
};
