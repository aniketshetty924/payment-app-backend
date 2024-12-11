"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class dealer extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      dealer.belongsTo(models.client);
      dealer.hasMany(models.dealer_payments);
    }
  }
  dealer.init(
    {
      dealerName: DataTypes.STRING,
      dealerEmail: DataTypes.STRING,
      dealerUsername: DataTypes.STRING,
      accountId: DataTypes.UUID,
      bankName: DataTypes.STRING,
      ifscCode: DataTypes.STRING,
      clientId: DataTypes.UUID,
      clientCompanyUsername: DataTypes.STRING,
    },
    {
      sequelize,
      modelName: "dealer",
      underscored: true,
      paranoid: true,
    }
  );
  return dealer;
};
