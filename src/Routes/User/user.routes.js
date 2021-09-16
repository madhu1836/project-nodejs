const Router = require('express').Router();
const userAuthController = require('../../controller').userAuth;
const userAuthenticated = require('../../services/middleware/userAuthenticate');
const verificationAuthenticated = require('../../services/middleware/verification');
const userValidationSchema = require('../../validation').authSchema;
const validationMiddleware = require('../../utils/validationMiddleware');
// const multerService = require('../../services/multer');
module.exports = () => {
    /***************************
     * START UNAUTHORIZED ROUTES
     ***************************/
    /*
     **Login and Signup Route
     */
    Router.post(
        '/user/login',
        validationMiddleware(userValidationSchema.login, 'body'),
        userAuthController.login
    );

    // Router.post('/driver/login', validationMiddleware(userValidationSchema.login, 'body'), userDriverController.driver_login);
    Router.post(
        '/user/signup',
        validationMiddleware(userValidationSchema.signup, 'body'),
        userAuthController.signup
    );
    Router.post(
        '/user/forgot/password',
        validationMiddleware(userValidationSchema.forgotPassword, 'body'),
        userAuthController.forgotPassword
    );
    Router.post(
        '/user/forgot/passwordMobile',
        validationMiddleware(userValidationSchema.forgotPasswordMobile, 'body'),
        userAuthController.forgotPasswordMobile
    );
    Router.post(
        '/user/reset/password', [
            verificationAuthenticated,
            validationMiddleware(userValidationSchema.resetPassword, 'body'),
        ],
        userAuthController.resetPassword
    );


    /**
     * Driver unautherised routes
     */
    //  Router.post('/save_driver',[multerService.uploadFile('file').single('resume'),validationMiddleware(driverValidationSchema.saveDriver, 'body')],userDriverController.save_driver);


    /**
     * Social Login
     */
    Router.post(
        '/auth/social/login',
        validationMiddleware(userValidationSchema.socialLogin, 'body'),
        userAuthController.socialLogin
    );
    /**
     * Email verification Route
     */
    Router.get(
        '/email/u/verification', [
            validationMiddleware(userValidationSchema.verifyEmail, 'query'),
            verificationAuthenticated,
        ],
        userAuthController.verifyEmail
    );

    Router.post(
        '/reg/email/u/verification',
        validationMiddleware(userValidationSchema.resendEmailVerification, 'body'),
        userAuthController.resendEmailVerification
    );

    /**
     * Mobile verification Route
     * */
    Router.post(
        '/reg/mobile/u/verification',
        validationMiddleware(userValidationSchema.verifyPhone, 'body'),
        userAuthController.mobileverify
    );

    Router.post(
        '/reg/mobile/u/verification-password',
        validationMiddleware(userValidationSchema.verifyPhone, 'body'),
        userAuthController.verifyOtpForPassword
    );

    /**
     * Mobile verification Route
     * */
    Router.post(
        '/resend/mobile/verification',
        userAuthController.resendOtp
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

    // Router.get('/driver-profile', userDriverController.get_driver);

    /**************************
     * END OF AUTHORIZED ROUTES
     **************************/
    return Router;
};