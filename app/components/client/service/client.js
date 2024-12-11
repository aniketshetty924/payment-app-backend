const sendEmail = require("../../../utils/email");
const Logger = require("../../../utils/logger");
const { transaction, commit, rollBack } = require("../../../utils/transaction");
const bcrypt = require("bcrypt");
const { createUUID } = require("../../../utils/uuid");
const clientConfig = require("../../../model-config/client-config");
const formConfig = require("../../../model-config/form-config");
const NotFoundError = require("../../../errors/notFoundError");
const employeeConfig = require("../../../model-config/employee-config");
const dealerConfig = require("../../../model-config/dealer-config");
const {
  parseLimitAndOffset,
  parseFilterQueries,
  parseSelectFields,
} = require("../../../utils/request");

class ClientService {
  #associationMap = {
    employee: {
      model: employeeConfig.model,
      required: true,
    },
    dealer: {
      model: dealerConfig.model,
      require: true,
    },
  };
  #createAssociations(includeQuery) {
    const associations = [];

    if (!Array.isArray(includeQuery)) {
      includeQuery = [includeQuery];
    }
    if (includeQuery?.includes(clientConfig.association.employee)) {
      associations.push(this.#associationMap.employee);
    }
    if (includeQuery?.includes(clientConfig.association.dealer)) {
      associations.push(this.#associationMap.dealer);
    }

    return associations;
  }
  async createAdmin(
    id,
    clientName,
    founder,
    username,
    password,
    email,
    city,
    state,
    accountId,
    businessLicense,
    gstCertificate,
    isAdmin,
    t
  ) {
    if (!t) {
      t = await transaction();
    }
    try {
      Logger.info("Create admin service started...");
      const hashedPassword = await bcrypt.hash(password, 10);
      const response = await clientConfig.model.create(
        {
          id,
          clientName,
          founder,
          username,
          password: hashedPassword,
          email,
          city,
          state,
          accountId,
          businessLicense,
          gstCertificate,
          isAdmin,
        },
        { t }
      );
      await commit(t);
      Logger.info("Create admin service started...");
      return response;
    } catch (error) {
      await rollBack(t);
      Logger.error(error);
      throw error;
    }
  }
  async createClient(
    id,
    clientName,
    founder,
    username,
    password,
    email,
    city,
    state,
    accountId,
    businessLicense,
    gstCertificate,
    isAdmin,
    t
  ) {
    if (!t) {
      t = await transaction();
    }
    try {
      Logger.info("create client service started...");

      const response = await clientConfig.model.create(
        {
          id,
          clientName,
          founder,
          username,
          password,
          email,
          city,
          state,
          accountId,
          businessLicense,
          gstCertificate,
          isAdmin,
        },
        { t }
      );
      if (!response) throw new Error("client creation failed...");
      await commit(t);
      await sendEmail(
        email,
        "Registration successful",
        `Hi ${clientName}! Your registration has been successful. Your username is :- ${username} and password is :- ${password}`
      );

      Logger.info("create client service ended...");
      return true;
    } catch (error) {
      await rollBack(t);
      Logger.error(error);
      throw error;
    }
  }

  async createClientForm(
    id,
    clientName,
    founder,
    username,
    password,
    email,
    city,
    state,
    accountId,
    businessLicense,
    gstCertificate,
    isAdmin,
    status,
    t
  ) {
    if (!t) {
      t = await transaction();
    }
    try {
      Logger.info("create client form service started...");

      const existingClientForm = await clientConfig.model.findOne({
        where: { username: username },
        transaction: t,
      });
      if (existingClientForm) {
        if (existingClientForm.status === "rejected") {
          await formConfig.model.destroy({
            where: { id: existingClientForm.id },
            transaction: t,
          });
        }
      }
      const hashedPassword = await bcrypt.hash(password, 10);
      const response = await formConfig.model.create(
        {
          id,
          clientName,
          founder,
          username,
          password: hashedPassword,
          email,
          city,
          state,
          accountId,
          businessLicense,
          gstCertificate,
          isAdmin,
          status,
        },
        { t }
      );
      await commit(t);
      await sendEmail(
        email,
        "Registration Form submitted",
        `Hi ${clientName}! Your registration form has been submitted , admin will check the information and documents and approve the registration soon.`
      );
      Logger.info("create client form service ended...");
      return response;
    } catch (error) {
      await rollBack(t);
      Logger.error(error);
      throw error;
    }
  }

  async findClientByUsername(username, t) {
    if (!t) {
      t = await transaction();
    }
    try {
      Logger.info("Find Client by username service started...");
      const client = await clientConfig.model.findOne(
        {
          where: { username },
        },
        { t }
      );
      await commit(t);
      Logger.info("Find Client by username service ended...");
      return client;
    } catch (error) {
      await rollBack(t);
      Logger.error(error);
    }
  }
  async findClientById(clientId, t) {
    if (!t) {
      t = await transaction();
    }
    try {
      Logger.info("Find Client by client id  service started...");
      const client = await clientConfig.model.findOne(
        {
          where: { id: clientId },
        },
        { t }
      );
      await commit(t);
      Logger.info("Find Client by client id service ended...");
      return client;
    } catch (error) {
      await rollBack(t);
      Logger.error(error);
    }
  }

  async updateClientFormStatus(username, status, adminNote, t) {
    if (!t) {
      t = await transaction();
    }
    try {
      Logger.info("Update client status service started...");
      const form = await formConfig.model.findOne({
        where: { username: username },
        transaction: t,
      });
      if (!form)
        throw new NotFoundError(`Form with username ${username} not found!`);
      if (status === "rejected" && (!adminNote || adminNote.trim() === "")) {
        throw new InvalidError("Rejection requires an admin note");
      }

      form.status = status;
      form.adminNote = status === "approved" ? "" : adminNote;

      await form.save({ transaction: t });

      await commit(t);
      if (status === "approved") {
        await sendEmail(
          form.email,
          "Registration Form Approved",
          `Hi ${form.clientName}! Your registration form has been approved. 
          You can login in our system and check!`
        );
      } else if (status === "rejected") {
        await sendEmail(
          form.email,
          "Registration Form Rejected",
          `Hi ${form.clientName}! Your registration form has been rejected. 
          Reason for rejection is - ${adminNote}.
          Fix the issue and sumbit your registration form again.`
        );
      }

      Logger.info("Update client form status service ended...");
      return form;
    } catch (error) {
      await rollBack(t);
      Logger.error(error);
      throw error;
    }
  }
  async getClientForm(username, t) {
    if (!t) {
      t = await transaction();
    }
    try {
      Logger.info("Get client form service started...");
      const response = await formConfig.model.findOne({
        where: {
          username: username,
        },
        transaction: t,
      });
      if (!response) throw new NotFoundError("Client form not found...");
      await commit(t);
      Logger.info("Get client form service ended...");
      return response;
    } catch (error) {
      await rollBack(t);
      Logger.error(error);
      throw error;
    }
  }

  async getAllSubmittedClientForms(t) {
    if (!t) {
      t = await transaction();
    }
    try {
      Logger.info("Get all submitted client forms service started...");
      const { count, rows } = await formConfig.model.findAndCountAll({
        where: {
          status: "submitted",
        },
        transaction: t,
      });

      await commit(t);
      Logger.info("Get all submitted client forms service ended...");
      return { count, rows };
    } catch (error) {
      await rollBack(t);
      Logger.error(error);
      throw error;
    }
  }

  async getAllClients(query, t) {
    if (!t) {
      t = await transaction();
    }
    try {
      Logger.info("Get all clients service started...");
      let selectArray = parseSelectFields(query, clientConfig.fieldMapping);
      if (!selectArray) {
        selectArray = Object.values(clientConfig.fieldMapping);
      }

      const includeQuery = query.include || [];
      let association = [];
      if (includeQuery) {
        association = this.#createAssociations(includeQuery);
      }

      const arg = {
        attributes: selectArray,
        ...parseLimitAndOffset(query),
        transaction: t,
        where: {
          isAdmin: false,
        },
        ...parseFilterQueries(query, clientConfig.filters),
        include: association,
      };

      const { count, rows } = await clientConfig.model.findAndCountAll(arg);
      await commit(t);
      Logger.info("Get all clients service ended...");
      return { count, rows };
    } catch (error) {
      await rollBack(t);
      Logger.error(error);
      throw error;
    }
  }

  async updateClientById(clientId, parameter, value, t) {
    if (!t) {
      t = await transaction();
    }
    try {
      Logger.info("Update client by id service started...");
      const client = await clientConfig.model.findByPk(clientId, {
        transaction: t,
      });
      if (!client)
        throw new NotFoundError(
          `Client with id ${clientId} does not exists...`
        );
      console.log("parameter ", parameter);
      console.log("value : ", value);
      client[parameter] = value;
      await client.save({ transaction: t });
      commit(t);
      const mail = `Hi ${client.username}, Your PayFlow account has been successfully updated.`;
      await sendEmail(client.email, "Client Details Update Notification", mail);

      Logger.info("Update client by id service ended...");
      return client;
    } catch (error) {
      await rollBack(t);
      Logger.error(error);
      throw error;
    }
  }

  async deleteClientById(clientId, t) {
    if (!t) {
      t = await transaction();
    }
    try {
      Logger.info("Delete client by id service started...");
      const client = await clientConfig.model.findByPk(clientId, {
        transaction: t,
      });
      if (!client)
        throw new NotFoundError(
          `Client with id ${clientId} does not exists...`
        );

      const username = client.username;
      const email = client.email;
      const rowsDeleted = await clientConfig.model.destroy({
        where: { id: clientId },
        transaction: t,
      });
      if (rowsDeleted === 0)
        throw new NotFoundError(
          `Client with id ${clientId} does not exists...`
        );
      await commit(t);
      const mail = `Hi ${username}! your User account with username ${username} has been deleted successfully!`;
      await sendEmail(email, "Client Delete Notification", mail);
      Logger.info("Delete client by id service ended...");
      return rowsDeleted;
    } catch (error) {
      await rollBack(t);
      Logger.error(error);
    }
  }
}
module.exports = ClientService;
