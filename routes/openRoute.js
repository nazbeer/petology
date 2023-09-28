const express = require("express");
const router = express.Router();

const User = require("../models/userModel");
const Doctor = require("../models/doctorModel");
const OpenAppointment = require("../models/openAppointmentModel");
const Pet = require("../models/petModel");
const Service = require("../models/serviceModel");
const opengroomingModel = require("../models/openGroomingModel");
const mobvetappModel = require("../models/mobvetappModel");
const mobgroomappModel = require("../models/mobgroomappModel");
const Pack = require("../models/packModel");
const UserappModel = require("../models/userappModel");
const officetime = require("../models/OfficeTimeModel");
router.get("/get-all-appointments", async (req, res) => {
  try {
    const appointmentList = await OpenAppointment.find({})
      .populate("doctors", "name") // Assuming 'doctor' field is a reference to User model
      //.populate('petlists', 'name') // Assuming 'pet' field is a reference to Pet model
      .exec();
    console.log(appointmentList);
    res.status(200).send({
      message: "Appointment List fetched successfully",
      success: true,
      data: appointmentList,
    });
  } catch (error) {
    console.error(error);
    res.status(500).send({
      message: "Error fetching All Appointments",
      success: false,
      error,
    });
  }
});
router.get("/get-all-grooming-appointments", async (req, res) => {
  try {
    const appointmentList = await opengroomingModel
      .find({})
      // .populate('doctors', 'name') // Assuming 'doctor' field is a reference to User model
      //.populate('petlists', 'name') // Assuming 'pet' field is a reference to Pet model
      .exec();
    console.log(appointmentList);
    res.status(200).send({
      message: "Appointment List fetched successfully",
      success: true,
      data: appointmentList,
    });
  } catch (error) {
    console.error(error);
    res.status(500).send({
      message: "Error fetching All Appointments",
      success: false,
      error,
    });
  }
});
router.get("/get-services", async (req, res) => {
  try {
    const services = await Pack.find({ serviceType: "Mobile Grooming" });
    res.status(200).send({
      message: "Services fetched successfully",
      success: true,
      data: services,
    });
  } catch (error) {
    res.status(500).send({
      message: "Error fetching Service List",
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
      message: "Error fetching doctor list",
      success: false,
      error,
    });
  }
});

router.post("/book-appointment", async (req, res) => {
  try {
    const appointmentData = req.body;

    // Create a new appointment
    const newAppointment = new OpenAppointment(appointmentData);
    const savedAppointment = await newAppointment.save();
    // Update the user's appointment array
    await User.findByIdAndUpdate(
      appointmentData.userId,
      { $addToSet: { appointments: savedAppointment._id } },
      { new: true }
    );

    res.status(200).json({
      success: true,
      message: "Veterniary Appointment booked successfully",
      data: savedAppointment,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: "An error occurred while booking the appointment",
    });
  }
});
router.post("/book-mobvet-appointment", async (req, res) => {
  try {
    const appointmentData = req.body;
    console.log(appointmentData);
    // Create a new appointment
    const newAppointment = new mobvetappModel(appointmentData);
    const savedAppointment = await newAppointment.save();
    // Update the user's appointment array
    // await User.findByIdAndUpdate(
    //     appointmentData.userId,
    //     { $addToSet: { appointments: savedAppointment._id } },
    //     { new: true }
    // );

    res.status(200).json({
      success: true,
      message: "Mobile Veterniary Appointment booked successfully",
      data: savedAppointment,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: "An error occurred while booking the appointment",
    });
  }
});
router.post("/book-mobgroom-appointment", async (req, res) => {
  try {
    const appointmentData = req.body;
    console.log(appointmentData);
    // Create a new appointment
    const newAppointment = new mobgroomappModel(appointmentData);
    const savedAppointment = await newAppointment.save();
    // Update the user's appointment array
    // await User.findByIdAndUpdate(
    //     appointmentData.userId,
    //     { $addToSet: { appointments: savedAppointment._id } },
    //     { new: true }
    // );

    res.status(200).json({
      success: true,
      message: "Mobile Grooming Appointment booked successfully",
      data: savedAppointment,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: "An error occurred while booking the appointment",
    });
  }
});
router.post("/grooming-appointment", async (req, res) => {
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

    res.status(200).json({
      success: true,
      message: "Grooming Appointment booked successfully",
      data: savedAppointment,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: "An error occurred while booking the appointment",
    });
  }
});

router.get(
  "/get-openappointments-by-doctor-id",

  async (req, res) => {
    try {
      const doctor = await Doctor.findOne({ userId: req.body.userId });
      const appointments = await OpenAppointment.find({ doctorId: doctor._id });
      // console.log(doctor);
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

router.post("/get-doctor-info-by-id", async (req, res) => {
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

router.post("/get-appointments-by-doctor-id", async (req, res) => {
  try {
    const appointments = await UserappModel.find({
      doctorId: req.body.doctorId,
    });
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
});

router.post("/get-offie-time", async (req, res) => {
  try {
    const OfficeTime = await officetime.findOne({ module: req.body.module });
    console.log(OfficeTime);

    res.status(200).send({
      message: "Office Time Fetched Successfully",
      success: true,
      data: OfficeTime,
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({
      message: "Error in Fetching Office time",
      success: false,
      error,
    });
  }
});

module.exports = router;
