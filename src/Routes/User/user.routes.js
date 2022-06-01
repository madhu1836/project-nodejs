const Router = require('express').Router();
/**
 * All Controllers
 */
const userAuthController = require('../../controller').userAuth;
const userInfoController = require('../../controller').userInfo;
const userDatingController = require('../../controller').userDating;
const contactUsController = require('../../controller').contactUs;
const staticContentController = require('../../controller').staticContent;
const friendsListController = require('../../controller').friendsList;
const userNewsCategoryController = require('../../controller').userNewsCategory;
const userNewsController = require('../../controller').userNews;
const userMoviesCategoryController = require('../../controller').userMoviesCategory;
const userMoviesController = require('../../controller').userMovies;
const userSearchMovieController = require('../../controller').userSearchMovie;


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
const userInfoValidationSchema = require('../../validation').userInfoSchema;
const userDatingValidationSchema = require('../../validation').datingProfileSchema;
const contactUsValidationSchema = require('../../validation').contactUsSchema;
const friendsListValidationSchema = require('../../validation').friendsList;
const userSearchMovieValidationSchema = require('../../validation').searchMovieSchema;

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
    
    /**
     * Verify OTP For SignUp
     **/
      Router.post(
        "/verify-otp-for-signup",
        validationMiddleware(userValidationSchema.verifyOtp, "body"),
        userAuthController.verifyOtpForSignUp
      );

    /**
     * Forgot Password
     **/
      Router.post(
        '/user/forgot-password',
        validationMiddleware(userValidationSchema.forgotPassworEmail, 'body'),
        userAuthController.forgotPassword
    );

    /**
     * Verify OTP
     **/
      Router.post(
        "/verify-otp-forgot-password",
        validationMiddleware(userValidationSchema.verifyOtp, "body"),
        userAuthController.verifyOtpForPassword
      );

    /**
     * Reset Password
     **/
      Router.post(
        "/user/reset/password",
        [
          verificationAuthenticated,
          validationMiddleware(userValidationSchema.resetPassword, "body"),
        ],
        userAuthController.resetPassword
      );

    /**
     * Verification Router
     **/
      Router.get(
        '/email/u/verification', [
            validationMiddleware(userValidationSchema.verifyEmail, 'query'),
            verificationAuthenticated,
        ],
        userAuthController.verifyEmail
    );

    /***
     * Social Login
    ***/
     Router.post(
      '/user/social/login',
      validationMiddleware(userValidationSchema.socialLogin, 'body'),
      userAuthController.socialLogin
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
    
    /** 
    Routes To Handle ContactUs
     **/
    Router.post('/contact-us',validationMiddleware(contactUsValidationSchema.create, 'body'), contactUsController.create);

    /**
     * Routes for handling user profile
     */
    Router.get('/user/profile', userInfoController.profile);
    Router.put('/user/update_profile', [multerService.uploadFile('file').single('profile_picture'), validationMiddleware(userInfoValidationSchema.updateProfile, 'body')], userInfoController.updateProfile);

    /**
    * Routes for handling Dating profile 
    */
    // Router.post('/user/dating/createProfile',[multerService.uploadFile('file').fields([{name:'pictures',max:2}]), validationMiddleware(userDatingValidationSchema.create_profile, 'body')], userDatingController.createDatingProfile);
    Router.put('/user/dating/updateProfile',[multerService.uploadFile('file').fields([{name:'pictures',max:2}]), validationMiddleware(userDatingValidationSchema.update_profile, 'body')], userDatingController.updateDatingProfile);
    Router.post('/user/dating/get-all-profiles-by-filter', userDatingController.getAllProfiles);
    Router.get('/user/get-all-dating-profiles', userDatingController.getAllDatingProfiles);
    Router.get('/user/dating/get-profile/:id', userDatingController.getSingleProfileById);
    Router.delete('/user/dating/delete-profile/:id', userDatingController.deleteDatingProfile);
    
    /**
     * Routes To Handle Static Content
     */
     Router.get('/user/get-all-static-content', staticContentController.getAll);
     Router.get('/user/get-static-content/:id', staticContentController.getSingle);

    /**
     * Routes To Handle Friend List
     */
    Router.post('/user/add-to-friends-list', validationMiddleware(friendsListValidationSchema.add), friendsListController.add);
    Router.post('/user/rejected-profile',friendsListController.rejectProfile);
    Router.get('/user/get-all-friends-list',friendsListController.getAll);
    Router.get('/user/get-notification',friendsListController.getNotificationRequest);
    Router.get('/user/get-friends-list/:id', friendsListController.getById);
    Router.delete('/user/delete-friend-list/:id', friendsListController.delete);

    // /**
    // * Routes for handling user news category requests
    // */
    // Router.get('/user/get-newsCategory/:id', userNewsCategoryController.getSingleNewsCategory);
    // Router.get('/user/get-all-newsCategory', userNewsCategoryController.getAllNewsCategory);

    // /**
    //  * Routes for handling user news requests
    //  */
    // Router.get('/user/get-news/:id', userNewsController.getSingleNews);
    // Router.get('/user/get-all-news-by-category/:newsCategory_id', userNewsController.getAllNewsByCategory);
    // Router.get('/user/get-all-news', userNewsController.getAllNews);
    // /**
    //  * Middlerware for Handling Request Movies Categories
    // */
    //   Router.get("/user/get-moviesCategory/:id", userMoviesCategoryController.getSingleMovieCategory);
    //   Router.get("/user/get-all-moviesCategory", userMoviesCategoryController.getAllcategories);

    // /**
    //  * Routes for Handling Movies Request
    // */
    // Router.get("/user/get-all-movies", userMoviesController.getAllMovies);
    // Router.get("/user/get-movie/:id", userMoviesController.getSingleMovie);
    // Router.get("/user/get-movies-by/:category_id", userMoviesController.getMoviesByCategoryId);
    
    /**
     * Routes for handle change password
     */
    Router.put('/user/change_password', validationMiddleware(userInfoValidationSchema.changePassword, 'body'), userInfoController.changePassword);
    
    // /**
    //  * Routes for handling user search requests
    //  */
    //  Router.post("/user/searchMovie",validationMiddleware(userSearchMovieValidationSchema.search_movie, "body"), userSearchMovieController.getMovieByNameSearch);
    //  Router.get("/user/recent-searchMovies", userSearchMovieController.getAllMovieSearch);
    //  Router.delete("/user/clear-search", userSearchMovieController.clearSearchHistory);
    /**************************
     * END OF AUTHORIZED ROUTES
     **************************/
    return Router;
};