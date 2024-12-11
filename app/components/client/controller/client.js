const { HttpStatusCode } = require("axios");
const Logger = require("../../../utils/logger");
const ClientService = require("../service/client");
const { createUUID } = require("../../../utils/uuid");
const badRequest = require("../../../errors/badRequest");
const bcrypt = require("bcrypt");
const NotFoundError = require("../../../errors/notFoundError");
const { Payload } = require("../../../middleware/authService");
const { setXTotalCountHeader } = require("../../../utils/response");
class ClientController {
  constructor() {
    this.clientService = new ClientService();
  }

  async verifyToken(req, res, next) {
    try {
      Logger.info("verifyToken controller started");
      const { token } = req.body;
      console.log("TU@ : ", token);

      if (!token) {
        throw new NotFoundError("token not found");
      }

      let data = Payload.verifyToken(token);

      if (!data) {
        throw new Error("token verification failed");
      }

      res.status(HttpStatusCode.Ok).json(data);

      Logger.info("verifyToken controller ended...");
    } catch (error) {
      next(error);
    }
  }
  async createAdmin(req, res, next) {
    try {
      Logger.info("Create admin controller started...");
      const {
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
      } = req.body;
      let id = createUUID();
      const response = await this.clientService.createAdmin(
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
        true
      );

      Logger.info("Create admin controller ended...");
      res.status(HttpStatusCode.Created).json(response);
    } catch (error) {
      next(error);
    }
  }
  async createClient(req, res, next) {
    try {
      Logger.info("create client controller started...");
      const {
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
      } = req.body;
      const id = createUUID();
      const response = await this.clientService.createClient(
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
        false
      );

      Logger.info("create client service ended...");
      res.status(HttpStatusCode.Created).json(response);
    } catch (error) {
      next(error);
    }
  }

  async createClientForm(req, res, next) {
    try {
      Logger.info("create client FORM controller started...");
      const {
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
      } = req.body;
      const id = createUUID();
      let status = "submitted";

      const clientByUsername = await this.clientService.findClientByUsername(
        username
      );
      if (clientByUsername) {
        throw new error("username already exists");
      }
      const response = await this.clientService.createClientForm(
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
        false,
        status
      );

      Logger.info("create client FORM controller ended...");
      res.status(HttpStatusCode.Created).json(response);
    } catch (error) {
      next(error);
    }
  }

  async login(req, res, next) {
    try {
      Logger.info("Login controller started...");
      const { username, password } = req.body;
      if (typeof username != "string")
        throw new badRequest("invalid username type!");
      if (typeof password != "string")
        throw new badRequest("invalid password type");
      console.log("username", username);
      console.log("password", password);
      const client = await this.clientService.findClientByUsername(username);
      console.log(client.password);
      const hashedPassword = await bcrypt.hash(password, 10);
      console.log(hashedPassword);

      console.log("here : ", await bcrypt.compare(password, client.password));
      if (await bcrypt.compare(password, client.password)) {
        Logger.info("Generating token started...");
        let payload = Payload.newPayload(
          client.id,
          client.isAdmin,
          client.username
        );
        let token = payload.signPayload();
        console.log(token);
        Logger.info("Generating token ended...");
        res.cookie("auth", `Bearer ${token}`);
        res.set("auth", `Bearer ${token}`);
        res.status(200).send({ token: token, client: client });
      } else {
        res.status(403).json({
          message: "password incorrect",
        });
      }
      Logger.info("Login controller ended...");
    } catch (error) {
      next(error);
    }
  }

  async findClientByUsername(req, res, next) {
    try {
      Logger.info("Find client by username controller started...");
      const { username } = req.params;
      const client = await this.clientService.findClientByUsername(username);
      if (!client) throw new NotFoundError("Client not found...");

      Logger.info("Find client by username controller ended...");
      res.status(HttpStatusCode.Ok).json(response);
    } catch (error) {
      next(error);
    }
  }
  async findClientById(req, res, next) {
    try {
      Logger.info("Find client by client id controller started...");
      const { clientId } = req.params;
      const client = await this.clientService.findClientById(clientId);
      if (!client) throw new NotFoundError("Client not found...");

      Logger.info("Find client by client id controller ended...");
      res.status(HttpStatusCode.Ok).json(client);
    } catch (error) {
      next(error);
    }
  }

  async updateClientFormStatus(req, res, next) {
    try {
      Logger.info("Update client status controller started...");
      const { username } = req.params;
      const { status, adminNote } = req.body;
      const response = this.clientService.updateClientFormStatus(
        username,
        status,
        adminNote
      );

      Logger.info("Update client status controller ended...");
      res.status(HttpStatusCode.Ok).json(response);
    } catch (error) {
      next(error);
    }
  }

  async getClientForm(req, res, next) {
    try {
      Logger.info("Get client form controller started...");
      const { username } = req.params;
      const response = this.clientService.getClientForm(username);

      Logger.info("Get client form controller ended...");
      res.status(HttpStatusCode.Ok).json(response);
    } catch (error) {
      next(error);
    }
  }

  async getAllSubmittedClientForms(req, res, next) {
    try {
      Logger.info("Get all submitted client forms controller started...");
      const { count, rows } =
        await this.clientService.getAllSubmittedClientForms();
      setXTotalCountHeader(res, count);
      Logger.info("Get all submitted client forms controller ended...");
      res.status(HttpStatusCode.Ok).json(rows);
    } catch (error) {
      next(error);
    }
  }

  async getAllClients(req, res, next) {
    try {
      Logger.info("get all clients controller started...");
      const { count, rows } = await this.clientService.getAllClients(req.query);
      setXTotalCountHeader(res, count);

      Logger.info("get all clients controller ended...");
      res.status(HttpStatusCode.Ok).json({ totalCount: count, clients: rows });
    } catch (error) {
      next(error);
    }
  }

  async updateClientById(req, res, next) {
    try {
      Logger.info("Update client by id controller started...");
      const { clientId } = req.params;
      const { parameter, value } = req.body;
      if (typeof parameter != "string")
        throw new badRequest("invalid parameter type....");

      const response = await this.clientService.updateClientById(
        clientId,
        parameter,
        value
      );
      if (!response)
        throw new NotFoundError(
          "Client not found or client updation failed..."
        );
      Logger.info("Update client by id controller ended...");
      res.status(HttpStatusCode.Ok).json({
        message: `Client with id ${clientId} is updated successfully`,
      });
    } catch (error) {
      next(error);
    }
  }

  async deleteClientById(req, res, next) {
    try {
      Logger.info("delete client by id controller started...");
      const { clientId } = req.params;

      const response = await this.clientService.deleteClientById(clientId);
      if (!response)
        throw new NotFoundError("user not found or deletion failed...");

      Logger.info("delete client by id controller ended...");
      res
        .status(HttpStatusCode.Ok)
        .json({ message: `User with id ${clientId} is deleted successfully` });
    } catch (error) {
      next(error);
    }
  }
}

const clientController = new ClientController();

module.exports = clientController;
