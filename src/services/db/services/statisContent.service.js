'use strict';
const Model = require('../models/staticContent');
let instance;
/*********************************************
 * METHODS FOR HANDLING DATING PROFILE MODEL QUERIES
 *********************************************/
class StaticsContent {
	constructor() {
		//if dating profile instance already exists then return
		if(instance) {
			return instance;
		}
		this.instance = this;
		this._Controller = Model;
	}
	create(Obj) {
		let model = new this._Controller(Obj);
		return model.save(Obj);
	}
	getById(content_id, projection) {
		if (projection) {
			return this._Controller.findOne({ _id: content_id }, projection);
		}
		return this._Controller.findOne({ _id: content_id });
	}
	getByQuery(query,projection = {}){
		
		return this._Controller.find(query, projection);
	}   
	updateById(content_id, updatedObj) {
		return this._Controller.findByIdAndUpdate(content_id, { $set : updatedObj });
	}
	updateByQuery(query, updatedObj, option) {
		return this._Controller.updateMany(query, { $set: updatedObj }, option);
	}
	deleteById(content_id) {
		return this._Controller.findByIdAndRemove(content_id);
	}
	deleteAll() {
		return this._Controller.deleteMany({});
	}

}
module.exports = new StaticsContent();



