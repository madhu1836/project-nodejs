/***************************
 * ROUTE CONTROLLER METHODS
 ***************************/
const userAuthController = require('./userController/auth');
const adminAuthController = require('./adminController/auth');
const userDriverController = require('./userController/driver');
const adminDriverController = require('./adminController/driver');
module.exports = {
	/**
	 * All Admin Contollers
	 */
	adminAuth: adminAuthController,
	adminDriver: adminDriverController,
	/**
	 * All User Controllers
	 */
	userAuth: userAuthController,
	userDriver: userDriverController,
};
