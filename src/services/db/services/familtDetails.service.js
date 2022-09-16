"use strict";
const userModel = require("../models/familyDetails");
let instance;
/*********************************************
 * METHODS FOR HANDLING USER MODEL QUERIES
 *********************************************/
class FamilyDetails {
    constructor() {
        //if user instance already exists then return
        if (instance) {
            return instance;
        }
        this.instance = this;
        this._Controller = userModel;
    }
    create(Obj) {
        let model = new this._Controller(Obj);
        return model.save(Obj);
    }
    getDetailsById(Id, projection) {
        if (projection) {
            return this._Controller.findOne({ _id: Id }, projection).populate('user_id');
        }
        return this._Controller.findOne({ _id: Id }).populate('user_id');
    }
    getDetailsByQuery(query, projection = {}) {
        return this._Controller.find(query, projection).populate('user_id');
    }
    updateDetailsById(Id, updatedObj) {
        return this._Controller.findByIdAndUpdate(Id, { $set: updatedObj });
    }
    updateByQuery(query, updatedObj, option) {
        return this._Controller.updateMany(query, { $set: updatedObj }, option);
    }
    deleteById(Id) {
        return this._Controller.findByIdAndRemove(Id);
    }
}
module.exports = new FamilyDetails();