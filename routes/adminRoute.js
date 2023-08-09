const express = require("express");
const router = express.Router();
const User = require("../models/userModel");
const Doctor = require("../models/doctorModel");
const Appointment = require("../models/appointmentModel");
const authMiddleware = require("../middlewares/authMiddleware");
//const { default: Appointments } = require("../client/src/pages/Appointments");
//const { default: Appointments } = require("../client/src/pages/Appointments");

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



module.exports = router;
