const {
  verifyClient,
  verifyAdmin,
  verifyClientID,
} = require("../middleware/authService");
const upload = require("../middleware/multerConfig");
class RouteConfig {
  constructor() {}

  loadRouteConfig() {
    let config;

    try {
      config = require("./route.config.json");

      if (!config.routes || config.routes.length === 0) {
        throw new Error('"routes" not defined');
      }
    } catch (e) {
      throw new Error(`Unable to parse "lib/configs/route.config.json": ${e}`);
    }

    return config;
  }

  loadController(routeItem) {
    let controller;

    if (!routeItem || !routeItem.controller) {
      throw new Error(
        'Undefined "controller" property in "app/configs/route.config.json"'
      );
    }

    try {
      // eslint-disable-next-line import/no-dynamic-require
      controller = require(routeItem.controller);
      console.log("controller>>>>>", controller);
    } catch (e) {
      throw new Error(`Unable to load ${routeItem.controller}: ${e}`);
    }

    return controller;
  }

  getRoute(routeItem) {
    if (!routeItem || !routeItem.route || routeItem.route.length === 0) {
      throw new Error(
        'Undefined or empty "route" property in "lib/configs/route.config.json"'
      );
    }

    return routeItem.route;
  }

  getMethod(routeItem) {
    if (!routeItem || !routeItem.method || routeItem.method.length === 0) {
      throw new Error(
        'Undefined or empty "method" property in "lib/configs/route.config.json"'
      );
    }

    const method = routeItem.method.toLowerCase();

    switch (method) {
      case "get":
      case "put":
      case "post":
      case "delete":
      case "patch":
        return method;
      default:
        throw new Error(
          `Invalid REST "method" property in "lib/configs/route.config.json": ${method}`
        );
    }
  }

  getAction(routeItem) {
    if (!routeItem || !routeItem.action || routeItem.action.length === 0) {
      return this.getMethod(routeItem);
    }
    return routeItem.action;
  }

  getIsAdmin(routeItem) {
    if (routeItem.isAdmin === true) {
      return true;
    }
    return false;
  }

  getIsClient(routeItem) {
    if (routeItem.isClient === true) {
      return true;
    }
    return false;
  }

  getVerifyClientId(routeItem) {
    return routeItem.verifyClientId;
  }

  registerRoute(
    application,
    controller,
    route,
    method,
    action,

    isAdmin,
    isClient,
    verifyClientId
  ) {
    if (isAdmin === true) {
      application.route(route)[method]((req, res, next) => {
        verifyAdmin(req, res, next);
      });
    } else if (isClient === true) {
      application.route(route)[method]((req, res, next) => {
        verifyClient(req, res, next);
      });
    }

    if (verifyClientId) {
      application.route(route)[method]((req, res, next) => {
        verifyClientID(req, res, next);
      });
    }

    if (route === "/api/v1/csv-employee/upload/client/:clientId") {
      application.route(route)[method](
        upload.single("file"), // Multer middleware for file upload
        (req, res, next) => {
          controller[action](req, res, next);
        }
      );
    } else {
      application.route(route)[method]((req, res, next) => {
        controller[action](req, res, next);
      });
    }
  }

  createConfigRoute(application, settingsConfig) {
    application.route("/config").get((req, res) => {
      res.status(200).json(settingsConfig.settings);
    });
  }

  registerRoutes(application) {
    const config = this.loadRouteConfig();

    for (let i = 0, { length } = config.routes; i < length; i += 1) {
      const routeItem = config.routes[i];
      const controller = this.loadController(routeItem, application);
      const route = this.getRoute(routeItem);
      const method = this.getMethod(routeItem);
      const action = this.getAction(routeItem);

      const isAdmin = this.getIsAdmin(routeItem);
      const isClient = this.getIsClient(routeItem);
      const verifyClientId = this.getVerifyClientId(routeItem);

      this.registerRoute(
        application,
        controller,
        route,
        method,
        action,

        isAdmin,
        isClient,
        verifyClientId
      );
    }
  }
}

const routeConfig = new RouteConfig();
module.exports = routeConfig;
