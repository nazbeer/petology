const mongoose = require('mongoose');

const appointmentSchema = new mongoose.Schema({
    userId: { type: String, required: true },
    doctor: {type:String, required:false},
    doctorId: { type: String, required: false },
    service: { type: String, required: false },
    breed: { type: String, required: true },
    date: { type: Date, required: true },
    time: { type: String, required: true },
    pet: { type: String, required: true },
    size: { type: String, required: true },
    lat: {type:String, required:false},
    lng: {type:String, required:false},
    status: {type:String, default:"approved"},
    // Add other fields if needed
}, {
  timestamps: true,
});

const UserappModel = mongoose.model('UserAppointment', appointmentSchema);

module.exports = UserappModel;
