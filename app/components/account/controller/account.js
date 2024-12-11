const AccountService = require("../service/account");
const { createUUID, validateUUID } = require("../../../utils/uuid");
const Logger = require("../../../utils/logger");
const { HttpStatusCode } = require("axios");
const { setXTotalCountHeader } = require("../../../utils/response");
const badRequest = require("../../../errors/badRequest");
const NotFoundError = require("../../../errors/notFoundError");
const accountConfig = require("../../../model-config/account-config");

class AccountController {
  constructor() {
    this.accountService = new AccountService();
  }

  async createAccount(req, res, next) {
    try {
      Logger.info("create account controller started...");

      const { userId, bankId } = req.params;
      console.log(`userId : ${userId}`);
      console.log("controller bank id : ", bankId);
      if (!validateUUID(userId)) throw new Error("invalid userId...");
      if (!validateUUID(bankId)) throw new Error("invalid bankId...");
      const id = createUUID();
      const response = await this.accountService.createAccount(
        id,
        userId,
        bankId
      );

      Logger.info("create account controller ended...");
      res.status(HttpStatusCode.Created).json(response);
    } catch (error) {
      next(error);
    }
  }

  async getAccountById(req, res, next) {
    try {
      Logger.info("get account by id controller called...");
      const { userId, accountId } = req.params;
      if (!validateUUID(userId)) {
        throw new Error("invalid user id...");
      }
      if (!validateUUID(accountId)) {
        throw new Error("invalid account id...");
      }

      const response = await this.accountService.getAccountById(
        userId,
        accountId,
        req.query
      );
      Logger.info("get account by id controller ended..");
      res.status(HttpStatusCode.Ok).json(response);
    } catch (error) {
      next(error);
    }
  }

  async depositUserAccount(req, res, next) {
    try {
      Logger.info("Deposit user account controller called...");
      let { amount } = req.body;
      const { userId, accountId } = req.params;

      if (!validateUUID(userId)) {
        throw new Error("invalid user id...");
      }

      if (!validateUUID(accountId)) {
        throw new Error("invalid account id...");
      }

      if (amount <= 0)
        throw new badRequest(
          "invalid amount... amount cannot be less than or equal to zero"
        );
      amount = parseInt(amount);

      const response = await this.accountService.depositUserAccount(
        userId,

        accountId,
        amount
      );

      if (!response)
        throw new NotFoundError("account not found or deposit failed...");
      Logger.info("deposit user account controller ended...");
      res.status(HttpStatusCode.Ok).json(response);
    } catch (error) {
      next(error);
    }
  }

  async getBalanceUserAccount(req, res, next) {
    try {
      Logger.info("get balance user account controller started...");

      const { userId, accountId } = req.params;

      if (!validateUUID(userId)) {
        throw new Error("invalid user id...");
      }
      if (!validateUUID(accountId)) {
        throw new Error("invalid account id...");
      }

      const response = await this.accountService.getBalanceUserAccount(
        userId,
        accountId
      );
      Logger.info("get balance user account controller ended...");
      res.status(HttpStatusCode.Ok).json(response);
    } catch (error) {
      next(error);
    }
  }

  async getBalance(req, res, next) {
    try {
      Logger.info("Get balance of client controller started...");
      const { accountId } = req.params;
      const response = await this.accountService.getBalance(accountId);
      Logger.info("Get balance of client controller ended...");
      res.status(HttpStatusCode.Ok).json(response);
    } catch (error) {
      next(error);
    }
  }

  async transferWithinDiffBankId(req, res, next) {
    try {
      Logger.info("transfer within diff bank id controller started...");
      const { userId, accountId } = req.params;
      let { receiverAccountId, amount } = req.body;
      if (accountId === receiverAccountId)
        throw new Error(
          "sender account id and receiver account id cannot be same!"
        );
      amount = parseInt(amount);
      const response = await this.accountService.transferWithinDifferentBankId(
        userId,
        accountId,
        receiverAccountId,
        amount
      );
      if (!response) throw new badRequest("transfer failed...");
      Logger.info("transfer within diff bank id controller ended...");
      res.status(HttpStatusCode.Ok).json(response);
    } catch (error) {
      next(error);
    }
  }
}

const accountController = new AccountController();

module.exports = accountController;
