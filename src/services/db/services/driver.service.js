"use strict";
const driverModel = require("../models/driver");
let instance;
/*********************************************
 * METHODS FOR HANDLING DRIVER MODEL QUERIES
 *********************************************/
class Driver {
  constructor() {
    //if Driver instance already exists then return
    if (instance) {
      return instance;
    }
    this.instance = this;
    this._driverController = driverModel;
  }
  createDriver(DriverObj) {
    let model = new this._driverController(DriverObj);
    return model.save(DriverObj);
  }
  getFeaturedDrivers() {
    return this._driverController.find({ featured: true }, { Driver_password: 0 });
  }
  getDriverDetailsById(DriverId, projection) {
    if (projection) {
      return this._driverController.findOne({ _id: DriverId }, projection);
    }
    return this._driverController.findOne({ _id: DriverId });
  }
  getDriverDetailsByQuery(query, projection = {}) {
    return this._driverController.find(query, projection);
  }
  getDriverDetailsByQueryAdmin(query, projection = {}) {
    return this._driverController.find(query, projection);
    // .populate({
    //   path: 'speciality',
    //   model: 'Speciality'
    // }).populate('doctor_profile');
  }

  getDriverDetailsByLocationQuery(query, projection = {}) {
    return this._driverController.find(query, projection);
    // .populate({
    //   path: 'doctor_profile',
    //   model: 'DoctorProfile',
    //   select: 'name image speciality fees experience clinic_name',
    //   populate: {
    //     path: 'speciality',
    //     model: 'Speciality'
    //   },
    // });
  }

  updateDriverDetailsById(DriverId, updatedObj) {
    return this._driverController.findByIdAndUpdate(DriverId, { $set: updatedObj });
  }
  updateDriverByQuery(query, updatedObj, option) {
    return this._driverController.updateMany(query, { $set: updatedObj }, option);
  }
  deleteDriverById(DriverId) {
    return this._driverController.findByIdAndRemove(DriverId);
  }
}
module.exports = new Driver();
