'use strict';
const moviesCategoryModel = require('../models/moviesCategory');
let instance;
/*********************************************
 * METHODS FOR HANDLING MOVIES CATEGORY MODEL QUERIES
 *********************************************/
class MoviesCategory {
	constructor() {
		//if movies instance already exists then return
		if(instance) {
			return instance;
		}
		this.instance = this;
		this._moviesCategoryController = moviesCategoryModel;
	}
	createMoviesCategory(moviesCategoryObj) {
		let model = new this._moviesCategoryController(moviesCategoryObj);
		return model.save(moviesCategoryObj);
	}
	getMoviesCategoryDetailsById(moviesCategory_id, projection) {
		if (projection) {
			return this._moviesCategoryController.findOne({ _id: moviesCategory_id }, projection);
		}
		return this._moviesCategoryController.findOne({ _id: moviesCategory_id });
	}
	getMoviesCategoryDetailsByQuery(query,projection = {}){
		
		return this._moviesCategoryController.find(query, projection);
	}   
	updateMoviesCategoryDetailsById(moviesCategory_id, updatedObj) {
		return this._moviesCategoryController.findByIdAndUpdate(moviesCategory_id, { $set : updatedObj });
	}
	updateMoviesCategoryByQuery(query, updatedObj, option) {
		return this._moviesCategoryController.updateMany(query, { $set: updatedObj }, option);
	}
	deleteMoviesCategoryById(moviesCategory_id) {
		return this._moviesCategoryController.findByIdAndRemove(moviesCategory_id);
	}
	deleteAll() {
		return this._moviesCategoryController.deleteMany({});
	}

}
module.exports = new MoviesCategory();
