const PaymentService = require("../service/payment");
const Logger = require("../../../utils/logger");
const ClientService = require("../../client/service/client");
const { HttpStatusCode } = require("axios");
const { setXTotalCountHeader } = require("../../../utils/response");

class PaymentController {
  constructor() {
    this.paymentService = new PaymentService();
    this.clientService = new ClientService();
  }

  // Save payment information for admin review
  async savePaymentsForAdminReview(req, res, next) {
    const { clientId } = req.params;
    const { paymentDetails } = req.body;

    try {
      Logger.info("Save payments for admin review controller started...");
      const savedPayments =
        await this.paymentService.savePaymentsForAdminReview(
          clientId,
          paymentDetails
        );
      res.status(HttpStatusCode.Created).json(savedPayments);
      Logger.info("Save payments for admin review controller ended...");
    } catch (error) {
      next(error);
    }
  }

  // Fetch the payment info selected by admin for processing
  async getPaymentsForProcessing(req, res, next) {
    const { clientId } = req.params;
    const { paymentInfoIds } = req.body;

    try {
      Logger.info("Get payments for processing controller started...");
      const payments = await this.paymentService.getPaymentsForProcessing(
        clientId,
        paymentInfoIds
      );
      res.status(HttpStatusCode.Ok).json(payments);
      Logger.info("Get payments for processing controller ended...");
    } catch (error) {
      next(error);
    }
  }

  // Process payments by transferring funds and saving records
  async processPayments(req, res, next) {
    try {
      Logger.info("Process payments controller started...");
      const { clientId } = req.params;
      const { paymentsToProcess } = req.body;
      if (!Array.isArray(paymentsToProcess)) {
        throw new Error("paymentsToProcess must be an array.");
      }

      console.log("PRINTING IN CTR : ", paymentsToProcess);

      const result = await this.paymentService.processPayments(
        clientId,
        paymentsToProcess
      );
      res.status(HttpStatusCode.Ok).json(result);
      Logger.info("Process payments controller ended...");
    } catch (error) {
      next(error);
    }
  }

  // Fetch all pending payment requests (for admin)
  async getAllPaymentRequests(req, res, next) {
    const { clientId } = req.params;
    try {
      Logger.info("Fetching all payment requests controller started...");
      const paymentRequests = await this.paymentService.getAllPaymentRequests(
        clientId
      );
      res.status(HttpStatusCode.Ok).json(paymentRequests);
      Logger.info("Fetching all payment requests controller ended...");
    } catch (error) {
      next(error);
    }
  }

  async getAllEmployeesPaymentRequestByMonth(req, res, next) {
    try {
      const { clientId } = req.params;
      const { paymentMonth } = req.query;
      const { count, rows } =
        await this.paymentService.getAllEmployeesPaymentRequestByMonth(
          clientId,
          paymentMonth
        );
      setXTotalCountHeader(res, count);

      res.status(HttpStatusCode.Ok).json(rows);
    } catch (error) {
      next(error);
    }
  }

  async getAllPendingEmployeesPaymentRequest(req, res, next) {
    try {
      // const { clientId } = req.params;

      const { count, rows } =
        await this.paymentService.getAllPendingEmployeesPaymentRequest();
      setXTotalCountHeader(res, count);

      res.status(HttpStatusCode.Ok).json(rows);
    } catch (error) {
      next(error);
    }
  }
  async getAllPendingDealersPaymentRequest(req, res, next) {
    try {
      const { count, rows } =
        await this.paymentService.getAllPendingDealersPaymentRequest();
      setXTotalCountHeader(res, count);

      res.status(HttpStatusCode.Ok).json(rows);
    } catch (error) {
      next(error);
    }
  }

  async getAllDealersPaymentRequestByMonth(req, res, next) {
    try {
      Logger.info(
        "Get all employees payment requests per month controller started..."
      );
      const { clientId } = req.params;
      const { paymentMonth } = req.query;
      const { count, rows } =
        await this.paymentService.getAllDealersPaymentRequestByMonth(
          clientId,
          paymentMonth
        );
      setXTotalCountHeader(res, count);

      Logger.info(
        "Get all employees payment requests per month controller ended..."
      );
      res.status(HttpStatusCode.Ok).json(rows);
    } catch (error) {
      next(error);
    }
  }

  async getEmployeeSalaryReportByMonth(req, res, next) {
    try {
      Logger.info("Get employees salary report by month controller started...");
      const { clientId, paymentMonth } = req.params;

      // Fetch the report from the service layer
      const { count, rows } =
        await this.paymentService.getEmployeeSalaryReportByMonth(
          clientId,
          paymentMonth
        );

      // Set X-Total-Count header and return the response
      setXTotalCountHeader(res, count);
      Logger.info("Get employees salary report by month controller ended...");

      res.status(HttpStatusCode.Ok).json(rows);
    } catch (error) {
      next(error);
    }
  }

  // Get dealer payment report by month
  async getDealerPaymentReportByMonth(req, res, next) {
    try {
      Logger.info("Get dealer salary report by month controller started...");

      const { clientId, paymentMonth } = req.params;

      // Fetch the report from the service layer
      const { count, rows } =
        await this.paymentService.getDealerPaymentReportByMonth(
          clientId,
          paymentMonth
        );

      // Set X-Total-Count header and return the response
      setXTotalCountHeader(res, count);
      Logger.info("Get employees salary report by month controller ended...");

      res.status(HttpStatusCode.Ok).json(rows);
    } catch (error) {
      next(error);
    }
  }
}

const paymentController = new PaymentController();
module.exports = paymentController;
