// backend/routes.js
const express = require('express');
const router = express.Router();

const Appointment = require('../models/appointmentModel');

// Route to create a new appointment
router.post('/create-new-vet-appointment', async (req, res) => {
  try {
    const {
      doctor,
      service,
      pet,
      size,
      dimension,
      breed,
      date,
      time,
      building,
      flat,
      landmark,
      firstname,
      lastname,
      email,
      mobile,
    } = req.body;

    // Create a new Appointment document in MongoDB
    const appointment = new Appointment({
      doctor,
      service,
      pet,
      size,
      dimension,
      breed,
      date,
      time,
      building,
      flat,
      landmark,
      firstname,
      lastname,
      email,
      mobile,
    });

    // Save the appointment in the database
    await appointment.save();

    // Send a success response
    res.json({ success: true, message: 'Appointment created successfully' });
  } catch (error) {
    console.error('Error creating appointment:', error);
    res.status(500).json({ success: false, message: 'Error creating appointment' });
  }
});

module.exports = router;
