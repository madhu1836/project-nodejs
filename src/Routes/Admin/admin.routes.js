const Router = require("express").Router();
/**
 * Controllers
 */
const adminAuthController = require("../../controller").adminAuth;
const adminDriverController = require("../../controller").adminDriver;

/**
 * Middlewares
 */
const adminAuthenticated = require("../../services/middleware/adminAuthenticate");
const adminValidationSchema = require("../../validation").adminSchema;
const driverValidationSchema = require("../../validation").driverSchema;
const validationMiddleware = require("../../utils/validationMiddleware");
const multerService = require('../../services/multer');

module.exports = () => {
  /**
   * Login Route
   */
  Router.post(
    "/login",
    validationMiddleware(adminValidationSchema.login, "body"),
    adminAuthController.login
  );
  /**********************
   * AUTHORIZED ROUTES
   **********************/
  /**
   * Middlerware for Handling Request Authorization
   */
  Router.use("/", adminAuthenticated);
  Router.get("/get-all-admin", adminAuthController.getAlladmin);
  Router.get("/get-admin/:id", adminAuthController.getSingleAdmin);
  Router.put("/update-admin/:id", validationMiddleware(adminValidationSchema.update_admin, "body"), adminAuthController.updateAdmin);
  Router.post("/add-admin", validationMiddleware(adminValidationSchema.add_admin, "body"), adminAuthController.addAdmin);


  /**
   * Routes For Driver
   */
  Router.post("/save_driver", [multerService.uploadFile('file').single('resume'), validationMiddleware(driverValidationSchema.saveDriverAdmin, 'body')], adminDriverController.save_driver);
  Router.get("/get-all-driver", adminDriverController.get_all_driver);
  Router.get("/get-single-driver/:id", adminDriverController.get_single_driver);
  Router.put("/update-driver/:id", [multerService.uploadFile('file').single('resume'), validationMiddleware(driverValidationSchema.updateDriverAdmin, 'body')], adminDriverController.update_driver);
  /**************************
   * END OF AUTHORIZED ROUTES
   **************************/

  return Router;
};
