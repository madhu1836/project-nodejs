/***************************
 * ROUTE CONTROLLER METHODS
 ***************************/
/**
 * All User Controller
 */
const userAuthController = require('./userController/auth');
const detailsController = require('./userController/details');

module.exports = {


    /**
     * All User Controllers
     */
    userAuth: userAuthController,
    userInfo: detailsController,

};