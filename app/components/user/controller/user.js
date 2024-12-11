const UserService = require("../service/user");
const { HttpStatusCode } = require("axios");
const { createUUID, validateUUID } = require("../../../utils/uuid.js");
const { setXTotalCountHeader } = require("../../../utils/response.js");
const Logger = require("../../../utils/logger.js");
const badRequest = require("../../../errors/badRequest.js");
const bcrypt = require("bcrypt");

const { Payload } = require("../../../middleware/authService.js");
const NotFoundError = require("../../../errors/notFoundError.js");
class UserController {
  constructor() {
    this.userService = new UserService();
  }

  async createUser(req, res, next) {
    try {
      Logger.info("Create user controller started...");

      const { name, username, email } = req.body;

      let id = createUUID();

      let response = await this.userService.createUser(
        id,
        name,
        username,
        email
      );
      Logger.info("Create user controller ended...");
      res.status(HttpStatusCode.Created).json(response);
    } catch (error) {
      next(error);
    }
  }

  async getAllUsers(req, res, next) {
    try {
      Logger.info("getAll users controller called...");
      const { count, rows } = await this.userService.getAllUsers(req.query);
      setXTotalCountHeader(res, count);
      res.status(HttpStatusCode.Ok).json({ totalCount: count, users: rows });
    } catch (error) {
      next(error);
    }
  }

  async getUserById(req, res, next) {
    try {
      Logger.info("get user by id controller called...");
      const { userId } = req.params;
      if (!validateUUID(userId)) {
        throw new Error("invalid user id...");
      }

      const response = await this.userService.getUserById(userId, req.query);
      Logger.info("get user by id controller ended...");
      res.status(HttpStatusCode.Ok).json(response);
    } catch (error) {
      next(error);
    }
  }

  async getUserByUsername(req, res, next) {
    try {
      Logger.info("Get user by username controller started...");
      const { username } = req.params;
      if (typeof username != "string")
        throw new badRequest("Invalid username type!");
      const response = await this.userService.getUserByUsername(
        username,
        req.query
      );
      Logger.info("Get user by username controller ended...");
      res.status(HttpStatusCode.Ok).json(response);
    } catch (error) {
      next(error);
    }
  }
}

const userController = new UserController();
module.exports = userController;
