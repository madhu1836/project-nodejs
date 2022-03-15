const Router = require('express').Router();
/**
 * All Controllers
 */
const userAuthController = require('../../controller').userAuth;
const userInfoController = require('../../controller').userInfo;
const userNewsCategoryController = require('../../controller').userNewsCategory;
const userNewsController = require('../../controller').userNews;
const userDatingController = require('../../controller').userDating;
const userMoviesCategoryController = require('../../controller').userMoviesCategory;
const userMoviesController = require('../../controller').userMovies;
const userSearchMovieController = require('../../controller').userSearchMovie;
/**
 * All Middlewares
 */
const userAuthenticated = require('../../services/middleware/userAuthenticate');
const verificationAuthenticated = require('../../services/middleware/verification');
const userValidationSchema = require('../../validation').authSchema;
const userInfoValidationSchema = require('../../validation').userInfoSchema;
const userDatingValidationSchema = require('../../validation').datingProfileSchema;
const userSearchMovieValidationSchema = require('../../validation').searchMovieSchema;
const validationMiddleware = require('../../utils/validationMiddleware');
const multerService = require('../../services/multer');
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

    Router.post(
        '/user/signup',
        validationMiddleware(userValidationSchema.signup, 'body'),
        userAuthController.signup
    );
    Router.post(
        "/verify-otp-for-signup",
        validationMiddleware(userValidationSchema.verifyOtp, "body"),
        userAuthController.verifyOtpForSignUp
      );
    Router.post(
        '/user/forgot-password',
        validationMiddleware(userValidationSchema.forgotPassworEmail, 'body'),
        userAuthController.forgotPassword
    );
    /**
     * Verify OTP
     */
     Router.post(
        "/verify-otp-forgot-password",
        validationMiddleware(userValidationSchema.verifyOtp, "body"),
        userAuthController.verifyOtpForPassword
      );
    Router.post(
        "/user/reset/password",
        [
          verificationAuthenticated,
          validationMiddleware(userValidationSchema.resetPassword, "body"),
        ],
        userAuthController.resetPassword
      );
    Router.get(
        '/email/u/verification', [
            validationMiddleware(userValidationSchema.verifyEmail, 'query'),
            verificationAuthenticated,
        ],
        userAuthController.verifyEmail
    );

    // Router.post(
    //     '/user/forgot/passwordMobile',
    //     validationMiddleware(userValidationSchema.forgotPasswordMobile, 'body'),
    //     userAuthController.forgotPasswordMobile
    // );

    /**
     * Driver unautherised routes
     */
    
    //  Router.post('/save_driver',[multerService.uploadFile('file').single('resume'),validationMiddleware(driverValidationSchema.saveDriver, 'body')],userDriverController.save_driver);
    /**
     * Social Login
     */
    // Router.post(
    //     '/user/social/login',
    //     validationMiddleware(userValidationSchema.socialLogin, 'body'),
    //     userAuthController.socialLogin
    // );
    /**
     * Email verification Route
     */
    // Router.get(
    //     '/email/u/verification', [
    //         validationMiddleware(userValidationSchema.verifyEmail, 'query'),
    //         verificationAuthenticated,
    //     ],
    //     userAuthController.verifyEmail
    // );

    // Router.post(
    //     '/reg/email/u/verification',
    //     validationMiddleware(userValidationSchema.resendEmailVerification, 'body'),
    //     userAuthController.resendEmailVerification
    // );

    /**
     * Mobile verification Route
     * */
    // Router.post(
    //     '/reg/mobile/u/verification',
    //     validationMiddleware(userValidationSchema.verifyPhone, 'body'),
    //     userAuthController.mobileverify
    // );

    // Router.post(
    //     '/reg/mobile/u/verification-password',
    //     validationMiddleware(userValidationSchema.verifyPhone, 'body'),
    //     userAuthController.verifyOtpForPassword
    // );

    /**
     * Mobile verification Route
     * */
    // Router.post(
    //     '/resend/mobile/verification',
    //     userAuthController.resendOtp
    // );

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

    /**
     * Routes for handling user profile
     */
    Router.get('/user/profile', userInfoController.profile);
    Router.put('/user/update_profile', [multerService.uploadFile('file').single('profile_picture'), validationMiddleware(userInfoValidationSchema.updateProfile, 'body')], userInfoController.updateProfile);
    /**
    * Routes for handling user news category requests
    */
    Router.get('/user/get-newsCategory/:id', userNewsCategoryController.getSingleNewsCategory);
    Router.get('/user/get-all-newsCategory', userNewsCategoryController.getAllNewsCategory);
    /**
     * Routes for handling user news requests
     */

    Router.get('/user/get-news/:id', userNewsController.getSingleNews);
    Router.get('/user/get-all-news-by-category/:newsCategory_id', userNewsController.getAllNewsByCategory);
    Router.get('/user/get-all-news', userNewsController.getAllNews);
    /**
     * Routes for handling dating profile requests
     */
    Router.post('/user/dating/createProfile',[multerService.uploadFile('file').single('profile_image'), validationMiddleware(userDatingValidationSchema.create_profile, 'body')], userDatingController.createDatingProfile);
    Router.put('/user/dating/updateProfile',[multerService.uploadFile('file').single('profile_image'), validationMiddleware(userDatingValidationSchema.update_profile, 'body')], userDatingController.updateDatingProfile);
    Router.post('/user/dating/get-all-profiles', userDatingController.getAllProfiles);
    Router.get('/user/dating/get-profile/:id', userDatingController.getSingleProfileById);
    Router.delete('/user/dating/delete-profile/:id', userDatingController.deleteDatingProfile);    
     /**
     * Middlerware for Handling Request Movies Categories
     */
   
      Router.get("/user/get-moviesCategory/:id", userMoviesCategoryController.getSingleMovieCategory);
      Router.get("/user/get-all-moviesCategory", userMoviesCategoryController.getAllcategories);
      /**
     * Routes for Handling Movies Request
     */
    
    Router.get("/user/get-all-movies", userMoviesController.getAllMovies);
    Router.get("/user/get-movie/:id", userMoviesController.getSingleMovie);
    Router.get("/user/get-movies-by/:category_id", userMoviesController.getMoviesByCategoryId);
    
    /**
     * Routes for handle change password
     */
    Router.put('/user/change_password', validationMiddleware(userInfoValidationSchema.changePassword, 'body'), userInfoController.changePassword);
    
    /**
     * Routes for handling user search requests
     */
     Router.post("/user/searchMovie",validationMiddleware(userSearchMovieValidationSchema.search_movie, "body"), userSearchMovieController.getMovieByNameSearch);
     Router.get("/user/recent-searchMovies", userSearchMovieController.getAllMovieSearch);
     Router.delete("/user/clear-search", userSearchMovieController.clearSearchHistory);
    /**************************
     * END OF AUTHORIZED ROUTES
     **************************/
    return Router;
};