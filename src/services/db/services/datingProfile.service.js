'use strict';
const profileModel = require('../models/datingProfile');
let instance;
/*********************************************
 * METHODS FOR HANDLING DATING PROFILE MODEL QUERIES
 *********************************************/
class Profile {
	constructor() {
		//if dating profile instance already exists then return
		if(instance) {
			return instance;
		}
		this.instance = this;
		this._profileController = profileModel;
	}
	createProfile(profileObj) {
		let model = new this._profileController(profileObj);
		return model.save(profileObj);
	}
	getProfileDetailsById(profile_id, projection) {
		if (projection) {
			return this._profileController.findOne({ _id: profile_id }, projection);
		}
		return this._profileController.findOne({ _id: profile_id });
	}
	getProfileDetailsByQuery(query,projection = {}){
		
		return this._profileController.find(query, projection);
	}   
	updateProfileDetailsById(profile_id, updatedObj) {
		return this._profileController.findByIdAndUpdate(profile_id, { $set : updatedObj });
	}
	updateProfileByQuery(query, updatedObj, option) {
		return this._profileController.updateMany(query, { $set: updatedObj }, option);
	}
	deleteProfileById(profile_id) {
		return this._profileController.findByIdAndRemove(profile_id);
	}
	deleteAll() {
		return this._profileController.deleteMany({});
	}

}
module.exports = new Profile();
