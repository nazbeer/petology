// models/doctorLeaveModel.js
const mongoose = require("mongoose");

const doctorLeaveSchema = new mongoose.Schema({
  doctorId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "doctors",
    required: true,
  },
  startDate: {
    type: Date,
    required: true,
  },
  endDate: {
    type: Date,
    required: true,
  },
  // Add more fields if needed
});

const DoctorLeave = mongoose.model("DoctorLeave", doctorLeaveSchema);

module.exports = DoctorLeave;
