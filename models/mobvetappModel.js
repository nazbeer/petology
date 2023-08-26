const mongoose = require("mongoose");

const appointmentSchema = new mongoose.Schema({
    doctor: {
      type: String,
      required: true
    },
    service: {
      type: String,
      required: true
    },
    pet: {
      type: String,
      required: true
    },
    size: {
      type: String,
      required: true
    },
    breed: {
      type: String,
      required: true
    },
    date: {
      type: Date,
      required: true
    },
    time: {
      type: String,
      required: true
    },
    firstname: {
      type: String,
      required: true
    },
    lastname: {
      type: String,
      required: true
    },
    email: {
      type: String,
      required: true
    },
    mobile: {
      type: String,
      required: true
    },
    lat: {
      type: String,
      required: true
    },
    lng: {
      type: String,
      required: true
    }
  });

const appointmentModel = mongoose.model("mobvetappointment", appointmentSchema);
module.exports = appointmentModel;
