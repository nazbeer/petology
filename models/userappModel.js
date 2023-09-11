// mainApp.js

const mongoose = require('mongoose');
const autoIncrement = require('mongoose-auto-increment');
const CounterModel = require('./CounterModel');

// Initialize Mongoose and the auto-increment plugin

autoIncrement.initialize(mongoose.connection);

const appointmentSchema = new mongoose.Schema({
  userId: { type: String, required: true },
  doctor: { type: String, required: true, default: 'Any' },
  doctorId: { type: String, required: true, default: 'null' },
  module: { type: String, required: false },
  service: { type: String, required: true },
  breed: { type: String, required: true },
  date: { type: Date, required: true },
  time: { type: String, required: true },
  pet: { type: String, required: true },
  size: { type: String, required: true },
  lat: { type: String, required: true, default: 'null' },
  lng: { type: String, required: true, default: 'null' },
  status: { type: String, default: "approved" },
  customId: { type: String, required: false, unique: true },
}, {
  timestamps: true,
});

// Middleware to generate and assign the custom ID
appointmentSchema.pre('save', async function (next) {
  try {
    const moduleType = this.module; // Get the module type (veterinary, grooming, etc.)
    let moduleNumber = 0;
    switch (this.module) {
      case 'veterinary':
        moduleNumber = 1;
        break;
      case 'grooming':
        moduleNumber = 2;
        break;
      case 'mobile_veterinary':
        moduleNumber = 3;
        break;
      case 'mobile_grooming':
        moduleNumber = 4;
        break;
      default:
        // Handle other cases or provide a default value
        break;
    }
    // Find the corresponding counter document for this module type
    let counter = await CounterModel.findOne({ module: moduleType });

    if (!counter) {
      // If the counter document doesn't exist, create it
      counter = await CounterModel.create({ module: moduleType });
    }

    // Increment the counter and format the custom ID
    counter.lastId++;
    const formattedCounter = counter.lastId.toString().padStart(6, '0');
    const formattedDate = new Date().toISOString().slice(0, 10).replace(/-/g, '');

    this.customId = `${formattedDate}-${moduleNumber}${formattedCounter}`;

    // Save the updated counter document
    await counter.save();

    next();
  } catch (error) {
    next(error);
  }
});

// Apply the auto-increment plugin to the UserappModel
appointmentSchema.plugin(autoIncrement.plugin, {
  model: 'UserAppointment',
  field: 'id', // The field to increment (can be any field name)
  startAt: 1, // The starting ID value
  incrementBy: 1, // The increment value
});

const UserappModel = mongoose.model('UserAppointment', appointmentSchema);

module.exports = UserappModel;
