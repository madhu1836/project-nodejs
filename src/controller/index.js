/***************************
 * ROUTE CONTROLLER METHODS
 ***************************/
/**
 * All User Controller
 */
const userAuthController = require('./userController/auth');
const userInfoController = require('./userController/users');
const userNewsCategoryController = require('./userController/newsCategory');
const userNewsController = require('./userController/news');
const userDatingController = require('./userController/datingProfile');
const userMoviesCategoryController = require('./userController/moviesCategory');
const userMoviesController = require('./userController/movies');
const UserSearchMovieController = require('./userController/searchMovie')

/**
 * All Admin Controller
 */
const adminAuthController = require('./adminController/auth');
const adminNewsController = require('./adminController/news');
const adminNewsCategoryController = require('./adminController/newsCategory');
const adminDatingController = require('./adminController/datingProfile');
const adminMoviesCategoryController = require('./adminController/moviesCategory');
const adminMovieController = require('./adminController/movies');

module.exports = {
    /**
     * All Admin Contollers
     */
    adminAuth: adminAuthController,
    adminNews: adminNewsController,
    adminNewsCategory: adminNewsCategoryController,
    adminDating: adminDatingController,
    adminMoviesCategory: adminMoviesCategoryController,
    adminMovies: adminMovieController,
    /**
     * All User Controllers
     */
    userAuth: userAuthController,
    userInfo: userInfoController,
    userNewsCategory: userNewsCategoryController,
    userNews: userNewsController,
    userDating: userDatingController,
    userMoviesCategory: userMoviesCategoryController,
    userMovies : userMoviesController,
    userSearchMovie: UserSearchMovieController,
};