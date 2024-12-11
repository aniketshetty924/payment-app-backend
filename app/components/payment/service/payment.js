const badRequest = require("../../../errors/badRequest");
const paymentRequestConfig = require("../../../model-config/payment_request-config");
const Logger = require("../../../utils/logger");
const {
  parseSelectFields,
  parseLimitAndOffset,
  parseFilterQueries,
} = require("../../../utils/request");

const { transaction, commit, rollBack } = require("../../../utils/transaction");
const { createUUID } = require("../../../utils/uuid");
const AccountService = require("../../account/service/account");
const ClientService = require("../../client/service/client");

class PaymentService {
  constructor() {
    this.accountService = new AccountService();
    this.clientService = new ClientService();
  }

  async savePaymentsForAdminReview(clientId, paymentDetails, t) {
    if (!t) {
      t = await transaction();
    }
    try {
      Logger.info("Save payments for admin review service started...");
      const paymentRecords = [];

      const paymentMonth =
        paymentDetails[0]?.paymentMonth || new Date().toISOString().slice(0, 7);

      for (let payment of paymentDetails) {
        const { recipientId, recipientName, paymentType, amount, paymentDate } =
          payment;
        const id = createUUID();

        const paymentRecord = await paymentRequestConfig.model.create(
          {
            id,
            clientId,
            recipientId,
            recipientName,
            recipientType: paymentType,
            amount,
            paymentDate,
            paymentMonth,
            status: "pending",
          },
          { transaction: t }
        );

        paymentRecords.push(paymentRecord);
      }

      await commit(t);
      Logger.info("Save payments for admin review service ended...");
      return paymentRecords;
    } catch (error) {
      await rollBack(t);
      Logger.error(error);
      throw error;
    }
  }

  async getPaymentsForProcessing(clientId, paymentInfoIds, t) {
    if (!t) {
      t = await transaction();
    }
    try {
      Logger.info("Get payments for processing service started...");

      const payments = await paymentRequestConfig.model.findAll({
        where: {
          clientId,
          id: paymentInfoIds,
          status: "pending",
        },
        transaction: t,
      });

      await commit(t);

      Logger.info("Get payments for processing service ended...");
      return payments;
    } catch (error) {
      await rollBack(t);
      Logger.error(error);
      throw error;
    }
  }

  async processPayments(clientId, paymentsToProcess, t) {
    if (!t) {
      t = await transaction();
    }
    try {
      Logger.info("Process payments service started...");
      if (!Array.isArray(paymentsToProcess) || paymentsToProcess.length === 0) {
        throw new Error("No payments to process.");
      }
      const client = await this.clientService.findClientById(clientId);
      const clientAccountId = client.accountId;
      console.log("PRINTING DATA : ", paymentsToProcess);
      for (let payment of paymentsToProcess) {
        const { recipientId, recipientType, amount, paymentMonth } = payment;

        if (recipientType === "dealer" || recipientType === "employee") {
          await this.accountService.transferWithinDifferentBankId(
            clientAccountId,
            recipientId,
            amount
          );
        }

        await paymentRequestConfig.model.update(
          { status: "processed" },
          { where: { recipientId: recipientId, paymentMonth }, transaction: t }
        );
      }

      await commit(t);
      Logger.info("Process payments service ended...");
      return { message: "Payments processed successfully" };
    } catch (error) {
      await rollBack(t);
      Logger.error(error);
      throw error;
    }
  }

  // Fetch all pending payment requests (for admin)
  async getAllPaymentRequests(clientId, t) {
    if (!t) {
      t = await transaction();
    }
    try {
      Logger.info("Fetching all payment requests service started...");

      const paymentRequests = await paymentRequestConfig.model.findAll({
        where: {
          clientId,
          status: "pending",
        },
        transaction: t,
      });

      await commit(t);

      Logger.info("Fetching all payment requests service ended...");
      return paymentRequests;
    } catch (error) {
      await rollBack(t);
      Logger.error(error);
      throw error;
    }
  }

