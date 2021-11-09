const Router = require("express").Router();
/**
 * Controllers
 */
const adminAuthController = require("../../controller").adminAuth;
const adminNewsController = require("../../controller").adminNews;
const adminNewsCategoryController =  require("../../controller").adminNewsCategory;
const adminDatingController = require("../../controller").adminDating;
const adminMoviesCategoryController = require("../../controller").adminMoviesCategory;

/**
 * Middlewares
 */
const adminAuthenticated = require("../../services/middleware/adminAuthenticate");
const adminValidationSchema = require("../../validation").adminSchema;
const newsValidationSchema = require("../../validation").newsSchema;
const adminDatingValidationSchema = require('../../validation').datingProfileSchema;
const newsCategoryValidationSchema = require("../../validation").newsCategorySchema;
const moviesCategoryValidationSchema = require("../../validation").moviesCategorySchema;
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
    Router.put("/update-admin", validationMiddleware(adminValidationSchema.update_admin, "body"), adminAuthController.updateAdmin);
    Router.post("/add-admin", validationMiddleware(adminValidationSchema.add_admin, "body"), adminAuthController.addAdmin);
    /**
     * Middlerware for Handling Request News Categories
     */
   
     Router.post("/add-newsCategory", validationMiddleware(newsCategoryValidationSchema.add_newsCategory, "body"),adminNewsCategoryController.Add_NewsCategory);
     Router.get("/get-newsCategory/:id", adminNewsCategoryController.getSingleNewsCategory);
     Router.get("/get-all-newsCategory", adminNewsCategoryController.getAllcategory);
     Router.put("/update-newsCategory/:id", validationMiddleware(newsCategoryValidationSchema.update_newsCategory, "body"),adminNewsCategoryController.updateNewsCategory);
     Router.delete("/delete-newsCategory/:id",adminNewsCategoryController.deleteNewsCategory);
    /**
     * Routes for Handling News Request
     */
    
    Router.post("/add-news", [multerService.uploadFile('file').single('news_image'), validationMiddleware(newsValidationSchema.add_news, "body")], adminNewsController.addNews);
    Router.get("/get-all-news", adminNewsController.getAllNews);
    Router.get("/get-news/:id", adminNewsController.getSingleNews);
    Router.patch("/update-news/:id", [multerService.uploadFile('file').single('news_image'), validationMiddleware(newsValidationSchema.update_news, "body")], adminNewsController.updateNews);
    Router.delete("/delete-news/:id", adminNewsController.deleteSingleNews);
    
    /**
     * Routes for handling dating profile requests
     */
     Router.post('/dating/createProfile/:id',[multerService.uploadFile('file').single('profile_image'), validationMiddleware(adminDatingValidationSchema.create_profile, 'body')], adminDatingController.createDatingProfile);
     Router.put('/dating/updateProfile/:id',[multerService.uploadFile('file').single('profile_image'), validationMiddleware(adminDatingValidationSchema.update_profile, 'body')], adminDatingController.updateDatingProfile);
     Router.get('/dating/get-all-profiles', adminDatingController.getAllProfiles);
     Router.get('/dating/get-profile/:id', adminDatingController.getSingleProfileById);
     Router.delete('/dating/delete-profile/:id', adminDatingController.deleteDatingProfile);  
     Router.get('/dating/get-profiles-by-gender', adminDatingController.getAllProfilesByGender);
     
     /**
     * Middlerware for Handling Request Movies Categories
     */
   
      Router.post("/add-moviesCategory", validationMiddleware(moviesCategoryValidationSchema.add_noviesCategory, "body"),adminMoviesCategoryController.Add_MoviesCategory);
    //   Router.get("/get-newsCategory/:id", adminNewsCategoryController.getSingleNewsCategory);
    //   Router.get("/get-all-newsCategory", adminNewsCategoryController.getAllcategory);
    //   Router.put("/update-newsCategory/:id", validationMiddleware(newsCategoryValidationSchema.update_newsCategory, "body"),adminNewsCategoryController.updateNewsCategory);
    //   Router.delete("/delete-newsCategory/:id",adminNewsCategoryController.deleteNewsCategory);
    /**************************
     * END OF AUTHORIZED ROUTES
     **************************/

    return Router;
};