const express = require("express");
const router = express.Router();
const Prescription = require("../models/prescriptionModel"); // Assuming you have a Prescription model
const Appointment = require("../models/appointmentModel"); // Assuming you have an Appointment model
const User = require("../models/userModel"); // Assuming you have a User model
const Pet = require("../models/petModel"); // Assuming you have a Pet model
const Doctor = require("../models/doctorModel"); // Assuming you have a Doctor model
const authMiddleware =require("../middlewares/authMiddleware");
router.post("/addprescription", authMiddleware, async (req, res) => {
  try {
    const {
      appointmentId,
      userId,
      doctorId,
      petId,
      prescription,
      description,
      ndate,
      ntime,
    } = req.body;
    console.log(req.body);
    const [appointments, user, doctor, pet] = await Promise.all([
      Appointment.findById(appointmentId),
      User.findById(userId),
      Doctor.findById(doctorId),
      Pet.findById(petId),
    ]);

    if (!appointments || !user || !doctor || !pet) {
      return res.status(400).json({ success: false, error: "Invalid data" });
    }

    const prescriptionData = {
      appointment: appointmentId,
      user,
      doctor,
      pet,
      prescription,
      description,
      nextAppointment: {
        date: ndate,
        time: ntime,
      },
    };

    const newPrescription = new Prescription(prescriptionData);
    await newPrescription.save();

    res.json({ success: true });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

router.get("/get-prescription", authMiddleware, async(req, res)=> {
    try{
        const prescription = await Prescription.find({});
        console.log(prescription);
        res.status(200).send({
            message:"Prescriptions fetched successfully",
            success: true,
            data: prescription,
        });

    } catch (error) {
        res.status(500).send({success :false ,message :"Error fetching the prescriptions", error});
    }
})

module.exports = router;
