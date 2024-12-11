const sendEmail = require("../../../utils/email");
const Logger = require("../../../utils/logger");
const { transaction, commit, rollBack } = require("../../../utils/transaction");
const bcrypt = require("bcrypt");
const { createUUID } = require("../../../utils/uuid");
const clientConfig = require("../../../model-config/client-config");
const NotFoundError = require("../../../errors/notFoundError");
const dealerConfig = require("../../../model-config/dealer-config");
class DealerService {
  async createDealer(
    id,
    dealerName,
    dealerEmail,
    dealerUsername,
    accountId,
    bankName,
    ifscCode,
    clientCompanyId,
    t
  ) {
    if (!t) {
      t = await transaction();
    }

    try {
      Logger.info("Create dealer service started...");

      let clientCompany = await clientConfig.model.findOne({
        where: { id: clientCompanyId },
        transaction: t,
      });

      if (!clientCompany) {
        throw new NotFoundError(
          `Client company with id : ${clientCompanyId} does not exist...`
        );
      }

      const clientCompanyUsername = clientCompany.username;

      const response = await dealerConfig.model.create(
        {
          id,
          dealerName,
          dealerEmail,
          dealerUsername,
          accountId,
          bankName,
          ifscCode,
          clientId: clientCompanyId,
          clientCompanyUsername,
        },
        { transaction: t }
      );

      if (!response) throw new Error("Dealer creation failed");

      await commit(t);

      await sendEmail(
        dealerEmail,
        "Dealer added",
        `Hi ${dealerName}! You have been successfully added to our system as a dealer.`
      );

      Logger.info("Create dealer service ended...");
      return response;
    } catch (error) {
      await rollBack(t);
      Logger.error(error);
      throw error;
    }
  }

  async getAllDealers(clientId, t) {
    if (!t) {
      t = await transaction();
    }

    try {
      Logger.info("Get all dealers service started...");

      const { count, rows } = await dealerConfig.model.findAndCountAll({
        where: {
          clientId: clientId,
        },
        transaction: t,
      });

      await commit(t);

      Logger.info("Get all dealers service ended...");
      return { count, rows };
    } catch (error) {
      await rollBack(t);
      Logger.error(error);
      throw error;
    }
  }
}

module.exports = DealerService;
