'use strict';
const moviesModel = require('../models/movies');
let instance;
/*********************************************
 * METHODS FOR HANDLING MOVIES MODEL QUERIES
 *********************************************/
class Movies {
	constructor() {
		//if movies instance already exists then return
		if(instance) {
			return instance;
		}
		this.instance = this;
		this._moviesController = moviesModel;
	}
	createMovies(moviesObj) {
		let model = new this._moviesController(moviesObj);
		return model.save(moviesObj);
	}
	getMoviesDetailsById(movies_id, projection) {
		if (projection) {
			return this._moviesController.findOne({ _id: movies_id }, projection);
		}
		return this._moviesController.findOne({ _id: movies_id });
	}
	getMoviesDetailsByQuery(query,projection = {}){
		
		return this._moviesController.find(query, projection);
	}   
	updateMoviesDetailsById(movies_id, updatedObj) {
		return this._moviesController.findByIdAndUpdate(movies_id, { $set : updatedObj });
	}
	updateMoviesByQuery(query, updatedObj, option) {
		return this._moviesController.updateMany(query, { $set: updatedObj }, option);
	}
	deleteMoviesById(movies_id) {
		return this._moviesController.findByIdAndRemove(movies_id);
	}
	deleteAll() {
		return this._moviesController.deleteMany({});
	}

}
module.exports = new Movies();
