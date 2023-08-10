const mongoose = require("mongoose");
const openappointmentSchema = new mongoose.Schema(
  {
    userId: {
      type: String,
    //  required: true,
    },
    doctorId: {
      type: String,
    //  required: true,
    },
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User', // Reference to the User model
      required: false,
    },
    module:{
      type :String,
      enum:['Veterinary', 'Grooming', 'Mobile Veterinary', 'Mobile Grooiming']
    },
    doctor: {
      type: String,
      required: true,
    },
    service: {
      type: String,
      required: true,
    },
    pet:{
      type: String,

    },
    
    doctorInfo: {
      type: Object,
      required: false,
    },
    userInfo: {
      type: Object,
      required: false,
    },
    date: {
      type: String,
      required: true,
    },
    time: {
      type: String,
      required: true,
    },
    status: {
      type: String,
      required: true,
      default: "pending",
    },
    petInfo: {
      type: Object,
      required: false,
    },
    firstname:{
      type: String,
      

    },
    lastname:{
      type:String,
     
    },
    email:{
      type:String,
    },
    mobile:{
      type:String,
    }

  },
  {
    timestamps: true,
  }
);

const openappointmentModel = mongoose.model("openappointments", openappointmentSchema);
module.exports = openappointmentModel;
