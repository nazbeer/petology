const express = require("express");
const router = express.Router();

const User = require("../models/userModel");
const Doctor = require("../models/doctorModel");
const OpenAppointment = require('../models/openAppointmentModel');
const Pet = require("../models/petModel");
const Service = require('../models/serviceModel');
const opengroomingModel = require("../models/openGroomingModel");
router.get('/get-all-appointments', async (req, res) => {
    try {
      const appointmentList = await OpenAppointment.find({})
        .populate('doctors', 'name') // Assuming 'doctor' field is a reference to User model
        //.populate('petlists', 'name') // Assuming 'pet' field is a reference to Pet model
        .exec();
    //  console.log(appointmentList);
      res.status(200).send({
        message: 'Appointment List fetched successfully',
        success: true,
        data: appointmentList,
      });
    } catch (error) {
      console.error(error);
      res.status(500).send({
        message: 'Error fetching All Appointments',
        success: false,
        error,
      });
    }
  });
  router.get('/get-all-grooming-appointments', async (req, res) => {
    try {
      const appointmentList = await opengroomingModel.find({})
       // .populate('doctors', 'name') // Assuming 'doctor' field is a reference to User model
        //.populate('petlists', 'name') // Assuming 'pet' field is a reference to Pet model
        .exec();
    //  console.log(appointmentList);
      res.status(200).send({
        message: 'Appointment List fetched successfully',
        success: true,
        data: appointmentList,
      });
    } catch (error) {
      console.error(error);
      res.status(500).send({
        message: 'Error fetching All Appointments',
        success: false,
        error,
      });
    }
  });
  
router.get("/get-all-approved-doctors", async (req, res) => {
    try {
      const doctors = await Doctor.find({ status: "approved" });
      res.status(200).send({
        message: "Doctors fetched successfully",
        success: true,
        data: doctors,
      });
    } catch (error) {
      console.log(error);
      res.status(500).send({
        message: "Error applying doctor account",
        success: false,
        error,
      });
    }
  });
  
    router.post('/book-appointment', async (req, res) => {
        try {
        const appointmentData = req.body;
    
        // Create a new appointment
        const newAppointment = new OpenAppointment(appointmentData);
        const savedAppointment = await newAppointment.save();
          //  console.log('appointment', newAppointment);
        // Update the user's appointment array
        await User.findByIdAndUpdate(
            appointmentData.userId,
            { $addToSet: { appointments: savedAppointment._id } },
            { new: true }
        );
    
        res.status(200).json({ success: true, message: 'Veterniary Appointment booked successfully', data: savedAppointment });
        } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: 'An error occurred while booking the appointment' });
        }
    });
    router.post('/grooming-appointment', async (req, res) => {
      try {
      const appointmentData = req.body;
  
      // Create a new appointment
      const newAppointment = new opengroomingModel(appointmentData);
      const savedAppointment = await newAppointment.save();
        //  console.log('appointment', newAppointment);
      // Update the user's appointment array
      await User.findByIdAndUpdate(
          appointmentData.userId,
          { $addToSet: { appointments: savedAppointment._id } },
          { new: true }
      );
  
      res.status(200).json({ success: true, message: 'Grooming Appointment booked successfully', data: savedAppointment });
      } catch (error) {
      console.error(error);
      res.status(500).json({ success: false, message: 'An error occurred while booking the appointment' });
      }
  });
  
  
  module.exports = router;