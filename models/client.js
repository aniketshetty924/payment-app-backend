"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class client extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      client.hasMany(models.employee);
      client.hasMany(models.dealer);
      client.hasMany(models.employee_payments);
      client.hasMany(models.dealer_payments);
    }
  }
  client.init(
    {
      clientName: DataTypes.STRING,
      founder: DataTypes.STRING,
      username: DataTypes.STRING,
      password: DataTypes.STRING,
      email: DataTypes.STRING,
      city: DataTypes.STRING,
      state: DataTypes.STRING,
      accountId: DataTypes.UUID,
      businessLicense: DataTypes.STRING,
      gstCertificate: DataTypes.STRING,
      isAdmin: DataTypes.BOOLEAN,
    },
    {
      sequelize,
      modelName: "client",
      underscored: true,
      paranoid: true,
    }
  );
  return client;
};
