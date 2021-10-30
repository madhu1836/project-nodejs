/***************************
 * ROUTE CONTROLLER METHODS
 ***************************/
/**
 * All User Controller
 */
const userAuthController = require('./userController/auth');
const userInfoController = require('./userController/users');
const userNewsCategoryController = require('./userController/newsCategory')
const userNewsController = require('./userController/news')

/**
 * All Admin Controller
 */
const adminAuthController = require('./adminController/auth');
const adminNewsController = require('./adminController/news');
const adminNewsCategoryController = require('./adminController/newsCategory')

module.exports = {
    /**
     * All Admin Contollers
     */
    adminAuth: adminAuthController,
    adminNews: adminNewsController,
    adminNewsCategory: adminNewsCategoryController,
    /**
     * All User Controllers
     */
    userAuth: userAuthController,
    userInfo: userInfoController,
    userNewsCategory: userNewsCategoryController,
    userNews: userNewsController,
};