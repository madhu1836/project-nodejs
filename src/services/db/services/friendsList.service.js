"use strict";
const Model = require("../models/friendsList");
let instance;
/*********************************************
 * METHODS FOR HANDLING Matching MODEL QUERIES
 *********************************************/
class User {
    constructor() {
        //if user instance already exists then return
        if (instance) {
            return instance;
        }
        this.instance = this;
        this._Controller = Model;
    }
    create(userObj) {
        let model = new this._Controller(userObj);
        return model.save(userObj);
    }
    get() {
        return this._Controller.find({ featured: true });
    }
    getById(userId, projection) {
        if (projection) {
            return this._Controller.findOne({ _id: userId }, projection).populate("user_id");
        }
        return this._Controller.findOne({ _id: userId }).populate("user_id");
    }
    getByQuery(query, projection = {}) {
        return this._Controller.find(query, projection).populate("user_id");
    }

    updateById(userId, updatedObj) {
        return this._Controller.findByIdAndUpdate(userId, { $set: updatedObj });
    }
    updateByQuery(query, updatedObj, option) {
        return this._Controller.updateMany(query, { $set: updatedObj }, option);
    }
    deleteById(userId) {
        return this._Controller.findByIdAndRemove(userId);
    }
}
module.exports = new User();