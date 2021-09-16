/***************************
 * ROUTE CONTROLLER METHODS
 ***************************/
const userAuthController = require('./userController/auth');
const adminAuthController = require('./adminController/auth');
module.exports = {
    /**
     * All Admin Contollers
     */
    adminAuth: adminAuthController,
    /**
     * All User Controllers
     */
    userAuth: userAuthController,
};