  async getAllEmployeesPaymentRequestByMonth(clientId, paymentMonth, t) {
    if (!t) {
      t = await transaction();
    }
    try {
      Logger.info(
        "Get all employees payment requests per month service started..."
      );
      const { count, rows } = await paymentRequestConfig.model.findAndCountAll({
        where: {
          clientId: clientId,
          recipientType: "employee",
          paymentMonth: paymentMonth,
        },
        transaction: t,
      });
      await commit(t);
      Logger.info(
        "Get all employees payment requests per month service ended..."
      );
      return { count, rows };
    } catch (error) {
      await rollBack(t);
      Logger.error(error);
      throw error;
    }
  }
  async getAllPendingEmployeesPaymentRequest(t) {
    if (!t) {
      t = await transaction();
    }
    try {
      Logger.info(
        "Get all pending employees payment requests  service started..."
      );
      const { count, rows } = await paymentRequestConfig.model.findAndCountAll({
        where: {
          // clientId: clientId,
          recipientType: "employee",
          status: "pending",
        },
        transaction: t,
      });
      await commit(t);
      Logger.info(
        "Get all pending employees payment requests  service ended..."
      );
      return { count, rows };
    } catch (error) {
      await rollBack(t);
      Logger.error(error);
      throw error;
    }
  }
  async getAllPendingDealersPaymentRequest(t) {
    if (!t) {
      t = await transaction();
    }
    try {
      Logger.info(
        "Get all pending dealers payment requests  service started..."
      );
      const { count, rows } = await paymentRequestConfig.model.findAndCountAll({
        where: {
          // clientId: clientId,
          recipientType: "dealer",
          status: "pending",
        },
        transaction: t,
      });
      await commit(t);
      Logger.info("Get all pending dealers payment requests  service ended...");
      return { count, rows };
    } catch (error) {
      await rollBack(t);
      Logger.error(error);
      throw error;
    }
  }
  async getAllDealersPaymentRequestByMonth(clientId, paymentMonth, t) {
    if (!t) {
      t = await transaction();
    }
    try {
      Logger.info(
        "Get all dealers payment requests per month service started..."
      );
      const { count, rows } = await paymentRequestConfig.model.findAndCountAll({
        where: {
          clientId: clientId,
          recipientType: "dealer",
          paymentMonth: paymentMonth,
        },
        transaction: t,
      });
      await commit(t);
      Logger.info(
        "Get all dealers payment requests per month service ended..."
      );
      return { count, rows };
    } catch (error) {
      await rollBack(t);
      Logger.error(error);
      throw error;
    }
  }

  async getEmployeeSalaryReportByMonth(clientId, paymentMonth, t) {
    if (!t) {
      t = await transaction();
    }
    try {
      Logger.info("Get employee salary report by month service started...");

      const { count, rows } = await paymentRequestConfig.model.findAndCountAll({
        where: {
          clientId: clientId,
          recipientType: "employee", // Only for employee
          paymentMonth: paymentMonth, // Filter by month
        },
        transaction: t,
      });

      await commit(t);
      Logger.info("Get employee salary report by month service ended...");
      return { count, rows };
    } catch (error) {
      await rollBack(t);
      Logger.error(error);
      throw error;
    }
  }

  // Get dealer payment report by month
  async getDealerPaymentReportByMonth(clientId, paymentMonth, t) {
    if (!t) {
      t = await transaction();
    }
    try {
      Logger.info("Get dealer payment report by month service started...");

      const { count, rows } = await paymentRequestConfig.model.findAndCountAll({
        where: {
          clientId: clientId,
          recipientType: "dealer", // Only for dealers
          paymentMonth: paymentMonth, // Filter by month
        },
        transaction: t,
      });

      await commit(t);
      Logger.info("Get dealer payment report by month service ended...");
      return { count, rows };
    } catch (error) {
      await rollBack(t);
      Logger.error(error);
      throw error;
    }
  }
}

module.exports = PaymentService;
