'use strict';
const Model = require('../models/contactUs');
let instance;
/*********************************************
 * METHODS FOR HANDLING DATING PROFILE MODEL QUERIES
 *********************************************/
class ContactUs {
	constructor() {
		//if dating profile instance already exists then return
		if(instance) {
			return instance;
		}
		this.instance = this;
		this._contactController = Model;
	}
	create(contactObj) {
		let model = new this._contactController(contactObj);
		return model.save(contactObj);
	}
	getDetailsById(contact_id, projection) {
		if (projection) {
			return this._contactController.findOne({ _id: contact_id }, projection);
		}
		return this._contactController.findOne({ _id: contact_id });
	}
	getDetailsByQuery(query,projection = {}){
		
		return this._contactController.find(query, projection);
	}   
	updateDetailsById(contact_id, updatedObj) {
		return this._contactController.findByIdAndUpdate(contact_id, { $set : updatedObj });
	}
	updateByQuery(query, updatedObj, option) {
		return this._contactController.updateMany(query, { $set: updatedObj }, option);
	}
	deleteById(contact_id) {
		return this._contactController.findByIdAndRemove(contact_id);
	}
	deleteAll() {
		return this._contactController.deleteMany({});
	}

}
module.exports = new ContactUs();



