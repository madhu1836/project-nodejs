'use strict';
const searchMovieModel = require('../models/searchMovie');
let instance;
/*********************************************
 * METHODS FOR HANDLING WISHLIST MODEL QUERIES
 *********************************************/
class searchMovie {
	constructor() {
		//if Wishlist instance already exists then return
		if(instance) {
			return instance;
		}
		this.instance = this;
		this._searchController = searchMovieModel;
	}
	createSearch(searchObj) {
		let model = new this._searchController(searchObj);
		return model.save(searchObj);
	}
	getSearchDetailsById(search_id, projection) {
		if (projection) {
			return this._searchController.findOne({ _id: search_id }, projection);
		}
		return this._searchController.findOne({ _id: search_id }).populate('movie_id');
	}
	getSearchDetailsByQuery(query,projection = {}){
		
		return this._searchController.find(query, projection).populate('movie_id');
	}
	updateSearchDetailsById(search_id, updatedObj) {
		return this._searchController.findByIdAndUpdate(search_id, { $set : updatedObj });
	}
	updateSearchByQuery(query, updatedObj, option) {
		return this._searchController.updateMany(query, { $set: updatedObj }, option);
	}
	deleteSearchById(search_id) {
		return this._searchController.findByIdAndRemove(search_id);
	}
	deleteAll() {
		return this._searchController.deleteMany({});
	}

}
module.exports = new searchMovie();
