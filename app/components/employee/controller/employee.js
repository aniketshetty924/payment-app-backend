const { HttpStatusCode } = require("axios");
const Logger = require("../../../utils/logger");
const moment = require("moment");

const { createUUID } = require("../../../utils/uuid");
const EmployeeService = require("../service/employee");
const badRequest = require("../../../errors/badRequest");
const bcrypt = require("bcrypt");
const NotFoundError = require("../../../errors/notFoundError");
const { Payload } = require("../../../middleware/authService");
const { setXTotalCountHeader } = require("../../../utils/response");

class EmployeeController {
  constructor() {
    this.employeeService = new EmployeeService();
  }

  async createEmployee(req, res, next) {
    try {
      Logger.info("Create employee controller started...");

      const { clientId } = req.params;
      const {
        firstName,
        lastName,
        dateOfBirth,
        email,
        username,
        accountId,
        bankName,
        ifscCode,
        salary,
        role,
      } = req.body;

      // Parse dates properly using moment.js (no need to specify format for YYYY-MM-DD)
      const parsedDateOfBirth = moment(dateOfBirth);

      // Check if dates are valid
      if (!parsedDateOfBirth.isValid()) {
        return res
          .status(StatusCodes.BAD_REQUEST)
          .json({ error: "Invalid date format provided" });
      }

      const clientCompanyId = clientId;
      const id = createUUID();

      const response = await this.employeeService.createEmployee(
        id,
        firstName,
        lastName,
        parsedDateOfBirth.toDate(),
        email,
        username,
        accountId,
        bankName,
        ifscCode,
        salary,
        role,
        clientCompanyId
      );

      Logger.info("Create employee controller ended...");
      res.status(HttpStatusCode.Created).json(response); // Use StatusCodes correctly
    } catch (error) {
      next(error);
    }
  }

  async uploadEmployeesCSV(req, res, next) {
    try {
      Logger.info("upload employees csv controller started...");

      const file = req.file; // Multer adds the file to req.file
      console.log("FILE : ", file);
      if (!file) {
        return res.status(400).json({ error: "Please upload a CSV file" });
      }

      const employees = await this.parseCSV(file.path); // Parse the CSV file

      console.log("Employees parsed from CSV: ", employees);

      // Store employees in the database
      const addedEmployees = await this.employeeService.addMultipleEmployees(
        employees
      );
      Logger.info("upload employees csv controller ended...");
      res.status(HttpStatusCode.Created).json({ data: addedEmployees });
    } catch (error) {
      next(error);
    }
  }

  parseCSV(filePath) {
    // Parse CSV using a library like 'papaparse'
    Logger.info("Parse csv started...");
    return new Promise((resolve, reject) => {
      const fs = require("fs");
      const Papa = require("papaparse");
      const file = fs.readFileSync(filePath, "utf8");

      Papa.parse(file, {
        header: true,
        dynamicTyping: true,
        skipEmptyLines: true,
        complete: (result) => {
          resolve(result.data); // Parsed data
        },
        error: (error) => {
          reject(error);
        },
      });
    });
  }

  async getAllEmployees(req, res, next) {
    try {
      Logger.info("Get all employees controller started...");
      const { clientId } = req.params;
      const { count, rows } = await this.employeeService.getAllEmployees(
        clientId,
        req.query
      );
      setXTotalCountHeader(res, count);

      Logger.info("Get all employees controller ended...");
      res.status(HttpStatusCode.Ok).json(rows);
    } catch (error) {
      next(error);
    }
  }
}

const employeeController = new EmployeeController();
module.exports = employeeController;
