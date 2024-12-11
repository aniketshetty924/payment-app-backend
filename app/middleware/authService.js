const jwt = require("jsonwebtoken");
const Logger = require("../utils/logger");
const UnAuthorizedError = require("../errors/unauthorizedError");
const secreteKey = "bankPay@123";
const verifyAdmin = (req, res, next) => {
  try {
    Logger.info("[Auth Service ] :- Verifying admin started...");
    if (!req.cookies["auth"] && !req.headers["auth"]) {
      throw new UnAuthorizedError("Cookie Not Found...");
    }

    let token = req.cookies["auth"].split(" ")[1];
    let payload = Payload.verifyToken(token);
    if (!payload.isAdmin) throw new UnAuthorizedError("Unauthorized access...");
    Logger.info("[Auth Service ] :- Verifying admin ended...");
    Logger.info("next called...");
    next();
  } catch (error) {
    next(error);
  }
};

const verifyClient = (req, res, next) => {
  try {
    Logger.info("[Auth Service ] :- Verifying Client started...");
    if (!req.cookies["auth"] && !req.headers["auth"]) {
      throw new UnAuthorizedError("Cookie not found...");
    }
    let token = req.cookies["auth"].split(" ")[1];
    let payload = Payload.verifyToken(token);
    if (payload.isAdmin)
      throw new UnAuthorizedError(
        "Admin can't do this operations , only users can do..."
      );

    req.clientId = payload.id;

    Logger.info("[Auth Service ] :- Verifying Client ended...");
    Logger.info("next called...");
    next();
  } catch (error) {
    next(error);
  }
};

const verifyClientID = (req, res, next) => {
  try {
    Logger.info("[Auth Service ] :- Verifying Client ID started...");
    const { clientId } = req.params;
    const id = req.clientId;
    console.log("Client ID", clientId);
    console.log("id : ", id);
    if (clientId != id) {
      throw new UnAuthorizedError(
        "You are not authorized to access this account..."
      );
    }
    Logger.info("[Auth Service ] :- Verifying Client ID ended...");
    Logger.info("next called...");
    next();
  } catch (error) {
    next(error);
  }
};

class Payload {
  constructor(id, isAdmin, username) {
    this.id = id;
    this.isAdmin = isAdmin;
    this.username = username;
  }

  static newPayload(id, isAdmin, username) {
    try {
      return new Payload(id, isAdmin, username);
    } catch (error) {
      throw error;
    }
  }

  static verifyToken(token) {
    let payload = jwt.verify(token, secreteKey);
    return payload;
  }

  signPayload() {
    try {
      return `Bearer ${jwt.sign(
        {
          id: this.id,
          isAdmin: this.isAdmin,
          username: this.username,
        },
        secreteKey,
        { expiresIn: "10hr" }
      )}`;
    } catch (error) {
      console.log(error);
    }
  }
}

module.exports = { Payload, verifyAdmin, verifyClient, verifyClientID };
