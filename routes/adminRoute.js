const express = require("express");
const router = express.Router();
const nodemailer = require("nodemailer");
const User = require("../models/userModel");
const Doctor = require("../models/doctorModel");
const Appointment = require("../models/appointmentModel");
const Pet = require("../models/petModel");
const multer = require("multer");
const upload = multer({ dest: "uploads/" });
const OpenAppointment = require("../models/openAppointmentModel");
const authMiddleware = require("../middlewares/authMiddleware");
const breaktimeModel = require("../models/breaktimeModel");
const packModel = require("../models/packModel");
const MobileVetApp = require("../models/mobvetappModel");
const HistoryModel = require("../models/historyModel");
const DoctorLeave = require("../models/doctorLeaveModel");
const UserappModel = require("../models/userappModel");
const Paymentmodel = require("../models/Paymentmodel");
const officetime = require("../models/OfficeTimeModel");
const fs = require("fs");
const path = require("path");
const crypto = require("crypto");
const bcrypt = require("bcryptjs");
require("dotenv").config();

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "uploads/"); // Directory where files will be stored
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    cb(null, uniqueSuffix + path.extname(file.originalname));
  },
});

router.get("/get-all-doctors", authMiddleware, async (req, res) => {
  try {
    const doctors = await Doctor.find({}); // Add the status filter
    res.status(200).send({
      message: "Approved doctors fetched successfully",
      success: true,
      data: doctors,
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({
      message: "Error fetching approved doctors",
      success: false,
      error,
    });
  }
});

router.get("/get-all-groomer", authMiddleware, async (req, res) => {
  try {
    const groomers = await User.find({ isGroomer: true }); // Add the status filter
    res.status(200).send({
      message: "Groomers fetched successfully",
      success: true,
      data: groomers,
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({
      message: "Error fetching groomers",
      success: false,
      error,
    });
  }
});

router.get("/get-all-reception", authMiddleware, async (req, res) => {
  try {
    const groomers = await User.find({ isNurse: true }); // Add the status filter
    res.status(200).send({
      message: "Receptionistd fetched successfully",
      success: true,
      data: groomers,
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({
      message: "Error Fetching Receptionistd",
      success: false,
      error,
    });
  }
});

router.get("/get-all-approved-doctors", authMiddleware, async (req, res) => {
  try {
    const doctors = await Doctor.find({ status: "approved" }); // Add the status filter
    res.status(200).send({
      message: "Approved doctors fetched successfully",
      success: true,
      data: doctors,
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({
      message: "Error fetching approved doctors",
      success: false,
      error,
    });
  }
});

router.get(
  "/get-all-approved-doctors-assign",
  authMiddleware,
  async (req, res) => {
    try {
      const doctorso = await Doctor.find({ status: "approved" }); // Add the status filter
      //   console.log('responsenaz:', doctorso);
      res.status(200).send({
        message: "Approved doctors fetched successfully",
        success: true,
        data: doctorso,
      });
    } catch (error) {
      console.log(error);
      res.status(500).send({
        message: "Error fetching approved doctors",
        success: false,
        error,
      });
    }
  }
);

router.post(
  "/assign-doctor-to-appointment",
  authMiddleware,
  async (req, res) => {
    try {
      const { appointmentId, doctorId } = req.body;

      // Find the appointment by ID and update the doctorId
      const updatedAppointment = await UserappModel.findByIdAndUpdate(
        appointmentId,
        { doctorId },
        { new: true } // Return the updated appointment
      );

      if (!updatedAppointment) {
        return res
          .status(404)
          .json({ success: false, message: "Appointment not found" });
      }

      // Update the doctor's appointments array
      await Doctor.findByIdAndUpdate(
        doctorId,
        { $addToSet: { appointments: appointmentId } },
        { new: true }
      );

      res.status(200).json({
        success: true,
        message: "Doctor assigned successfully",
        data: updatedAppointment,
      });
    } catch (error) {
      console.error(error);
      res.status(500).json({
        success: false,
        message: "An error occurred while assigning the doctor",
      });
    }
  }
);

router.post("/reschudle-appointment", authMiddleware, async (req, res) => {
  try {
    const { appointmentId, doctorId, time, date } = req.body;

    // Find the appointment by ID and update the doctorId
    const updatedAppointment = await UserappModel.findByIdAndUpdate(
      appointmentId,
      { doctorId, time, date },
      { new: true } // Return the updated appointment
    );

    if (!updatedAppointment) {
      return res
        .status(404)
        .json({ success: false, message: "Appointment not found" });
    }

    // Update the doctor's appointments array
    await Doctor.findByIdAndUpdate(
      doctorId,
      { $addToSet: { appointments: appointmentId } },
      { new: true }
    );

    res.status(200).json({
      success: true,
      message: "Appointment reschduled successfully",
      data: updatedAppointment,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: "An error occurred while reschuling the appointment",
    });
  }
});

router.post("/reschudle-open-appointment", authMiddleware, async (req, res) => {
  try {
    const { appointmentId, doctorId, time, date } = req.body;

    // Find the appointment by ID and update the doctorId
    const updatedAppointment = await OpenAppointment.findByIdAndUpdate(
      appointmentId,
      { doctorId, time, date },
      { new: true } // Return the updated appointment
    );

    if (!updatedAppointment) {
      return res
        .status(404)
        .json({ success: false, message: "Appointment not found" });
    }

    // Update the doctor's appointments array
    await Doctor.findByIdAndUpdate(
      doctorId,
      { $addToSet: { appointments: appointmentId } },
      { new: true }
    );

    res.status(200).json({
      success: true,
      message: "Appointment reschduled successfully",
      data: updatedAppointment,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: "An error occurred while reschuling the appointment",
    });
  }
});

router.post("/reschudle-appointment-time", authMiddleware, async (req, res) => {
  try {
    const { appointmentId, doctorId, time, date } = req.body;

    // Find the appointment by ID and update the doctorId
    const updatedAppointment = await UserappModel.findByIdAndUpdate(
      appointmentId,
      { time, date },
      { new: true } // Return the updated appointment
    );

    if (!updatedAppointment) {
      return res
        .status(404)
        .json({ success: false, message: "Appointment not found" });
    }

    // Update the doctor's appointments array
    await Doctor.findByIdAndUpdate(
      doctorId,
      { $addToSet: { appointments: appointmentId } },
      { new: true }
    );

    res.status(200).json({
      success: true,
      message: "Appointment reschduled  successfully",
      data: updatedAppointment,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: "An error occurred while reschuling the appointment",
    });
  }
});

router.get("/doctordetails/:doctorId", async (req, res) => {
  //  console.log(doctorInfo);
  const { doctorId } = req.params;
  try {
    const doctor = await Doctor.findById(doctorId._id);
    res.status(200).json({
      success: true,
      data: doctor,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: "An error occurred while fetching doctor details.",
    });
  }
});
router.get("/get-all-mobvet-appointments", authMiddleware, async (req, res) => {
  try {
    const mobvetapplist = await MobileVetApp.find({});

    res.status(200).send({
      message: "Appointment List fetched successfully",
      success: true,
      data: mobvetapplist,
    });
  } catch (error) {
    console.error("Error in getting all mobile vet appointments");
    res.status(500).send({
      message: "Error fetching All Appointments",
      success: false,
      error,
    });
  }
});
router.get(
  "/get-all-mobgroom-appointments",
  authMiddleware,
  async (req, res) => {
    try {
      const mobgroomapplist = await UserappModel.find({});
      console.log(mobgroomapplist);
      res.status(200).send({
        message: "Appointment List fetched successfully",
        success: true,
        data: mobgroomapplist,
      });
    } catch (error) {
      console.error("Error in getting all grooming appointments");
      res.status(500).send({
        message: "Error Fetching Grooming Appointment list",
        success: false,
        error,
      });
    }
  }
);
router.post("/get-all-open-appointments", async (req, res) => {
  console.log(req?.body);
  try {
    const appointmentList = await OpenAppointment.find({
      module: req?.body?.module,
    })
      .populate("doctor", "name specialization") // Assuming 'doctor' field is a reference to User model
      .exec();
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

router.get("/get-pets-by-user-id/:userId", authMiddleware, async (req, res) => {
  try {
    const pets = await Pet.find({ userId: req.body.userId });
    res.status(200).send({
      message: "Appointments fetched successfully",
      success: true,
      data: pets,
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
router.get("/get-all-appointments", authMiddleware, async (req, res) => {
  try {
    const appointmentList = await UserappModel.find({})
      .populate("doctors", "name") // Assuming 'doctor' field is a reference to User model
      .populate("petlists", "name") // Assuming 'pet' field is a reference to Pet model
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

router.post(
  "/get-all-module-appointments",
  authMiddleware,
  async (req, res) => {
    try {
      const appointmentList = await UserappModel.find({
        module: req?.body?.module,
      });
      const appointmentId = appointmentList.map((item) => item._id);
      const userId = appointmentList.map((item) => item.userId);
      const doctorId = appointmentList.map((item) => item.doctorId);
      const users = await User.find(
        { _id: { $in: userId } },
        { name: 1, _id: 1 }
      );
      const doctors = await Doctor.find(
        { _id: { $in: doctorId } },
        { firstName: 1, lastName: 1, _id: 1, specialization: 1, status: 1 }
      );
      const payments = await Paymentmodel.find({
        appointmentId: { $in: appointmentId },
      });
      const combinedList = [];

      // Loop through list1 and add objects from list2 and list3 based on commonField
      appointmentList.forEach((obj1) => {
        // Find matching objects in list2 based on commonField
        const matchingObj2 = users.find(
          (obj2) => obj2._id.toString() === obj1.userId
        );

        // Find matching objects in list3 based on commonField
        const matchingObj3 = doctors.find(
          (obj3) => obj3._id.toString() === obj1.doctorId
        );
        const matchingObj4 = payments.find(
          (obj4) => obj4.appointmentId === obj1._id.toString()
        );
        console.log(matchingObj2);
        // Combine the objects into a new object and push it to the result array
        combinedList.push({
          appointment: obj1,
          user: matchingObj2,
          doctor: matchingObj3,
          payment: matchingObj4,
        });
      });

      res.status(200).send({
        message: "Appointment List fetched successfully",
        success: true,
        data: combinedList,
      });
    } catch (error) {
      console.log(error);
      res.status(500).send({
        message: "Error fetching All Appointments",
        success: false,
        error,
      });
    }
  }
);

router.post("/create-service", authMiddleware, async (req, res) => {
  const { serviceType, serviceName, subServiceName, price, pet, size } =
    req.body;

  try {
    const service = await packModel.create({
      serviceType: serviceType,
      name: serviceName,
      subService: subServiceName,
      price: price,
      pet: pet,
      size: size,
    });
    await service.save();
    res
      .status(201)
      .json({ success: true, message: "Service added successfully" });
  } catch (error) {
    if (error.code === 11000) {
      res
        .status(400)
        .json({ success: false, message: "Service name already exists" });
    } else {
      res.status(500).json({ success: false, message: "An error occurred" });
    }
  }
});

// ...rest of the code

router.get("/subservices", authMiddleware, async (req, res) => {
  try {
    //    const subServices = await packModel.find({}, { _id: 0, subService: 1 });
    const subServices = await packModel.find({});
    res.status(200).json({ success: true, data: subServices });
  } catch (error) {
    res.status(500).json({ success: false, message: "An error occurred" });
  }
});

router.put("/edit-subservice/:id", async (req, res) => {
  try {
    const updatedSubService = await packModel.findByIdAndUpdate(
      req.params.id,
      {
        subService: req.body.subService,
        serviceType: req.body.serviceType,
        name: req.body.serviceName,
        status: req.body.status,
        price: req.body.price,
        pet: req.body.pet,
        size: req.body.size,
      },
      { new: true }
    );

    res.status(200).json({ success: true, data: updatedSubService });
  } catch (error) {
    res
      .status(500)
      .json({ success: false, message: "Error updating sub-service" });
  }
});

// Delete sub-service
router.delete("/delete-subservice/:id", async (req, res) => {
  try {
    await packModel.findByIdAndDelete(req.params.id);

    res
      .status(200)
      .json({ success: true, message: "Sub-service deleted successfully" });
  } catch (error) {
    res
      .status(500)
      .json({ success: false, message: "Error deleting sub-service" });
  }
});

router.post("/set-break-time", async (req, res) => {
  const breaktime = {
    doctorId: req.body.doctorId,
    duration: req.body.duration,
  };
  const newBreaktime = new breaktimeModel(breaktime);
  await newBreaktime
    .save()
    .then((resss) => {
      console.log(resss);
      return res
        .status(200)
        .json({ success: true, message: "Break Time added successfully" });
    })
    .catch((errr) => {
      console.log(errr);
      return res.status(500).json({
        success: false,
        message: "An error occurred while adding Break Time",
      });
    });
  return;
});
router.get("/get-all-breaktimes", async (req, res) => {
  try {
    const breaktimes = await breaktimeModel.find();
    const breaktimesWithDoctors = await Promise.all(
      breaktimes.map(async (breaktime) => {
        const doctor = await Doctor.findById(breaktime.doctorId);
        // console.log(doctor);
        return {
          _id: breaktime._id,
          doctorId: breaktime.doctorId,
          duration: breaktime.duration,
          // doctorName: doctor ? doctor.firstName: "Unknown Doctor",
          doctorName: doctor.firstName + " " + doctor.lastName,
        };
      })
    );
    console.log(breaktimesWithDoctors);
    res.json(breaktimesWithDoctors);
  } catch (error) {
    console.error("Error fetching break times:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

router.delete("/delete-breaktime/:id", async (req, res) => {
  try {
    const breaktime = await breaktimeModel.findById(req.params.id);

    if (!breaktime) {
      return res.status(404).json({ error: "Break time not found" });
    }

    await breaktime.remove();

    res.json({ success: true, message: "Break time record deleted" });
  } catch (error) {
    console.error("Error deleting break time record:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});
router.get("/count-records", authMiddleware, async (req, res) => {
  try {
    //const db = client.db(petology);
    const collection = db.collection("doctors"); // Replace with your collection name
    console.log(collection);
    // Count the documents in the collection
    const count = await collection.count();
    console.log(count);
    res.json({ count });
  } catch (error) {
    console.error("Error counting documents:", error);
    res.status(500).json({ error: "Server error" });
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

router.post("/change-groomer-status", authMiddleware, async (req, res) => {
  try {
    const { groomerId, status } = req.body;
    console.log(groomerId, status);
    const user = await User.findByIdAndUpdate(groomerId, {
      status,
    });
    user.username = user?.name;
    const unseenNotifications = user.unseenNotifications;
    unseenNotifications.push({
      type: "new-groomer-request-changed",
      message: `Your Groomer account has been ${status}`,
      onClickPath: "/notifications",
    });
    await user.save();

    res.status(200).send({
      message: "Groomer status updated successfully",
      success: true,
      data: user,
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({
      message: "Error applying groomer account",
      success: false,
      error,
    });
  }
});

router.post("/change-reception-status", authMiddleware, async (req, res) => {
  try {
    const { receptionId, status } = req.body;
    console.log(receptionId, status);
    const user = await User.findByIdAndUpdate(receptionId, {
      status,
    });
    user.username = user?.name;
    const unseenNotifications = user.unseenNotifications;
    unseenNotifications.push({
      type: "new-receptionist-request-changed",
      message: `Your Reception account has been ${status}`,
      onClickPath: "/notifications",
    });
    await user.save();

    res.status(200).send({
      message: "Receptionist status updated successfully",
      success: true,
      data: user,
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({
      message: "Error applying Receptionist account",
      success: false,
      error,
    });
  }
});
router.post(
  "/change-appointment-status/:id",
  authMiddleware,
  async (req, res) => {
    try {
      const { id } = req.params;
      const { status } = req.body;

      const updatedAppointment = await UserappModel.findByIdAndUpdate(
        id,
        { status }, // Update the status field
        { new: true } // Return the updated appointment
      );

      if (!updatedAppointment) {
        return res
          .status(404)
          .json({ success: false, message: "Appointment not found" });
      }

      res.status(200).json({
        success: true,
        message: "Appointment status changed successfully",
        data: updatedAppointment,
      });
    } catch (error) {
      console.error(error);
      res.status(500).json({
        success: false,
        message: "An error occurred while changing appointment status",
      });
    }
  }
);

router.post("/change-open-appointment-status/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    const updatedAppointment = await OpenAppointment.findByIdAndUpdate(
      id,
      { status }, // Update the status field
      { new: true } // Return the updated appointment
    );

    if (!updatedAppointment) {
      return res
        .status(404)
        .json({ success: false, message: "Appointment not found" });
    }

    res.status(200).json({
      success: true,
      message: "Appointment status changed successfully",
      data: updatedAppointment,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: "An error occurred while changing appointment status",
    });
  }
});

router.post("/apply-doctor", async (req, res) => {
  try {
    // Extract user data from the request body
    const {
      firstName,
      lastName,
      email,
      phoneNumber,
      website,
      address,
      specialization,
      experience,
      feePerCunsultation,
      shift,
      petId,
    } = req.body;

    // Create a new user with isDoctor set to true
    const user = new User({
      name: `${firstName} ${lastName}`,
      email: `${email}`,
      password: `$2a$10$Et3V2e5GdR3eBOoXwa0suOObPmXjxHPwtvCkRJoxVaZP3hbGK2pUS`, // You
      mobile: `${phoneNumber}`,
      isDoctor: true,
    });

    // Save the user to the database
    await user.save();

    // Create a new doctor with the associated user ID
    const doctor = new Doctor({
      user: user._id,
      speciality,
    });

    // Save the doctor to the database
    await doctor.save();

    res.status(201).json({
      success: true,
      message: "Doctor account created successfully",
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: "An error occurred while creating the doctor account",
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

router.post("/apply-doctor-account", authMiddleware, async (req, res) => {
  console.log(req?.body)
  try {
    //  const { firstName, lastName, email } = req.body;
    let conditions = [];

    if (req?.body?.email) {
      conditions.push({ email: req?.body?.email });
    }

    if (req?.body?.mobile) {
      conditions.push({ mobile: req?.body?.phoneNumber });
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

    const password = generateRandomPassword(10);

    console.log(password);

    const activationToken = crypto.randomBytes(32).toString("hex");
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);
    req.body.password = hashedPassword;

    //console.log(newdoctor);

    const adminUser = await User.findOne({ isAdmin: true });
    const newUser = new User({
      email: req?.body?.email,
      mobile: req?.body?.phoneNumber,
      name: `${req?.body?.firstName}${req?.body?.lastName}`,
      password: req?.body?.password,
      username: `${req?.body?.firstName}${req?.body?.lastName}${
        Math.floor(Math.random() * 900) + 100
      }`,
      isDoctor: true,
      isUser: false,
    });

    newUser.activationToken = activationToken;
    await newUser.save();

    const newdoctor = new Doctor({
      firstName: req?.body?.firstName,
      lastName: req?.body?.lastName,
      phoneNumber: req?.body?.phoneNumber,
      website: req?.body?.website,
      address: req?.body?.address,
      specialization: req?.body?.specialization,
      experience: req?.body?.experience,
      feePerCunsultation: req?.body?.feePerCunsultation,
      shift: req?.body?.shift,
      breakTime: req?.body?.breakTime,
      status: "pending",
      userId: newUser?._id,
    });
    newdoctor.save();
    const activationLink = `${process.env.APP_URL}activate/${activationToken}`;

    console.log(activationLink);
    const unseenNotifications = adminUser.unseenNotifications;
    unseenNotifications.push({
      type: "new-doctor-request",
      message: `${newdoctor.firstName} ${newdoctor.lastName} has applied for a doctor account`,
      data: {
        doctorId: newdoctor._id,
        name: newdoctor.firstName + " " + newdoctor.lastName,
      },
      onClickPath: "/admin/doctorslist",
    });

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
    await User.findByIdAndUpdate(adminUser._id, { unseenNotifications });
    res.status(200).send({
      success: true,
      message: "Doctor account applied successfully",
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

router.post("/book-appointment", authMiddleware, async (req, res) => {
  try {
    req.body.status = "pending";
    req.body.date = moment(req.body.date, "DD-MM-YYYY").toISOString();
    req.body.time = moment(req.body.time, "HH:mm").toISOString();
    const newAppointment = new Appointment(req.body);
    // console.log(req.body);
    await newAppointment.save();
    //pushing notification to doctor based on his userid
    const user = await User.findOne({ _id: req.body.doctorInfo.userId });
    user.unseenNotifications.push({
      type: "new-appointment-request",
      message: `A new appointment request has been made by ${req.body.userInfo.name}`,
      onClickPath: "/doctor/appointments",
    });
    await user.save();
    res.status(200).send({
      message: "Appointment booked successfully",
      success: true,
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({
      message: "Error booking appointment",
      success: false,
      error,
    });
  }
});

router.post("/check-booking-avilability", authMiddleware, async (req, res) => {
  try {
    const date = moment(req.body.date, "DD-MM-YYYY").toISOString();
    const fromTime = moment(req.body.time, "HH:mm")
      .subtract(1, "hours")
      .toISOString();
    const toTime = moment(req.body.time, "HH:mm").add(1, "hours").toISOString();
    const doctorId = req.body.doctorId;
    const appointments = await UserappModel.find({
      doctorId,
      date,
      time: { $gte: fromTime, $lte: toTime },
    });
    //console.log(appointments);
    if (appointments.length > 0) {
      return res.status(200).send({
        message: "Appointments not available",
        success: false,
      });
    } else {
      return res.status(200).send({
        message: "Appointments available",
        success: true,
      });
    }
  } catch (error) {
    console.log(error);
    res.status(500).send({
      message: "Error booking appointment",
      success: false,
      error,
    });
  }
});

router.get("/get-appointments-by-user-id", authMiddleware, async (req, res) => {
  try {
    const appointments = await UserappModel.find({ userId: req.body.userId });
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

router.post("/update-doctor/:doctorId", authMiddleware, async (req, res) => {
  try {
    const { doctorId } = req.params;
    const updatedFields = req.body;

    const doctor = await Doctor.findById(doctorId);
    if (!doctor) {
      return res
        .status(404)
        .json({ success: false, message: "Doctor not found" });
    }

    // Update doctor fields
    for (const [key, value] of Object.entries(updatedFields)) {
      doctor[key] = value;
    }

    await doctor.save();

    return res.json({
      success: true,
      message: "Doctor information updated successfully",
    });
  } catch (error) {
    console.error(error);
    return res
      .status(500)
      .json({ success: false, message: "Internal server error" });
  }
});

router.post("/update-groomer/:userId", authMiddleware, async (req, res) => {
  try {
    console.log(req.params);
    const { userId } = req.params;
    req.body.username = req?.body?.name
    const updatedFields = req.body;

    const groomer = await User.findById(userId);
    if (!groomer) {
      return res
        .status(404)
        .json({ success: false, message: "Groomer not found" });
    }

    // Update doctor fields
    for (const [key, value] of Object.entries(updatedFields)) {
      groomer[key] = value;
    }

    await groomer.save();

    return res.json({
      success: true,
      message: "Groomer information updated successfully",
    });
  } catch (error) {
    console.error(error);
    return res
      .status(500)
      .json({ success: false, message: "Internal server error" });
  }
});

router.post("/update-reception/:userId", authMiddleware, async (req, res) => {
  try {
    console.log(req.params);
    const { userId } = req.params;
    req.body.username = req?.body?.name
    const updatedFields = req.body;

    const reception = await User.findById(userId);
    if (!reception) {
      return res
        .status(404)
        .json({ success: false, message: "Reception not found" });
    }

    for (const [key, value] of Object.entries(updatedFields)) {
      reception[key] = value;
    }

    await reception.save();

    return res.json({
      success: true,
      message: "Reception information updated successfully",
    });
  } catch (error) {
    console.error(error);
    return res
      .status(500)
      .json({ success: false, message: "Internal server error" });
  }
});
router.get("/get-admin-profile/:userId", authMiddleware, async (req, res) => {
  try {
    const { userId } = req.params;
    // console.log(userId);
    const admin = await User.findById(userId).select("-password");
    if (!admin) {
      return res
        .status(404)
        .json({ success: false, message: "Admin not found" });
    }
    return res.json({ success: true, data: admin });
  } catch (error) {
    console.error(error);
    return res
      .status(500)
      .json({ success: false, message: "Internal server error" });
  }
});

// Reset admin password by adminId
router.post(
  "/reset-admin-password/:userId",
  authMiddleware,
  async (req, res) => {
    try {
      const { userId } = req.params;
      const { newPassword, confirmPassword } = req.body;

      if (newPassword !== confirmPassword) {
        return res
          .status(400)
          .json({ success: false, message: "Passwords do not match" });
      }

      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash(newPassword, salt);

      await User.findByIdAndUpdate(adminId, { password: hashedPassword });

      return res.json({
        success: true,
        message: "Password reset successfully",
      });
    } catch (error) {
      console.error(error);
      return res
        .status(500)
        .json({ success: false, message: "Internal server error" });
    }
  }
);

// Edit Pet
router.put("/edit-pet/:id", async (req, res) => {
  try {
    const petId = req.params.id;
    const updatedPet = req.body; // Update pet data

    const result = await Pet.findByIdAndUpdate(petId, updatedPet, {
      new: true,
    });

    if (!result) {
      return res.status(404).json({ success: false, message: "Pet not found" });
    }

    res.status(200).json({
      success: true,
      message: "Pet updated successfully",
      data: result,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: "Internal server error" });
  }
});

// Delete Pet
router.delete("/delete-pet/:id", async (req, res) => {
  try {
    const petId = req.params.id;

    const result = await Pet.findByIdAndDelete(petId);

    if (!result) {
      return res.status(404).json({ success: false, message: "Pet not found" });
    }

    res
      .status(200)
      .json({ success: true, message: "Pet deleted successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: "Internal server error" });
  }
});

router.get("/history/:userId", async (req, res) => {
  try {
    const userId = req.params.userId;
    const historyRecords = await HistoryModel.find({ userId });
    const populatedAppointments = await Promise.all(
      historyRecords.map(async (historyRecord) => {
        //  const doctorId = appointment.doctorId;
        // Assuming you have a User model for user details
        const user = await User.findOne({ _id: userId });
        const pet = await User.findOne({ userId: userId });
        //   const doctor = await Doctor.findOne({ _id: doctorId });
        //  console.log("user:", user);
        return {
          ...historyRecord.toObject(),
          user,
          pet,
          //  doctor
        };
      })
    );
    res.json({ success: true, data: populatedAppointments });
  } catch (error) {
    console.error("Error fetching history records:", error);
    res.status(500).json({ success: false, message: "Server error" });
  }
});

// Upload user history documents
router.post(
  "/upload-history/:userId",
  authMiddleware,
  upload.array("files"),
  async (req, res) => {
    try {
      const { userId } = req.params;

      for (let i = 0; i < req.files.length; i++) {
        const file = req.files[i];
        const filePath = "/uploads/" + file.filename;
        // This is the relative path to be saved
        //console.log(filePath);
        // Save the uploaded file's information to MongoDB
        const historyRecord = new HistoryModel({
          userId,
          // document: {
          //   path: filePath,
          //   originalName: file.originalname,
          //   extension: path.extname(file.originalname)
          // }
          documentPath: filePath,
        });
        const sourceImagePath = req?.files[i].path;
        const destinationImagePath = `${path.resolve(
          __dirname,
          ".."
        )}/uploads/${req?.files[i].filename}`; // Replace with the destination image path

        console.log(req?.files[i]);
        console.log(sourceImagePath, destinationImagePath);

        fs.readFile(sourceImagePath, (err, data) => {
          if (err) {
            console.error("Error reading source image:", err);
          } else {
            // Write the image data to the destination path
            fs.writeFile(destinationImagePath, data, (err) => {
              if (err) {
                res.status(500).json({ error: "Server error" });
              } else {
                console.log("Image copied successfully!");
              }
            });
          }
        });
        console.log("api ", historyRecord);
        await historyRecord.save();
      }

      res.status(200).json({
        success: true,
        message: "Files uploaded and saved successfully",
      });
    } catch (error) {
      console.error("Error uploading and processing files:", error);
      res.status(500).json({
        success: false,
        message: "Error uploading and processing files",
      });
    }
  }
);

// Delete user history record by ID
router.delete("/history/:recordId", async (req, res) => {
  try {
    const recordId = req.params.recordId;
    await HistoryModel.findByIdAndDelete(recordId);
    res.json({ success: true, message: "Record deleted successfully" });
  } catch (error) {
    console.error("Error deleting record:", error);
    res.status(500).json({ success: false, message: "Server error" });
  }
});
router.post("/set-doctor-leave", authMiddleware, async (req, res) => {
  try {
    const { doctorId, startDate, endDate } = req.body;
    const leave = new DoctorLeave({
      doctorId,
      startDate,
      endDate,
    });
    await leave.save();
    res
      .status(200)
      .json({ success: true, message: "Doctor leave set successfully" });
  } catch (error) {
    console.error(error);
    res
      .status(500)
      .json({ success: false, message: "Error setting doctor leave" });
  }
});
router.get("/get-doctor-leaves/:doctorId", async (req, res) => {
  try {
    const doctorId = req.params.doctorId;

    // Fetch leaves using the DoctorLeave model based on the doctorId
    const leaves = await DoctorLeave.find({ doctorId });

    res.json({ success: true, data: leaves });
  } catch (error) {
    console.error("Error fetching doctor leaves:", error);
    res
      .status(500)
      .json({ success: false, message: "Error fetching doctor leaves" });
  }
});

router.get("/get-all-vet-packs", authMiddleware, async (req, res) => {
  try {
    const vet = await packModel.find({ serviceType: "Veterinary" });
    console.log(vet);
    res.status(200).send({
      message: "Veterinary Pack List fetched successfully",
      success: true,
      data: vet,
    });
  } catch (error) {
    console.error(error);
    res.status(500).send({
      message: "Error Fetching Veterinary Pack list",
      success: false,
      error,
    });
  }
});

router.get("/get-all-packs", authMiddleware, async (req, res) => {
  try {
    const vet = await packModel.find();
    console.log(vet);
    res.status(200).send({
      message: "Pack List fetched successfully",
      success: true,
      data: vet,
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

router.get("/get-all-groom-packs", authMiddleware, async (req, res) => {
  try {
    const groom = await packModel.find({ serviceType: "Grooming" });
    console.log(groom);
    res.status(200).send({
      message: "Grooming Pack List fetched successfully",
      success: true,
      data: groom,
    });
  } catch (error) {
    console.error("Error in getting all Grooming packs");
    res.status(500).send({
      message: "Error Fetching Grooming Pack list",
      success: false,
      error,
    });
  }
});

router.get("/get-all-pay", authMiddleware, async (req, res) => {
  try {
    const payments = await Paymentmodel.find();

    const populatedAppointments = await Promise.all(
      payments.map(async (payment) => {
        //  const doctorId = appointment.doctorId;
        // Assuming you have a User model for user details
        const user = await User.findOne({ _id: payment.userId });
        let appointment;
        console.log(payment.openAppointment);
        if (payment.openAppointment) {
          appointment = await OpenAppointment.findOne({
            _id: payment.appointmentId,
          });
        } else {
          appointment = await UserappModel.findOne({
            _id: payment.appointmentId,
          });
        }

        //   const doctor = await Doctor.findOne({ _id: doctorId });
        //  console.log("user:", user);
        return {
          ...payment.toObject(),
          user,
          appointment,
          //  doctor
        };
      })
    );

    console.log(populatedAppointments);

    res.status(200).send({
      message: "Payment Fetched Successfully",
      success: true,
      data: populatedAppointments,
    });
  } catch (error) {
    console.log(error);
    res
      .status(500)
      .send({ message: "Error in Fetching Payment", success: false, error });
  }
});

router.post("/offie-time", authMiddleware, async (req, res) => {
  try {
    const existingOfficeTime = await officetime.findOne({
      module: req.body.module,
    });
    console.log(existingOfficeTime);
    if (existingOfficeTime) {
      existingOfficeTime.starttime1 = req.body.starttime1;
      existingOfficeTime.endtime1 = req.body.endtime1;
      existingOfficeTime.starttime2 = req.body.starttime2;
      existingOfficeTime.endtime2 = req.body.endtime2;
      existingOfficeTime.break = req.body.break;

      await existingOfficeTime.save();
    } else {
      const time = new officetime(req.body);
      await time.save();
    }

    res.status(200).send({
      message: "Office Time Added Successfully",
      success: true,
      data: existingOfficeTime,
    });
  } catch (error) {
    console.log(error);
    res
      .status(500)
      .send({ message: "Error in Adding Office time", success: false, error });
  }
});

router.post("/get-office-time", authMiddleware, async (req, res) => {
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

router.get("/approved-appointment-count", authMiddleware, async (req, res) => {
  try {
    const data = await UserappModel.findOne({
      status: "approved",
    }).countDocuments();
    console.log(data);

    res.status(200).send({
      message: "Approved appointments counted Successfully",
      success: true,
      data: data,
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({
      message: "Error in Counting Approved appointments",
      success: false,
      error,
    });
  }
});

router.get("/pending-appointment-count", authMiddleware, async (req, res) => {
  try {
    const data = await UserappModel.findOne({
      status: "pending",
    }).countDocuments();
    console.log(data);

    res.status(200).send({
      message: "Pending appointments counted Successfully",
      success: true,
      data: data,
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({
      message: "Error in Counting Pending appointments",
      success: false,
      error,
    });
  }
});

router.get("/closed-appointment-count", authMiddleware, async (req, res) => {
  try {
    const data = await UserappModel.findOne({
      status: "closed",
    }).countDocuments();
    console.log(data);

    res.status(200).send({
      message: "Closed appointments counted Successfully",
      success: true,
      data: data,
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({
      message: "Error in Counting Closed appointments",
      success: false,
      error,
    });
  }
});

router.post("/cancel-appointment-holiday", authMiddleware, async (req, res) => {
  try {
    const { date } = req.body;
    console.log(date);

    const filter = { date: { $in: date } };
    // Find the appointment by ID and update the doctorId
    const updatedAppointment = await UserappModel.updateMany(
      filter,
      { status: "blocked" },
      { new: true } // Return the updated appointment
    );

    if (!updatedAppointment) {
      return res
        .status(404)
        .json({ success: false, message: "Appointment not found" });
    }

    console.log(updatedAppointment);

    const appointmens = await UserappModel.find(filter);

    console.log(appointmens);

    const userID = appointmens.map((item) => item.userId);
    console.log(userID);

    const users = await User.find(
      { _id: { $in: userID } },
      { name: 1, _id: 1, email: 1 }
    );

    // Create an empty result array
    const combinedList = [];

    // Loop through list1 and add objects from list2 and list3 based on commonField
    appointmens.forEach((obj1) => {
      // Find matching objects in list2 based on commonField
      const matchingObj2 = users.find(
        (obj2) => obj2._id.toString() === obj1.userId
      );

      // Combine the objects into a new object and push it to the result array
      combinedList.push({
        appointmen: obj1,
        user: matchingObj2, // Use {} as a default in case there is no match
      });
    });

    console.log(combinedList);

    console.log(process.env.USER, process.env.EMAIL, process.env.PASS);

    const transporter = nodemailer.createTransport({
      host: "mailslurp.mx",
      port: 2587,
      auth: {
        user: process.env.USER,
        pass: process.env.PASS,
      },
    });

    async function sendEmail(combinedList) {
      console.log(combinedList?.user?.email);
      const mailOptions = {
        from: process.env.EMAIL,
        to: combinedList?.user?.email,
        subject: "Appointment Cancelled",
        html: `
      <html>
        <body>
          <p>Hello ${combinedList?.user?.name},</p>
          <p>We are sorry to tell you that your appointment ${combinedList?.appointment?.appointmentId} has been cancelled due to upcoming holiday on ${date}</p>
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
    }

    combinedList.forEach(sendEmail);

    res.status(200).json({
      success: true,
      message: "Appointment Cancelled successfully",
      data: updatedAppointment,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: "An error occurred while cancelling the appointment",
    });
  }
});
module.exports = router;
