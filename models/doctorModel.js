const mongoose = require("mongoose");
const doctorSchema = new mongoose.Schema(
  {
    userId: {
      type: String,
      required: true,
    },
    firstName: {
      type: String,
      required: true,
    },
    lastName: {
      type: String,
      required: true,
    },
    phoneNumber: {
      type: String,
      required: true,
    },
    website: {
      type: String,
    //  required: true,
    },
    address: {
      type: String,
      required: true,
    },
    specialization: {
      type: String,
      required: true,
    },
    experience: {
      type: String,
      required: true,
    },
    feePerCunsultation: {
      type: Number,
    //  required: true,
    default:'80'
    },
    shift:{
      type:String,
      required:true,
    },
    // timings : {
    //   type: Array,
    //   required: true,
    // },
    starttime:{
      type:String,
      required:false,
    },
    endtime:{
      type:String,
      required:false,
    },
    status: {
      type: String,
      default: "pending"
    },
    breakTime:{
      type:String,
      default:"30"
    }
  },
  {
    timestamps: true,
  }
);

const doctorModel = mongoose.model("doctors", doctorSchema);
module.exports = doctorModel;
