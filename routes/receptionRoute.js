const express = require("express");
const router = express.Router();
const User = require("../models/userModel");
const Doctor = require("../models/doctorModel");
const Appointment = require("../models/appointmentModel");
const Pet = require("../models/petModel");
const Service = require('../models/serviceModel');
const authMiddleware = require("../middlewares/authMiddleware");
//const { default: Appointments } = require("../client/src/pages/Appointments");
//const { default: Appointments } = require("../client/src/pages/Appointments");


router.get('/profile/:userId', authMiddleware, async (req, res) => {
    try {
      const { userId } = req.params;
  
      const receptionist = await User.findById(userId);
  
      if (!receptionist) {
        return res.status(404).json({ success: false, message: 'Receptionist not found' });
      }
  
      res.status(200).json({ success: true, data: receptionist });
    } catch (error) {
      console.error(error);
      res.status(500).json({ success: false, message: 'An error occurred while fetching the receptionist profile' });
    }
  });

  router.post("/change-doctor-break-time", async (req, res) => {
    const { doctorId, userId, breakTime } = req.body;
  
    try {
      const doctor = await Doctor.findById(doctorId);
  
      if (!doctor) {
        return res.status(404).json({ success: false, message: "Doctor not found" });
      }
  
      // Assuming 'breakTime' is a field in the Doctor schema
      doctor.breakTime = breakTime;
      await doctor.save();
  
      return res.status(200).json({ success: true, message: "Break time updated successfully" });
    } catch (error) {
      console.error(error);
      return res.status(500).json({ success: false, message: "Internal server error" });
    }
  });
  
  
router.get("/get-all-services", authMiddleware, async (req, res) => {
  try{
      const service = await Service.find({});
      console.log(service);
      res.status(200).send({
          success:true,
          message:"All services fetched successfully.",
          data: service,
      });
  } catch(error){
      res.status(500).send({
          success:false,
          message:"Unable to fetch the service List details",
          error,
      });
  }
});

//const upload = multer({ dest: 'uploads/' });

router.post('/create-new-service', authMiddleware, async (req, res) => {
  try {
    const { name, subservice} = req.body;
   // const image = req.file ? req.file.path : ''; // Store the image path

    const newService = new Service({name, subservice });
   
    await newService.save();
   // console.log(newService);
  //  res.json(newService);
    res.status(200).send({
      message: "New Service Added successfully",
      success: true,
      data: newService,
    });
  } catch (error) {
    console.error('Error saving Service:', error);
    res.status(500).json({ error: 'Server error' });
  }
});
router.get("/get-all-approved-doctors", authMiddleware, async (req, res) => {
  try {
    const doctors = await Doctor.find({});
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
router.post('/assign-doctor-to-appointment', authMiddleware, async (req, res) => {
  try {
    const { appointmentId, doctorId } = req.body;

    // Find the appointment by ID and update the doctorId
    const updatedAppointment = await Appointment.findByIdAndUpdate(
      appointmentId,
      { doctorId },
      { new: true } // Return the updated appointment
    );

    if (!updatedAppointment) {
      return res.status(404).json({ success: false, message: 'Appointment not found' });
    }

    // Update the doctor's appointments array
    await Doctor.findByIdAndUpdate(
      doctorId,
      { $addToSet: { appointments: appointmentId } },
      { new: true }
    );

    res.status(200).json({ success: true, message: 'Doctor assigned successfully', data: updatedAppointment });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: 'An error occurred while assigning the doctor' });
  }
});

router.get('/get-all-appointments', authMiddleware, async (req, res) => {
  try {
    const appointmentList = await Appointment.find({})
      .populate('doctors', 'name') // Assuming 'doctor' field is a reference to User model
      .populate('petlists', 'name') // Assuming 'pet' field is a reference to Pet model
      .exec();
    console.log(appointmentList);
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


router.post('/set-break-time', async (req, res) => {
  try {
    const { duration } = req.body;
    
    // For demonstration purposes, we'll just return a success message
    res.json({ success: true, message: `Break time set to ${duration} minutes.` });
  } catch (error) {
    console.error('Error setting break time:', error);
    res.status(500).json({ success: false, message: 'Error setting break time.' });
  }
});

// router.get("/get-all-appointments", authMiddleware, async (req, res) => {
//   try {
//     const appointments = await Appointment.find({});
//     res.send(200).send({
//       message: 'All appointments fetched',
//       success: true,
//       data :appointments,
//     });
//   } catch (error) {
//     console.log(error);
//     res.status(500).send({
//       message: "Error fetching Appointments",
//       success: false,
//       error,
//     });
//   }
// });
router.get('/count-records', authMiddleware, async (req, res) => {
  try {
    //const db = client.db(petology);
    const collection = db.collection('doctors'); // Replace with your collection name
    console.log(collection);
    // Count the documents in the collection
    const count = await collection.count();
    console.log(count);
    res.json({ count });
  } catch (error) {
    console.error('Error counting documents:', error);
    res.status(500).json({ error: 'Server error' });
  }
});
router.get("/get-all-approved-users", authMiddleware, async (req, res) => {
  try {
    const users = await User.find({});
    res.status(200).send({
      message: "Users fetched successfully",
      success: true,
      data: users,
    });
    //console.log(res);
  } catch (error) {
    console.log(error);
    res.status(500).send({
      message: "Error applying user account",
      success: false,
      error,
    });
  }
});

router.post(
  "/change-doctor-account-status",
  authMiddleware,
  async (req, res) => {
    try {
      const { doctorId, status } = req.body;
      const doctor = await Doctor.findByIdAndUpdate(doctorId, {
        status,
      });

      const user = await User.findOne({ _id: doctor.userId });
      const unseenNotifications = user.unseenNotifications;
      unseenNotifications.push({
        type: "new-doctor-request-changed",
        message: `Your doctor account has been ${status}`,
        onClickPath: "/notifications",
      });
      user.isDoctor = status === "approved" ? true : false;
      await user.save();

      res.status(200).send({
        message: "Doctor status updated successfully",
        success: true,
        data: doctor,
      });
    } catch (error) {
      console.log(error);
      res.status(500).send({
        message: "Error applying doctor account",
        success: false,
        error,
      });
    }
  }
);
router.post('/change-appointment-status/:id', authMiddleware, async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    const updatedAppointment = await Appointment.findByIdAndUpdate(
      id,
      { status }, // Update the status field
      { new: true } // Return the updated appointment
    );

    if (!updatedAppointment) {
      return res.status(404).json({ success: false, message: 'Appointment not found' });
    }

    res.status(200).json({ success: true, message: 'Appointment status changed successfully', data: updatedAppointment });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: 'An error occurred while changing appointment status' });
  }
});

module.exports = router;
