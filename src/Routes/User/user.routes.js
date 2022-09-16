const Router = require('express').Router();
/**
 * All Controllers
 */
const userAuthController = require('../../controller').userAuth;
const userInfoController = require('../../controller').userInfo;



/**
 * All Middlewares
 */
const userAuthenticated = require('../../services/middleware/userAuthenticate');
const verificationAuthenticated = require('../../services/middleware/verification');
const validationMiddleware = require('../../utils/validationMiddleware');
const multerService = require('../../services/multer');

/**
 * Validation
 */
const userValidationSchema = require('../../validation').authSchema;

module.exports = () => {
  /***************************
   * START UNAUTHORIZED ROUTES
   ***************************/
  /*
   *Login Route
   **/
  Router.post(
    '/user/login',
    validationMiddleware(userValidationSchema.login, 'body'),
    userAuthController.login
  );

  /**
   * SignUp Route
   **/
  Router.post(
    '/user/signup',
    validationMiddleware(userValidationSchema.signup, 'body'),
    userAuthController.signup
  );



  /****************************
   * END OF UNAUTHORIZED ROUTES
   ****************************/

  /**********************
   * AUTHORIZED ROUTES
   **********************/
  /**
   * Middlerware for Handling Request Authorization
   */

  Router.use('/', userAuthenticated);

  Router.put('/update-profile', userAuthController.updateProfile);
  Router.get('/get-profile/:id', userAuthController.getProfileById);



  /***Family Routes */
  Router.post('/create-details', userInfoController.createDetails);
  Router.put('/update-details/:id', userInfoController.updateDetails);
  Router.get('/get-details/:id', userInfoController.getDetailsId);
  Router.delete('/delete-Details/:id', userInfoController.deleteDetails);


  /**************************
   * END OF AUTHORIZED ROUTES
   **************************/
  return Router;
};