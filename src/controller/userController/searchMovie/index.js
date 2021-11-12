'use strict';
const logger = require('../../../services/logger');
const log = new logger('UserSearchMovieController').getChildLogger();
const dbService = require('../../../services/db/services');
const bcrypt = require('bcryptjs');
const jwtService = require('../../../services/jwt');
const responseHelper = require('../../../services/customResponse');
const searchDbHandler = dbService.SearchMovies;
const moviesDbHandler = dbService.Movies;
const config = require('../../../config/environments');


module.exports = {
    getMovieByNameSearch: async (req, res) => {
        let responseData = {};
        let user = req.user;
        let reqObj = req.body;
        try {
            let getmovieSearch = await moviesDbHandler.getMoviesDetailsByQuery({ movie_name: reqObj.movie_name });
            if(!getmovieSearch.length){
                responseData.msg= "No movie exists";
                return responseHelper.error(res, responseData);
            }
            responseData.msg = "Movie fetched successfully!!!";
            responseData.data = getmovieSearch;

            let movieSearch= {
                movie_name: reqObj.movie_name,
                movie_id: getmovieSearch[0]._id

            }
            let newSearchmovie = await searchDbHandler.createSearch(movieSearch);
            log.info('Movie Search created in the search history', newSearchmovie);
            responseData.msg = ' Movie Search created in the search history';
            return responseHelper.success(res, responseData);
        } catch (error) {
            log.error('failed to fetch movie searched with error::', error);
            responseData.msg = 'failed to fetch movie searched';
            return responseHelper.error(res, responseData);
        }
    },
    getAllMovieSearch: async (req, res) => {
        let responseData = {};
        let user = req.user;
        let id = user.sub;
        // let reqObj= req.body;
        try {
            let getAllmovieSearch = await searchDbHandler.getSearchDetailsByQuery({}).sort({ 'created_at': -1 });
            if(!getAllmovieSearch){
                responseData.msg= "No movie search exists";
                return responseHelper.error(res, responseData);
            }
            responseData.msg = "Recent Searches fetched successfully!!!";
            responseData.data = getAllmovieSearch;  
            return responseHelper.success(res, responseData);
        } catch (error) {
            log.error('failed to fetch recent searches with error::', error);
            responseData.msg = 'failed to fetch recent searches';
            return responseHelper.error(res, responseData);
        }
    },
    clearSearchHistory: async (req, res) => {
        let responseData = {};
        let user = req.user;
        let id = user.sub
        try {
            let getRecentSearch = await searchDbHandler.deleteAll({});
            responseData.msg = "Search history deleted successfully!!!";
            return responseHelper.success(res, responseData);
        } catch (error) {
            log.error('failed to delete search history with error::', error);
            responseData.msg = 'failed to delete search history.';
            return responseHelper.error(res, responseData);
        }
    },
}
