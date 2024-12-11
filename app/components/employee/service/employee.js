const sendEmail = require("../../../utils/email");
const Logger = require("../../../utils/logger");
const { transaction, commit, rollBack } = require("../../../utils/transaction");
const bcrypt = require("bcrypt");
const { createUUID } = require("../../../utils/uuid");
const clientConfig = require("../../../model-config/client-config");
const NotFoundError = require("../../../errors/notFoundError");
const employeeConfig = require("../../../model-config/employee-config");
const {
  parseFilterQueries,
  parseSelectFields,
  parseLimitAndOffset,
} = require("../../../utils/request");

class EmployeeService {
  async createEmployee(
    id,
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
    clientCompanyId,
    t
  ) {
    if (!t) {
      t = await transaction();
    }

    try {
      Logger.info("Create employee service started...");
      const fullName = firstName + " " + lastName;

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

      const response = await employeeConfig.model.create(
        {
          id,
          firstName,
          lastName,
          fullName,
          dateOfBirth,
          email,
          username,
          accountId,
          bankName,
          ifscCode,
          salary,
          role,
          clientId: clientCompanyId,
          clientCompanyUsername,
        },
        { transaction: t }
      );

      if (!response) throw new Error("Employee creation failed");

      await commit(t);

      await sendEmail(
        email,
        "Employee added",
        `Hi ${firstName} ${lastName}! You have been added to our system. Further updates about your salary and payments will be mailed to this email address.`
      );

      Logger.info("Create employee service ended...");
      return response;
    } catch (error) {
      await rollBack(t);
      Logger.error(error);
      throw error;
    }
  }

  async addMultipleEmployees(employees, t) {
    if (!t) {
      t = await transaction();
    }
    try {
      Logger.info("Add multiple employees service started...");

      const employeePromises = employees.map(async (employee) => {
        await employeeConfig.model.create(
          {
            ...employee,
            id: createUUID(), // Ensure each employee gets a unique ID
          },
          { transaction: t }
        );
      });

      await Promise.all(employeePromises);

      await commit(t);

      Logger.info("Add multiple employees service ended...");
      return employees;
    } catch (error) {
      await rollBack(t);
      Logger.error(error);
      throw error;
    }
  }

  async getAllEmployees(clientId, query, t) {
    if (!t) {
      t = await transaction(); // Start transaction if not passed
    }

    try {
      Logger.info("get all employees service started...");
      let selectArray = parseSelectFields(query, employeeConfig.fieldMapping);
      if (!selectArray) {
        selectArray = Object.values(employeeConfig.fieldMapping);
      }

      const arg = {
        attributes: selectArray,
        ...parseLimitAndOffset(query),
        transaction: t,
        where: {
          clientId: clientId,
        },
        ...parseFilterQueries(query, employeeConfig.filters),
      };
      // Query the database to find employees
      const { count, rows } = await employeeConfig.model.findAndCountAll(arg);

      // Commit the transaction if successful
      await commit(t);

      Logger.info("get all employees service ended...");

      return { count, rows };
    } catch (error) {
      // Rollback the transaction in case of an error
      await rollBack(t);
      Logger.error("Error in getAllEmployees service:", error);
      throw error;
    }
  }
}

module.exports = EmployeeService;
