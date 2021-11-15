'use strict';
const newsModel = require('../models/news');
let instance;
/*********************************************
 * METHODS FOR HANDLING NEWS MODEL QUERIES
 *********************************************/
class News {
	constructor() {
		//if news instance already exists then return
		if(instance) {
			return instance;
		}
		this.instance = this;
		this._newsController = newsModel;
	}
	createNews(newsObj) {
		let model = new this._newsController(newsObj);
		return model.save(newsObj);
	}
	getNewsDetailsById(news_id, projection) {
		if (projection) {
			return this._newsController.findOne({ _id: news_id }, projection);
		}
		return this._newsController.findOne({ _id: news_id }).populate('newsCategory_id');
	}
	getNewsDetailsByQuery(query,projection = {}){
		
		return this._newsController.find(query, projection).populate('newsCategory_id');
	}   
	updateNewsDetailsById(news_id, updatedObj) {
		return this._newsController.findByIdAndUpdate(news_id, { $set : updatedObj });
	}
	updateNewsByQuery(query, updatedObj, option) {
		return this._newsController.updateMany(query, { $set: updatedObj }, option);
	}
	deleteNewsById(news_id) {
		return this._newsController.findByIdAndRemove(news_id);
	}
	deleteAll() {
		return this._newsController.deleteMany({});
	}

}
module.exports = new News();
