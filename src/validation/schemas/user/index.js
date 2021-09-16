const JoiBase = require("@hapi/joi");
const JoiDate = require("@hapi/joi-date");

const Joi = JoiBase.extend(JoiDate);
/**
 * JOI Validation Schema for Profile Route
 */
const number_validation = /^[0-9]*$/;
const float_number_validation = /^[0-9.]*$/;
module.exports = {
  updateProfile: Joi.object().keys({
    user_name: Joi.string().trim().min(3).label("Name").optional(),
    phone_number: Joi.string().min(0).optional().allow(null),
    bank_details: Joi.object().keys({
      bank_name: Joi.string().label("Bank name").allow(null),
      account_number: Joi.number()
        .positive()
        .label("Account Number")
        .allow(null),
      ifsc_code: Joi.string().alphanum().label("Ifsc Code").allow(null),
      swift_code: Joi.string().alphanum().allow(null).label("Swift Code"),
    }),
    social_link: Joi.object()
      .keys({
        facebook: Joi.string()
          .uri({ allowQuerySquareBrackets: true })
          .optional()
          .label("Facebook")
          .allow(null),
        instagram: Joi.string()
          .uri({ allowQuerySquareBrackets: true })
          .optional()
          .label("Instagram")
          .allow(null),
      })
      .or("facebook", "instagram"),
    user_email: Joi.string().email().optional().allow("").label("Email"),
    user_bio: Joi.string().optional().allow("").label("biography"),
    InterestArtsFeild: Joi.array()
      .optional()
      .allow("")
      .label("Interested Arts Feilds"),
    hireRate: Joi.number().optional().allow("").label("hire Rate"),
  }),
  completeBasic: Joi.object().keys({
    dob: Joi.string().required().label("Date of birth"),
    sex: Joi.string().required().label("Sex"),
    user_avatar: Joi.array().label("User Avatar"),
  }),
  contactUs: Joi.object().keys({
    user_name: Joi.string().required().label("Name"),
    user_email: Joi.string().email().required().label("Email"),
    user_phone: Joi.number().allow("").label("Phone"),
    user_message: Joi.string().required().label("Message"),
  }),
  familyMember: Joi.object().keys({
    name: Joi.string().trim().regex(/^[a-zA-Z. ]*$/).required().error(new Error('Name should contain only characters!')),
    gender: Joi.string().required().label("Gender"),
    dob: Joi.string().required().min(10).label("Date of birth"),
    relation: Joi.string().required().label("Relation"),
  }),
  lab: Joi.object().keys({
    owner_name: Joi.string().trim().required().regex(/^[a-zA-Z. ]*$/).message('Owner name should only contain characters').label("Owner Name"),
    name: Joi.string().trim().regex(/^[a-zA-Z. ]*$/).message('Lab name should contain only characters').required().label("Name"),
    email: Joi.string().email().required().label("Email"),
    opening_time: Joi.string().required().regex(/^([0-9]{2})\:([0-9]{2})\ ([A-Z]{2})$/).message('Invalid opening time string!'),
    closing_time: Joi.string().required().regex(/^([0-9]{2})\:([0-9]{2})\ ([A-Z]{2})$/).message('Invalid closing time string!'),
    lab_registration_number: Joi.string().trim().regex(/^[a-zA-Z0-9-_]*$/).message('Registration Number should be alphanumeric').required().label('Registration Number'),
    city: Joi.string().trim().optional().allow("").regex(/^[a-zA-Z ]*$/).message("City should contain only characters!"),
    district: Joi.string().trim().regex(/^[a-zA-Z ]*$/).allow("").error(new Error('District name should contain only characters!')),
    state: Joi.string().trim().optional().allow("").regex(/^[a-zA-Z ]*$/).message('State name should contain only characters!'),
    pin: Joi.string().trim().min(5).max(6).optional().allow("").label('Pin Code').regex(/^[a-zA-Z0-9 ]*$/).message('Pin must be alpha numeric'),
    street: Joi.string().trim().allow("").label('Street'),
    landmark: Joi.string().trim().optional().allow("").label('Landmark'),
    country: Joi.string().trim().optional().allow("").regex(/^[a-zA-Z ]*$/).message('Country name should contain only characters!'),
    lat: Joi.number().optional().allow("").label("Latitude"),
    lng: Joi.number().optional().allow("").label("Longitude"),
    about: Joi.string().optional().allow("").label("About"),
  }),

  pharmacy: Joi.object().keys({
    name: Joi.string().trim().regex(/^[a-zA-Z. ]*$/).message('Pharmacy name should contain only characters').required().label("Name"),
    email: Joi.string().email().required().label("Email"),
    opening_time: Joi.string().required().regex(/^([0-9]{2})\:([0-9]{2})\ ([A-Z]{2})$/).message('Invalid opening time string!'),
    closing_time: Joi.string().required().regex(/^([0-9]{2})\:([0-9]{2})\ ([A-Z]{2})$/).message('Invalid closing time string!'),
    pharmacy_registration_number: Joi.string().trim().regex(/^[a-zA-Z0-9-_]*$/).message('Registration Number should be alphanumeric').required().label('Registration Number'),
    city: Joi.string().trim().optional().allow("").regex(/^[a-zA-Z ]*$/).message("City should contain only characters!"),
    district: Joi.string().trim().regex(/^[a-zA-Z ]*$/).allow("").error(new Error('District name should contain only characters!')),
    state: Joi.string().trim().optional().allow("").regex(/^[a-zA-Z ]*$/).message('State name should contain only characters!'),
    pin: Joi.string().trim().min(5).max(6).optional().allow("").label('Pin Code').regex(/^[a-zA-Z0-9 ]*$/).message('Pin must be alpha numeric'),
    street: Joi.string().trim().allow("").label('Street'),
    landmark: Joi.string().trim().optional().allow("").label('Landmark'),
    country: Joi.string().trim().optional().allow("").regex(/^[a-zA-Z ]*$/).message('Country name should contain only characters!'),
    lat: Joi.number().optional().allow("").label("Latitude"),
    lng: Joi.number().optional().allow("").label("Longitude"),
    about: Joi.string().optional().allow("").label("About"),
  }),

  clinic: Joi.object().keys({
    name: Joi.string().trim().regex(/^[a-zA-Z_&@#*$(). ]*$/).message('Clinic name should contain only characters').required().label("Name"),
    email: Joi.string().email().required().label("Email"),
    opening_time: Joi.string().required().regex(/^([0-9]{2})\:([0-9]{2})\ ([A-Z]{2})$/).message('Invalid opening time string!'),
    closing_time: Joi.string().required().regex(/^([0-9]{2})\:([0-9]{2})\ ([A-Z]{2})$/).message('Invalid closing time string!'),
    registration_number: Joi.string().trim().regex(/^[a-zA-Z0-9-_]*$/).message('Registration Number should be alphanumeric').required().label('Registration Number'),
    address: Joi.string().trim().required().label("Address"),
    phone_number: Joi.string().trim().required().label("Phone Number"),
    lat: Joi.string().trim().optional().label('Lat'),
    lng: Joi.string().trim().optional().label('Lng'),
    about: Joi.string().optional().allow("").label("About"),
  }),

  Address: Joi.object().keys({
    address: Joi.object().keys({
      city: Joi.string().trim().allow("").regex(/^[a-zA-Z ]*$/).allow("").error(new Error('City name not contain any spacial character Or Numbers!')),
      district: Joi.string().trim().regex(/^[a-zA-Z ]*$/).allow("").error(new Error('District not contain any spacial character Or Numbers!')),
      state: Joi.string().trim().regex(/^[a-zA-Z ]*$/).allow("").error(new Error('State name not contain any spacial character Or Numbers!')),
      pin: Joi.string().min(5).max(6).allow("").label('Pin Code'),
      street: Joi.string().trim().allow("").label('Street'),
      country: Joi.string().trim().regex(/^[a-zA-Z ]*$/).allow("").error(new Error('Country name not contain any spacial character Or Numbers!')),
    }).required().label("Address"),
    coords:Joi.array().required().label("Coordinates"),
  }),
  doctorProfile: Joi.object().keys({
    name: Joi.string().required().regex(/^[a-zA-Z. ]*$/).allow("").error(new Error('Name should contain only characters!')),
    experience: Joi.string().required().regex(/^[0-9.]*$/).message('Experience should only contain numeric value').label('Experience'),
    // image:imageLocation,
    fees: Joi.string().required().min(2).max(4).regex(/^[0-9]*$/).message('Consultant fee should only contain numeric value').label('Fees').messages({
          "string.min": 'Consultation fee should be at least in 2 digits',
          "string.max": 'Consultation fee should be not more than 4 digits',
        }
    ),
    clinic_name:Joi.string().required().label('Clinic Name'),
    clinic_id:Joi.string().optional().allow("").label('Clinic Id'),
    speciality:Joi.string().required().label('Speciality'),
    bio:Joi.string().allow("").label('bio'),
    // awards:Joi.string().required().label('Fees'),
    // certificate:Joi.string().required().label('Fees'),
    qualification:Joi.string().required().label('Qualification'),
    medical_registration_number:Joi.string().required().label('Medical Registration Number'),
    city: Joi.string().allow("").regex(/^[a-zA-Z ]*$/).allow("").error(new Error('City name not contain any spacial character Or Numbers!')),
    district: Joi.string().regex(/^[a-zA-Z ]*$/).allow("").error(new Error('District not contain any spacial character Or Numbers!')),
    state: Joi.string().regex(/^[a-zA-Z ]*$/).allow("").error(new Error('State name not contain any spacial character Or Numbers!')),
    pin: Joi.string().min(5).max(6).allow("").label('Pin Code'),
    street: Joi.string().allow("").label('Street'),
    landmark: Joi.string().allow("").label('Landmark'),
    country: Joi.string().regex(/^[a-zA-Z ]*$/).allow("").error(new Error('Country name not contain any spacial character Or Numbers!')),
    dob: Joi.date().format("MM-DD-YYYY").required().label("Date of birth"),
    gender: Joi.string().required().label("gender"),
    lat: Joi.string().required().label("Latitude"),
    lng: Joi.string().required().label("Longitude"),
    user_email: Joi.string().email().optional().allow("").label("Email"),
  }),
  InsuranceDetail: Joi.object().keys({
    insurance_expired_date: Joi.date().format("MM-DD-YYYY").allow("").label("Insurance Expiry Date").error(new Error('Invalid insurance expiry date!')),
    insurance_company_name: Joi.string().allow("").label("Insurance Company Name"),
    insurance_employer_phone: Joi.string().min(10).allow("").label("Insurance Employer Phone"),
    insurance_type: Joi.string().regex(/^[a-zA-Z ]*$/).allow("").error(new Error('Insurance type only accept alphabets!')),
    insurance_holder_name: Joi.string().regex(/^[a-zA-Z_. ]*$/).allow("").error(new Error('Insurance Holder name not contain any spacial character Or Numbers!')),
    insurance_nominee: Joi.string().allow("").label("Nominee"),
    insurance_number: Joi.string().min(10).max(10).allow("").label("Insurance Number"),
  }),
  UserDetail: Joi.object().keys({
    city: Joi.string().trim().optional().allow("").regex(/^[a-zA-Z ]*$/).message("City should contain only characters!"),
    district: Joi.string().trim().regex(/^[a-zA-Z ]*$/).allow("").error(new Error('District name should contain only characters!')),
    state: Joi.string().trim().optional().allow("").regex(/^[a-zA-Z ]*$/).message('State name should contain only characters!'),
    pin: Joi.string().trim().min(5).max(6).optional().allow("").label('Pin Code').regex(/^[a-zA-Z0-9 ]*$/).message('Pin must be alpha numeric'),
    street: Joi.string().trim().allow("").label('Street'),
    country: Joi.string().trim().optional().allow("").regex(/^[a-zA-Z ]*$/).message('Country name should contain only characters!'),
    insurance_expired_date: Joi.date().format("MM-DD-YYYY").allow("").label("Insurance Expiry Date"),
    insurance_employer_name: Joi.string().trim().allow("").label("Insurance Employer Name").regex(/^[a-zA-Z_0-9. ]*$/).message('Insurance employer name should be alpha numeric!'),
    insurance_company_name: Joi.string().trim().allow("").label("Insurance Company Name").regex(/^[a-zA-Z_0-9. ]*$/).message('Insurance company name should be alpha numeric!'),
    insurance_employer_phone: Joi.string().trim().regex(/^[0-9]*$/).message("Insurance employer phone should be numeric").min(10).max(10).allow("").label("Insurance Employer Phone"),
    insurance_type: Joi.string().trim().regex(/^[a-zA-Z ]*$/).allow("").error(new Error('should contain only characters!')),
    insurance_holder_name: Joi.string().trim().allow("").regex(/^[a-zA-Z. ]*$/).message("Insurance holder name should contain characters!").label("Insurance Holder Name"),
    insurance_nominee: Joi.string().trim().allow("").label("Nominee").regex(/^[a-zA-Z. ]*$/).message("Insurance nominee name should contain characters!"),
    insurance_number: Joi.string().trim().regex(/^[a-zA-Z0-9]*$/).message("Insurance number should be alpha numeric!").allow("").label("Insurance Number"),
    lat: Joi.number().optional().allow("").label("Latitude"),
    lng: Joi.number().optional().allow("").label("Longitude"),
  }),
  /*TimeSlots: Joi.object().keys({
    start_date: Joi.date().format("MM-DD-YYYY").required().label("Insurance Expiry Date").error(new Error('Invalid insurance expiry date!')),
    end_date: Joi.date().format("MM-DD-YYYY").required().label("Insurance Expiry Date").error(new Error('Invalid insurance expiry date!')),
    start_morning: Joi.string().required().regex(/^([0-9]{2})\:([0-9]{2})$/).message('Invalid start morning time string!'),
    end_morning: Joi.string().required().regex(/^([0-9]{2})\:([0-9]{2})$/).message('Invalid start morning time string!'),
    start_noon: Joi.string().required().regex(/^([0-9]{2})\:([0-9]{2})$/).message('Invalid start after noon time string!'),
    end_noon: Joi.string().required().regex(/^([0-9]{2})\:([0-9]{2})$/).message('Invalid end after noon string!'),
    start_evening: Joi.string().required().regex(/^([0-9]{2})\:([0-9]{2})$/).message('Invalid start evening time string!'),
    end_evening: Joi.string().required().regex(/^([0-9]{2})\:([0-9]{2})$/).message('Invalid end evening time string!'),
    duration_morning: Joi.string().required().regex(/^([0-9]{2})$/).message('Invalid duration morning string!'),
    duration_noon: Joi.string().required().regex(/^([0-9]{2})$/).message('Invalid duration after noon string!'),
    duration_evening: Joi.string().required().regex(/^([0-9]{2})$/).message('Invalid duration evening string!'),
  }),*/
  BookLabTest: Joi.object().keys({
    family_member: Joi.string().optional().allow("").label("Family Member"),
    test_id: Joi.array().required().label("Test Id"),
    lab_id: Joi.string().required().label("Lab Id"),
    total_price: Joi.string().required().regex(/^[0-9]*$/).message('Total price should be in digit!').label("Total price")
  }),
  AddTestPrecription: Joi.object().keys({
    date: Joi.date().format("MM-DD-YYYY").required(),
    time: Joi.string().required().regex(/^([0-9]{2})\:([0-9]{2})$/).message('Invalid time string!'),
    isHome: Joi.boolean().required().label('Is Home'),
    address: Joi.string().allow("").label("Address"),
    transaction_id: Joi.string().allow("").label("Transaction Id"),
  }),
  BookingAppointment: Joi.object().keys({
    appoint_for: Joi.string().trim().required().label('Appointment For'),
    date: Joi.date().format("MM-DD-YYYY").required(),
    time_slot: Joi.string().required().label('Time slot'),
    type: Joi.string().trim().required().label('Appointment type'),
    message: Joi.string().trim().optional().allow("").label('Message'),
    doctor_id: Joi.string().trim().required().label('Doctor Id'),
    family_member: Joi.string().trim().allow("").label('Family member'),
    transaction_id: Joi.string().trim().optional().label('Transaction Id'),
  }),
  PaymentAppointment: Joi.object().keys({
    info: Joi.string().trim().optional().allow("").label('Info'),
    family_member: Joi.string().trim().allow("").label('Family member'),
    doctor_id: Joi.string().trim().required().label('Doctor Id'),
    date: Joi.date().format("MM-DD-YYYY").required(),
    time_slot: Joi.string().trim().required().label('Time Slot'),
  }),
  RescheduleAppointment: Joi.object().keys({
    date: Joi.date().format("MM-DD-YYYY").required(),
    /*start_time: Joi.string().required().regex(/^([0-9]{2})\:([0-9]{2})\ ([A-Z]{2})$/).message('Invalid start time string!'),
    end_time: Joi.string().required().regex(/^([0-9]{2})\:([0-9]{2})\ ([A-Z]{2})$/).message('Invalid end time string!'),*/
    time_slot: Joi.string().required().label('Time slot'),
    reason: Joi.string().optional().allow("").label('Reason'),
    family_member: Joi.string().optional().allow("").label('Family Member')
  }),
  CancelAppointment: Joi.object().keys({
    reason: Joi.string().required().label('Reason')
  }),
  Prescription: Joi.object().keys({
    chief_complaint: Joi.string().trim().required().max(200).label('Chief Complaint'),
    suggested_investigation: Joi.string().trim().required().max(200).label('Suggested Investigation'),
    spacial_instructions: Joi.string().trim().required().max(200).label('Special Instruction'),
    relevant_history: Joi.string().trim().optional().allow("").max(200).label('Relevant history'),
    provisional_diagnosis: Joi.string().trim().optional().allow("").max(200).label('Provisional Diagnosis'),
    lab_finding: Joi.string().trim().optional().allow("").max(200).label('Lab Finding'),
    appointment_id: Joi.string().trim().required().label('Appointment Id')
  }),
  SavePharmacyOrder: Joi.object().keys({
    order_notes: Joi.string().trim().required().max(200).label("Order Notes"),
    address: Joi.string().trim().required().max(200).label("Address"),
    pharmacy_id: Joi.string().trim().required().label("Pharmacy Id"),
    family_member: Joi.string().trim().optional().allow("").label("Family Member"),
  }),
  TakePharmacyOrder: Joi.object().keys({
    pharmacy_order_notes: Joi.string().trim().required().max(200).label("Pharmacy Order Notes")
  }),
  SaveLabNPrescription: Joi.object().keys({
    type: Joi.string().trim().valid('lab_report','prescription').required().label("Type"),
    name: Joi.string().trim().required().label("Name"),
    comment: Joi.string().trim().optional().allow("").label("Comment"),
    family_member: Joi.string().trim().optional().allow("").label("Family Member")
  }),
  SaveVitals: Joi.object().keys({
    height: Joi.string().trim().required().max(3).regex(number_validation).message('Height must be number string').label("Height"),
    weight: Joi.string().trim().required().max(4).regex(number_validation).message('Width must be number string').label("Weight"),
    blood_group: Joi.string().trim().required().valid('A+','B+','A-','B-','AB+','AB-','O+','O-').label("blood_group"),
    pulse_rate: Joi.string().trim().max(3).regex(number_validation).message('Pulse rate must be number string').optional().allow("").label("pulse_rate"),
    blood_pressure: Joi.string().trim().message('Blood pressure must be number string').optional().allow("").label("blood_pressure"),
    family_member: Joi.string().trim().optional().allow("").label("family_member"),
  }),
  CancelPharmacy: Joi.object().keys({
    reason: Joi.string().required().error(new Error('Please select reason for cancellation')),
  }),
  Review: Joi.object().keys({
    review: Joi.string().trim().required().regex(float_number_validation).message('Review must be a float number string').label("Review"),
    name: Joi.string().trim().required().label("Name"),
    comment: Joi.string().trim().optional().allow("").label("Name"),
    hsrp_id: Joi.string().trim().required().label("Health Service Provider Id"),
    review_for: Joi.string().trim().required().valid('doctor','lab','pharmacy').label("Review For"),
  }),
  SaveAddress: Joi.object().keys({
    name: Joi.string().trim().required().regex(/^[a-zA-Z. ]*$/).message("Name should contain only characters").label("Person Name"),
    address: Joi.object().keys({
      city: Joi.string().trim().allow("").label("City"),
      district: Joi.string().trim().allow("").regex(/^[a-zA-Z ]*$/).message('District should contain only characters!'),
      state: Joi.string().trim().regex(/^[a-zA-Z ]*$/).message('State should contain only characters!'),
      pin: Joi.string().min(5).max(6).label('Pin Code'),
      house_no: Joi.string().trim().allow("").label('House No'),
      street: Joi.string().trim().allow("").label('Street'),
      landmark: Joi.string().trim().allow("").label('Landmark'),
      country: Joi.string().trim().regex(/^[a-zA-Z ]*$/).allow("").message('Country name not contain any spacial character Or Numbers!'),
    }).required().label("Address"),
    phone_number:Joi.string().min(10).max(10).regex(/^[0-9]*$/).message('Phone number should be numeric string'),
    lat: Joi.string().trim().label('Latitude'),
    lng: Joi.string().trim().label('Longitude'),
  })
};
