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
const packModel = require("../models/packModel");
const crypto = require("crypto");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const Paymentmodel = require("../models/Paymentmodel");
const nodemailer = require("nodemailer");
const axios = require("axios");
const paytabs = require("paytabs_pt2");

paytabs.setConfig(
  process.env.PAYTAB_PROFILE_ID,
  process.env.PAYTAB_SERVER_KEY,
  process.env.PAYTAB_REGION
);

require("dotenv").config();
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

function generateRandomPassword(length) {
  const charset =
    "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!@#$%^&*()_-+=<>?";
  let password = "";

  for (let i = 0; i < length; i++) {
    const randomIndex = Math.floor(Math.random() * charset.length);
    password += charset[randomIndex];
  }

  return password;
}

router.post("/book-appointment", async (req, res) => {
  try {
    const appointmentData = req?.body;

    // Create a new appointment

    let conditions = [];

    if (req?.body?.email) {
      conditions.push({ email: req?.body?.email });
    }

    if (req?.body?.mobile) {
      conditions.push({ mobile: req?.body?.mobile });
    }

    if (conditions.length === 0) {
      return res.status(400).send({
        message: "No valid search parameters provided",
        success: false,
      });
    }

    const userExists = await User.findOne({ $or: conditions });

    if (userExists) {
      return res.status(400).send({
        message: "User already exists. Login to Continue",
        success: false,
      });
    }
    const newAppointment = new OpenAppointment(appointmentData);
    const savedAppointment = await newAppointment.save();

    const password = generateRandomPassword(10);

    console.log(password);

    const activationToken = crypto.randomBytes(32).toString("hex");
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);
    req.body.password = hashedPassword;

    const newUser = new User({
      email: req?.body?.email,
      mobile: req?.body?.mobile,
      name: `${req?.body?.firstname}${req?.body?.lastname}`,
      password: req?.body?.password,
      username: `${req?.body?.firstname}${req?.body?.lastname}${
        Math.floor(Math.random() * 900) + 100
      }`,
    });
    newUser.activationToken = activationToken;
    await newUser.save();
    const activationLink = `${process.env.APP_URL}activate/${activationToken}`;

    console.log(activationLink);

    const doctor = await Doctor.findOne({ _id: req?.body?.doctorId });
    console.log(req?.body?.service);
    const service = await packModel.findOne({ _id: req?.body?.service });
    let amount = Number(service.price);

    if (req?.body?.module === "veterinary") {
      amount = amount + doctor?.feePerCunsultation;
    }

    await axios
      .post(
        "https://secure.paytabs.com/payment/request",
        {
          profile_id: process.env.PAYTAB_PROFILE_ID,
          tran_type: "sale",
          tran_class: "ecom",

          cart_id: savedAppointment?._id,
          cart_description: service?.subService,
          cart_currency: "AED",
          cart_amount: amount,
          customer_details: {
            name: newUser?.name,
            email: newUser?.email,
            phone: newUser?.mobile,
          },
          shipping_address: {
            name: newUser?.name,
            email: newUser?.email,
            phone: newUser?.mobile,
          },
          callback: `${process.env.APP_URL}/payment-successful`,
          return: `${process.env.APP_URL}/payment-successful`,
        },
        {
          headers: {
            Authorization: process.env.PAYTAB_SERVER_KEY,
          },
        }
      )
      .then((respnse) => {
        console.log(respnse?.data);
        payment = new Paymentmodel({
          userId: req?.body?.userId,
          appointmentId: savedAppointment?._id,
          amount: amount,
          transactionId: respnse?.data?.tran_ref,
          status: "success",
        });

        payment.save();
        res.json({
          success: true,
          message: "Appointment booked successfully",
          data: { savedAppointment, payment, paytab: respnse?.data },
        });
      })
      .catch((err) => console.log(err));

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
      to: req.body.email,
      subject: "Welcome to Petology",
      html: `
      <html>
        <body>
          <p>Hello ${req.body.name},</p>
          <p>Thank you for booking appointment on Your App!</p>
          <p>Please click the following link to activate your account:</p>
          <a href="${activationLink}">Activate Account</a>
          <p>Here is you auto-generated password ${password}</p>
        </body>
      </html>
    `,
    };

    console.log(mailOptions);

    transporter.sendMail(mailOptions, (error, info) => {
      if (error) {
        console.log("Error sending email:", error);
      } else {
        console.log("Email sent:", info.response);
      }
    });

    res.status(200).json({
      success: true,
      message: "Open Appointment booked successfully",
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

router.post("/get-office-time", async (req, res) => {
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

router.post("/get-pack-by-module", async (req, res) => {
  try {
    const packs = await packModel.find({ serviceType: req.body.module });
    console.log(packs);
    res.status(200).send({
      message: "Pack List fetched successfully",
      success: true,
      data: packs,
    });
  } catch (error) {
    console.error(error);
    res.status(500).send({
      message: "Error Fetching Pack list",
      success: false,
      error,
    });
  }
});

module.exports = router;
