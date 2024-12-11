"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class form extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  form.init(
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
      status: {
        type: DataTypes.STRING,
        defaultValue: "submitted",
        validate: {
          isIn: [["submitted", "approved", "rejected"]],
        },
      },
      adminNote: {
        type: DataTypes.STRING,
        allowNull: true,
      },
    },
    {
      sequelize,
      modelName: "form",
      underscored: true,
      paranoid: true,
    }
  );
  return form;
};
