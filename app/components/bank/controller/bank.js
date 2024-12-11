const { HttpStatusCode } = require("axios");
const Logger = require("../../../utils/logger");
const { createUUID, validateUUID } = require("../../../utils/uuid");
const BankService = require("../service/bank");
const { setXTotalCountHeader } = require("../../../utils/response");

class BankController {
  constructor() {
    this.bankService = new BankService();
  }

  async createBank(req, res, next) {
    try {
      Logger.info("Create Bank controller started...");
      const { bankName, abbreviation } = req.body;

      const response = await this.bankService.createBank(
        createUUID(),
        bankName,
        abbreviation
      );
      Logger.info("Create Bank controller ended...");
      res.status(HttpStatusCode.Created).json(response);
    } catch (error) {
      next(error);
    }
  }

  async getAllBanks(req, res, next) {
    try {
      Logger.info("get all banks controller started...");
      const { count, rows } = await this.bankService.getAllBanks(req.query);
      setXTotalCountHeader(res, count);
      Logger.info("get all banks controller ended...");
      res.status(HttpStatusCode.Ok).json(rows);
    } catch (error) {
      next(error);
    }
  }

  async getBankById(req, res, next) {
    try {
      Logger.info("get bank by id controller called...");
      const { bankId } = req.params;
      if (!validateUUID(bankId)) {
        throw new Error("invalid bank id...");
      }

      const response = await this.bankService.getBankById(bankId, req.query);
      Logger.info("get bank by id controller ended...");
      res.status(HttpStatusCode.Ok).json(response);
    } catch (error) {
      next(error);
    }
  }

  async getBankByAbb(req, res, next) {
    try {
      Logger.info("Get bank by abbreviation controller started...");
      const { abb } = req.body;
      if (typeof abb != "string")
        throw new badRequest("Invalid abbreviation type!");
      const response = await this.bankService.getBankByAbb(abb);

      Logger.info("Get bank by abbreviation controller ended...");
      res.status(HttpStatusCode.Ok).json(response);
    } catch (error) {
      next(error);
    }
  }
}
const bankController = new BankController();
module.exports = bankController;
