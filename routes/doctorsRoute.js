const express = require("express");
const router = express.Router();
const Doctor = require("../models/doctorModel");
const authMiddleware = require("../middlewares/authMiddleware");
const Appointment = require("../models/appointmentModel");
const User = require("../models/userModel");
const PetList = require("../models/petModel");

router.post("/get-doctor-info-by-user-id", authMiddleware, async (req, res) => {
  try {
    const doctor = await Doctor.findOne({ userId: req.body.userId });
    res.status(200).send({
      success: true,
      message: "Doctor info fetched successfully",
      data: doctor,
    });
  } catch (error) {
    res
      .status(500)
      .send({ message: "Error getting doctor info", success: false, error });
  }
});

router.post("/get-doctor-info-by-id", authMiddleware, async (req, res) => {
  try {
    const doctor = await Doctor.findOne({ _id: req.body.doctorId });
    res.status(200).send({
      success: true,
      message: "Doctor info fetched successfully",
      data: doctor,
    });
  } catch (error) {
    res
      .status(500)
      .send({ message: "Error getting doctor info", success: false, error });
  }
});

router.post("/update-doctor-profile", authMiddleware, async (req, res) => {
  try {
    const doctor = await Doctor.findOneAndUpdate(
      { userId: req.body.userId },
      req.body
    );
    res.status(200).send({
      success: true,
      message: "Doctor profile updated successfully",
      data: doctor,
    });
  } catch (error) {
    res
      .status(500)
      .send({ message: "Error getting doctor info", success: false, error });
  }
});

router.get(
  "/get-appointments-by-doctor-id",
  authMiddleware,
  async (req, res) => {
    try {
      const doctor = await Doctor.findOne({ userId: req.body.userId });
      const appointments = await Appointment.find({ doctorId: doctor._id });
      console.log(doctor);
      console.log(appointments);
      res.status(200).send({
        message: "Appointments fetched successfully",
        success: true,
        data: appointments,
      });
    } catch (error) {
      console.log(error);
      res.status(500).send({
        message: "Error fetching appointments",
        success: false,
        error,
      });
    }
  }
);

router.post("/change-appointment-status", authMiddleware, async (req, res) => {
  try {
    const { appointmentId, status } = req.body;
    const appointment = await Appointment.findByIdAndUpdate(appointmentId, {
      status,
    });

    const user = await User.findOne({ _id: appointment.userId });
    const unseenNotifications = user.unseenNotifications;
    unseenNotifications.push({
      type: "appointment-status-changed",
      message: `Your appointment status has been ${status}`,
      onClickPath: "/appointments",
    });

    await user.save();

    res.status(200).send({
      message: "Appointment status updated successfully",
      success: true
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({
      message: "Error changing appointment status",
      success: false,
      error,
    });
  }
});
router.get('/doctorcount', async (req, res) => {
  try {
    const count = await Doctor.countDocuments();
    res.json({ count });
  } catch (error) {
    console.error('Error counting doctors:', error);
    res.status(500).json({ error: 'Server error' });
  }
});


// Route for fetching all pets for a specific user
router.get('/user/:userId/pets', authMiddleware, async (req, res) => {
  try {
    const { userId } = req.params;
    const pets = await Pet.find({ userId });
    res.json({ success: true, data: pets });
  } catch (error) {
    console.error('Error fetching pets:', error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

// Route for fetching all appointments for a specific user's pet

// Route for fetching all appointments for a specific user's pet
// router.get('/user/:userId/pet/:petId/appointments', authMiddleware, async (req, res) => {
//   try {
//     const { userId, petId } = req.params;
//     const { isUser } = req.query;

//     if (isUser === 'true') {
//       // If isUser is true, fetch the user along with the appointments
//       const user = await User.findById(userId);
//       const appointments = await Appointment.find({ userId, petId });
     
//       res.json({ success: true, data: { user, appointments } });
//     } else {
//       // If isUser is false or not provided, only fetch the appointments
//       const appointments = await Appointment.find({ userId, petId });
//       res.json({ success: true, data: appointments });
//     }
//   } catch (error) {
//     console.error('Error fetching appointments:', error);
//     res.status(500).json({ success: false, message: 'Server error' });
//   }
// });

router.get('/user/:userId/pet/:petId/appointments', authMiddleware, async (req, res) => {
  const { userId, petId } = req.params;

  try {
    const appointments = await Appointment.find({ userId, petId });
    console.log(appointments);
    res.status(200).json({
      success: true,
      data: appointments,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: 'An error occurred while fetching appointments.',
    });
  }
});


module.exports = router;
