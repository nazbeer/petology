const express = require("express");
const router = express.Router();
const nodemailer = require("nodemailer");
const Doctor = require("../models/doctorModel");
const authMiddleware = require("../middlewares/authMiddleware");
const Appointment = require("../models/appointmentModel");
const User = require("../models/userModel");
const PetList = require("../models/petModel");
const OpenAppointment = require("../models/openAppointmentModel");
const Prescription = require("../models/prescriptionModel");
const UserappModel = require("../models/userappModel");

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
    console.log(error)
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
      const appointments = await UserappModel.find({ doctorId: doctor._id });
      // console.log(doctor);
      //     console.log(appointments);
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
    const appointment = await UserappModel.findByIdAndUpdate(appointmentId, {
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
      success: true,
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
router.get("/doctorcount", async (req, res) => {
  try {
    const count = await Doctor.countDocuments();
    res.json({ count });
  } catch (error) {
    console.error("Error counting doctors:", error);
    res.status(500).json({ error: "Server error" });
  }
});

// Route for fetching all pets for a specific user
router.get("/user/:userId/pets", authMiddleware, async (req, res) => {
  try {
    const { userId } = req.params;
    const pets = await PetList.find({ userId });
    res.json({ success: true, data: pets });
  } catch (error) {
    console.error("Error fetching pets:", error);
    res.status(500).json({ success: false, message: "Server error" });
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

router.get(
  "/user/:userId/pet/:petId/appointments",
  authMiddleware,
  async (req, res) => {
    const { userId, petId } = req.params;

    try {
      const appointments = await UserappModel.find({ userId, petId });
      // console.log(appointments);
      res.status(200).json({
        success: true,
        data: appointments,
      });
    } catch (error) {
      console.error(error);
      res.status(500).json({
        success: false,
        message: "An error occurred while fetching appointments.",
      });
    }
  }
);

router.get(
  "/get-openappointments-by-doctor-id",
  authMiddleware,
  async (req, res) => {
    try {
      const doctor = await Doctor.findOne({ userId: req.body.userId });
      const appointments = await OpenAppointment.find({ doctorId: doctor._id });
      //  console.log(doctor);
      // console.log(appointments);
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

router.get("/get-all-users/:id", authMiddleware, async (req, res) => {
  try {
    console.log(req.params.id);
    const appointment = await UserappModel.findOne({
      appointmentId: req.params.id,
    });
    const users = await User.findById({ userId: appointment.userId });
    //const users = await User.find({status:req.body.status});
    res.status(200).send({
      message: "Users list fetched succcessfully",
      success: true,
      data: users,
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({
      message: "Failed to fetch user's details.",
      success: false,
      error,
    });
  }
});
router.get("/get-all-users", authMiddleware, async (req, res) => {
  try {
    const users = await User.find();
    //const users = await User.find({status:req.body.status});
    res.status(200).send({
      message: "Users list fetched succcessfully",
      success: true,
      data: users,
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({
      message: "Failed to fetch user's details.",
      success: false,
      error,
    });
  }
});
router.get("/get-all-approved-doctors", authMiddleware, async (req, res) => {
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
router.get("/doctors/:id", authMiddleware, async (req, res) => {
  try {
    const doctor = await Doctor.findById(req.params.id).exec();
    res.json({ success: true, data: doctor });
  } catch (error) {
    res.status(500).json({ success: false, message: "Error fetching doctor" });
  }
});
router.get("/get-appointment-by-id/:id", authMiddleware, async (req, res) => {
  try {
    const appointment = await UserappModel.findById(req.params._id)
      .populate("users")
      .populate("petlists")
      .exec();
    // console.log(appointment);
    res.json({ success: true, data: appointment });
  } catch (error) {
    res
      .status(500)
      .json({ success: false, message: "Error fetching appointment" });
  }
});
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

    const prescriptionData = {
      appointmentId: appointmentId,
      userId: userId,
      doctorId: doctorId,
      petId: petId,
      prescription,
      description,
      ndate,
      // ntime,
    };

    console.log(userId);

    const appointment = await UserappModel.findOne({ _id: appointmentId });
    const user = await User.findOne({ _id: appointment.userId });
    const doctor = await Doctor.findOne({ _id: doctorId });
    console.log(user.email, doctor.firstName);

    const newPrescription = new Prescription(prescriptionData);
    await newPrescription.save();

    const transporter = nodemailer.createTransport({
      host: "mailslurp.mx",
      port: 2587,
      auth: {
        user: process.env.USER,
        pass: process.env.PASS,
      },
    });
    const mailOptions = {
      from: process.env.EMAIL,
      to: user.email,
      subject: "Appointment Scheduled for Pet Name",
      html: `
      <html>
        <body>
          <p>Hello ${user.name},</p>
          <p>Thank you for scheduling the Appointment!</p>
          <p>The given below are the details for your appointment</p>
          ${
            doctor
              ? `<p>Doctor Name ${doctor.firstName} ${doctor.lastName}</p>`
              : ``
          }
          <p>Appointment Date: ${ndate}</p>
          <p>Appointment Time: ${ntime}</p>
        </body>
      </html>
    `,
    };

    transporter.sendMail(mailOptions, (error, info) => {
      if (error) {
        console.log("Error sending email:", error);
      } else {
        console.log("Email sent:", info.response);
      }
    });

    res.json({ success: true });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

router.get("/get-prescription", authMiddleware, async (req, res) => {
  try {
    // Fetch all prescriptions from the database
    const prescriptions = await Prescription.find({});

    // Send the prescriptions as a JSON response
    res.json({ success: true, data: prescriptions });
  } catch (error) {
    // Handle errors and send an error response
    console.error(`Error fetching prescriptions: ${error.message}`);
    res.status(500).json({ error: "Internal server error" });
  }
});
router.get("/appointments/veterinary", authMiddleware, async (req, res) => {
  try {
    // const moduleType = req.params.module;

    // Fetch appointments for the specified module
    const appointments = await UserappModel.find({ module: "veterinary" });
    // console.log('vdt:',appointments);
    // If appointments are found, you can fetch user details only
    const populatedAppointments = await Promise.all(
      appointments.map(async (appointment) => {
        const userId = appointment.userId;
        const doctorId = appointment.doctorId;
        // Assuming you have a User model for user details
        // console.log('ids', userId, doctorId)
        const user = await User.findOne({ _id: userId });
        const doctor = await Doctor.findOne({ _id: doctorId });
        //  console.log("user:", user);

        return {
          ...appointment.toObject(),
          user,
          doctor,
        };
      })
    );

    // console.log("populated Appointments:", populatedAppointments);
    res.json({ success: true, data: populatedAppointments });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal Server Error" });
  }
});
router.get("/get-appointment-by-id/:id", authMiddleware, async (req, res) => {
  try {
    const appointmentId = req.params.id;

    // Fetch the appointment by ID from the database
    const appointment = await UserappModel.findById(appointmentId);
    // console.log(appointment);
    if (!appointment) {
      return res
        .status(404)
        .json({ success: false, error: "Appointment not found" });
    }

    res.json({ success: true, data: appointment });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

router.post("/get-prescription-by-id", authMiddleware, async (req, res) => {
  try {
    console.log(req.body.id);
    const appointmentId = req.body.id;

    // Fetch the prescription by ID from the database
    const prescription = await Prescription.findOne({
      appointmentId: appointmentId,
    });
    const user = await User.findById(prescription.userId);
    const doctor = await Doctor.findById(prescription.doctorId);
    const appointment = await UserappModel.findById(prescription.appointmentId);

    const info = {
      userName: user?.name,
      doctorName: `${doctor.firstName} ${doctor.lastName}`,
    };
    // console.log("user data appointment", user);
    // prescription.name = user?.name;
    console.log(prescription.appointmentId);
    if (!prescription) {
      return res
        .status(404)
        .json({ success: false, error: "Prescription not found" });
    }
    const data = {
      appointmentData: appointment,
      id: prescription._id,
      appointmentId: appointment?.customId,
      userName: user?.name,
      doctorName: `${doctor?.firstName} ${doctor?.lastName}`,
      pet: appointment?.pet,
      prescription: prescription?.prescription,
      description: prescription?.description,
      ndate: prescription?.ndate,
      createdAt: prescription?.createdAt,
      updatedAt: prescription?.updatedAt,
    };
    console.log(data);
    res.json({ success: true, data: data });
  } catch (error) {
    console.log(error);
    res
      .status(500)
      .send({ message: "Error getting Prescription", success: false, error });
  }
});
module.exports = router;
