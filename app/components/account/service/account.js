const Logger = require("../../../utils/logger");
const NotFoundError = require("../../../errors/notFoundError");
const { transaction, rollBack, commit } = require("../../../utils/transaction");
const sendEmail = require("../../../utils/email");
const userConfig = require("../../../model-config/user-config");
const accountConfig = require("../../../model-config/account-config");
const bankConfig = require("../../../model-config/bank-config");
const badRequest = require("../../../errors/badRequest");
const { createUUID } = require("../../../utils/uuid");
const {
  parseSelectFields,
  parseLimitAndOffset,
  parseFilterQueries,
} = require("../../../utils/request");
class AccountService {
  async createAccount(id, userId, bankId, t) {
    if (!t) {
      t = await transaction();
    }
    try {
      Logger.info("create account service started...");
      const user = await userConfig.model.findOne({
        where: { id: userId },
        transaction: t,
      });
      if (!user) {
        throw new NotFoundError(`User with id ${userId} does not exist.`);
      }
      const bank = await bankConfig.model.findOne({
        where: { id: bankId },
        transaction: t,
      });

      if (!bank) {
        throw new NotFoundError(`Bank with id ${bankId} does not exist.`);
      }

      const bankName = bank.bankName;
      let balance = 1000;
      const newAccount = await accountConfig.model.create(
        {
          id,
          userId: user.id,
          bankId: bank.id,
          bankName,
          balance,
        },
        { transaction: t }
      );

      await commit(t);
      Logger.info("create account service ended...");
      await sendEmail(
        user.email,
        "Account Created",
        `Hi ${user.name}! Your account has been successfully created in ${bankName}. Your account id is - ${id}`
      );
      return newAccount;
    } catch (error) {
      await rollBack(t);
      Logger.error(error);
      throw error;
    }
  }

  async getAccountById(userId, accountId, query, t) {
    if (!t) {
      t = await transaction();
    }

    try {
      Logger.info("get account by id service called...");
      let selectArray = parseSelectFields(query, accountConfig.fieldMapping);
      if (!selectArray) {
        selectArray = Object.values(accountConfig.fieldMapping);
      }

      const arg = {
        attributes: selectArray,
        where: {
          userId: userId,
          id: accountId,
        },
        transaction: t,
      };

      const response = await accountConfig.model.findOne(arg);
      await commit(t);
      Logger.info("get account by id service ended...");
      return response;
    } catch (error) {
      await rollBack(t);
      Logger.error(error);
    }
  }

  async depositUserAccount(userId, accountId, amount, t) {
    if (!t) {
      t = await transaction();
    }

    try {
      Logger.info("deposit user account service started...");
      const user = await userConfig.model.findOne(
        {
          where: {
            id: userId,
          },
        },
        { t }
      );

      if (!user) {
        throw new NotFoundError(`User with id ${userId} does not exist.`);
      }

      const account = await accountConfig.model.findOne(
        {
          where: {
            id: accountId,
          },
        },
        { transaction: t }
      );
      if (!account) {
        throw new NotFoundError(`account with id ${accountId} does not exist.`);
      }
      const bankId = account.bankId;
      // console.log("Before balance", account.balance);
      // console.log("amount", amount);
      account.balance += amount;
      //console.log("after", account.balance);
      await account.save({ transaction: t });

      await commit(t);
      await sendEmail(
        user.email,
        "Amount Deposited",
        `Hi ${user.name}! Rs ${amount} has been successfully deposited in your account with account number ${accountId}.`
      );

      Logger.info("deposit user account service ended...");
      return account;
    } catch (error) {
      await rollBack(t);
      Logger.error(error);
    }
  }

  async getBalanceUserAccount(userId, accountId, t) {
    if (!t) {
      t = await transaction();
    }

    try {
      Logger.info("get balance user account service called...");

      const user = await userConfig.model.findOne(
        {
          where: {
            id: userId,
          },
        },
        { t }
      );

      if (!user) {
        throw new NotFoundError(`User with id ${userId} does not exist.`);
      }

      const account = await accountConfig.model.findOne(
        {
          where: {
            id: accountId,
          },
        },
        { transaction: t }
      );
      if (!account) {
        throw new NotFoundError(`account with id ${accountId} does not exist.`);
      }

      await commit(t);
      Logger.info("get balance user account service ended...");
      console.log("Balance : ", account.balance);
      return account.balance;
    } catch (error) {
      await rollBack(t);
      Logger.error(error);
    }
  }

  async getBalance(accountId, t) {
    if (!t) {
      t = await transaction();
    }
    try {
      Logger.info("get balance service started...");
      const account = await accountConfig.model.findOne({
        where: {
          id: accountId,
        },
      });
      await commit(t);
      Logger.info("get balance service ended...");

      return account.balance;
    } catch (error) {
      await rollBack(t);
      Logger.error(error);
    }
  }

  async transferWithinDifferentBankId(
    senderAccountId,
    receiverAccountId,
    amount,
    t
  ) {
    if (!t) {
      t = await transaction();
    }

    try {
      Logger.info("transfer within diff bank id service started...");

      let senderBankAccount = await accountConfig.model.findOne(
        {
          where: {
            id: senderAccountId,
          },
        },
        { transaction: t }
      );
      if (!senderBankAccount)
        throw new badRequest(
          `Sender account with account id ${senderAccountId} does not exists...`
        );

      const senderBankId = senderBankAccount.bankId;
      const senderBankName = senderBankAccount.bankName;

      let receiverBankAccount = await accountConfig.model.findOne(
        {
          where: {
            id: receiverAccountId,
          },
        },
        { transaction: t }
      );
      if (!receiverBankAccount)
        throw new badRequest(
          `receiver account with account id ${receiverAccountId} does not exists...`
        );

      const receiverBankId = receiverBankAccount.bankId;
      const receiverBankName = receiverBankAccount.bankName;

      senderBankAccount.balance -= amount;
      try {
        receiverBankAccount.balance += amount;
      } catch (error) {
        senderBankAccount.balance += amount;
        Logger.error("Transaction failed...");
        throw error;
      }

      await senderBankAccount.save({ transaction: t });
      await receiverBankAccount.save({ transaction: t });

      const senderBalance = senderBankAccount.balance;
      const receiverBalance = receiverBankAccount.balance;

      const senderUserId = senderBankAccount.userId;
      const senderUser = await userConfig.model.findByPk(senderUserId, {
        transaction: t,
      });

      const receiverUserId = receiverBankAccount.userId;
      const receiverUser = await userConfig.model.findByPk(receiverUserId, {
        transaction: t,
      });
      await commit(t);
      Logger.info("transfer within diff bank id service started...");
      await sendEmail(
        senderUser.email,
        "Amount Debited",
        `Hi ${senderUser.name}! Rs ${amount} has been debited from your account with account number ${senderAccountId}.`
      );
      await sendEmail(
        receiverUser.email,
        "Amount Credited",
        `Hi ${receiverUser.name}! Rs ${amount} has been credited to your account with account number ${receiverAccountId}`
      );
      return senderBalance;
    } catch (error) {
      await rollBack(t);
      Logger.error(error);
    }
  }
}

module.exports = AccountService;
