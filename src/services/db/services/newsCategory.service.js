'use strict';
const newsCategoryModel = require('../models/newsCategory');
let instance;
/*********************************************
 * METHODS FOR HANDLING NEWS CATEGORY MODEL QUERIES
 *********************************************/
class NewsCategory {
	constructor() {
		//if news instance already exists then return
		if(instance) {
			return instance;
		}
		this.instance = this;
		this._newsCategoryController = newsCategoryModel;
	}
	createNewsCategory(newsCategoryObj) {
		let model = new this._newsCategoryController(newsCategoryObj);
		return model.save(newsCategoryObj);
	}
	getNewsCategoryDetailsById(newsCategory_id, projection) {
		if (projection) {
			return this._newsCategoryController.findOne({ _id: newsCategory_id }, projection);
		}
		return this._newsCategoryController.findOne({ _id: newsCategory_id });
	}
	getNewsCategoryDetailsByQuery(query,projection = {}){
		
		return this._newsCategoryController.find(query, projection);
	}   
	updateNewsCategoryDetailsById(newsCategory_id, updatedObj) {
		return this._newsCategoryController.findByIdAndUpdate(newsCategory_id, { $set : updatedObj });
	}
	updateNewsCategoryByQuery(query, updatedObj, option) {
		return this._newsCategoryController.updateMany(query, { $set: updatedObj }, option);
	}
	deleteNewsCategoryById(newsCategory_id) {
		return this._newsCategoryController.findByIdAndRemove(newsCategory_id);
	}
	deleteAll() {
		return this._newsCategoryController.deleteMany({});
	}

}
module.exports = new NewsCategory();
