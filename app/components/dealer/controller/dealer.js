const DealerService = require("../service/dealer");
const { HttpStatusCode } = require("axios");
const Logger = require("../../../utils/logger");
const { createUUID } = require("../../../utils/uuid");
const badRequest = require("../../../errors/badRequest");
const bcrypt = require("bcrypt");
const NotFoundError = require("../../../errors/notFoundError");
const { setXTotalCountHeader } = require("../../../utils/response");
class DealerController {
  constructor() {
    this.dealerService = new DealerService();
  }

  async createDealer(req, res, next) {
    try {
      Logger.info("Create dealer controller started...");
      const { clientId } = req.params;
      const {
        dealerName,
        dealerEmail,
        dealerUsername,
        accountId,
        bankName,
        ifscCode,
      } = req.body;

      const id = createUUID();

      const response = await this.dealerService.createDealer(
        id,
        dealerName,
        dealerEmail,
        dealerUsername,
        accountId,
        bankName,
        ifscCode,
        clientId
      );

      Logger.info("Create dealer controller ended...");
      res.status(HttpStatusCode.Created).json(response);
    } catch (error) {
      next(error);
    }
  }

  async getAllDealers(req, res, next) {
    try {
      Logger.info("Get all dealers controller started...");
      const { clientId } = req.params;
      const { count, rows } = await this.dealerService.getAllDealers(clientId);

      setXTotalCountHeader(res, count);

      Logger.info("Get all dealers controller ended...");
      res.status(HttpStatusCode.Ok).json(rows);
    } catch (error) {
      next(error);
    }
  }
}

const dealerController = new DealerController();
module.exports = dealerController;
