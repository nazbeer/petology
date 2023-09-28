const express = require("express");
const router = express.Router();
const User = require("../models/userModel");
const Doctor = require("../models/doctorModel");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const authMiddleware = require("../middlewares/authMiddleware");
const Appointment = require("../models/appointmentModel");
const moment = require("moment");
const Pet = require("../models/petModel");
const OpenAppointment = require("../models/openAppointmentModel");
const nodemailer = require("nodemailer");
const UserappModel = require("../models/userappModel");
const packModel = require("../models/packModel");
require("dotenv").config();

const crypto = require("crypto");
const mongoose = require("mongoose");
const Paymentmodel = require("../models/Paymentmodel");

router.post("/register", async (req, res) => {
  try {
    let conditions = [];

    if (req.body.email) {
      conditions.push({ email: req.body.email });
    }

    if (req.body.username) {
      conditions.push({ username: req.body.username });
    }

    if (req.body.mobile) {
      conditions.push({ mobile: req.body.mobile });
    }

    if (conditions.length === 0) {
      return res.status(400).send({
        message: "No valid search parameters provided",
        success: false,
      });
    }

    const userExists = await User.findOne({ $or: conditions });

    if (userExists) {
      return res
        .status(400)
        .send({ message: "User already exists", success: false });
    }
    const activationToken = crypto.randomBytes(32).toString("hex");
    const password = req.body.password;
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);
    req.body.password = hashedPassword;

    const newUser = new User(req.body);
    newUser.activationToken = activationToken;
    await newUser.save();
    const activationLink = `http://localhost:3000/activate/${activationToken}`;

    console.log(activationLink);

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
          <p>Thank you for registering on Your App!</p>
          <p>Please click the following link to activate your account:</p>
          <a href="${activationLink}">Activate Account</a>
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
    res.status(201).send({
      message:
        "User registered successfully. Please check your email for activation instructions.",
      success: true,
    });
  } catch (error) {
    console.log(error);
    res
      .status(500)
      .send({ message: "Error creating user", success: false, error });
  }
});
router.get("/activate/:token", async (req, res) => {
  const { token } = req.params;
  console.log(token);
  // Find the user by the activation token
  const user = await User.findOne({ activationToken: token });
  console.log(user);

  if (!user) {
    return res.status(400).send("Invalid activation token");
  }

  // Activate the user
  user.isActivated = true;
  user.activationToken = undefined; // Remove the token to prevent reuse
  await user.save();

  // Redirect or send a success message
  res
    .status(200)
    .send({ message: "User activated successfully", success: true }); // Redirect to the login page or send a success message
});

router.post("/register-old", async (req, res) => {
  console.log(req.body);
  try {
    let conditions = [];

    if (req.body.email) {
      conditions.push({ email: req.body.email });
    }

    if (req.body.username) {
      conditions.push({ username: req.body.username });
    }

    if (req.body.mobile) {
      conditions.push({ mobile: req.body.mobile });
    }

    if (conditions.length === 0) {
      return res.status(400).send({
        message: "No valid search parameters provided",
        success: false,
      });
    }

    const userExists = await User.findOne({ $or: conditions });

    //   const userExists = await User.findOne({ email: req.body.email });
    if (userExists) {
      return res
        .status(200)
        .send({ message: "User already exists", success: false });
    }
    const password = req.body.password;
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);
    req.body.password = hashedPassword;
    const newuser = new User(req.body);
    await newuser.save();

    res
      .status(200)
      .send({ message: "User created successfully", success: true });
  } catch (error) {
    console.log(error);
    res
      .status(500)
      .send({ message: "Error creating user", success: false, error });
  }
});

router.post(
  "/send-login-mobile",
  async function sendSignInLinkToPhoneNumber(req, res) {
    try {
      // Get the authentication service

      const phoneNumber = req.body.phoneNumber;
      console.log(phoneNumber);

      // Send a verification code to the user's phone
      auth
        .sendSignInLinkToPhoneNumber(phoneNumber)
        .then(function () {
          res.send(result);
          // The verification code has been sent to the user's phone
        })
        .catch(function (error) {
          // An error occurred while sending the verification code
          console.log(error);
        });
    } catch (error) {
      console.log(error);
    }
  }
);
router.post(
  "/get-login-mobile",
  async function signInWithPhoneNumber(req, res) {
    try {
      // Get the authentication service
      const { identifier } = req.body;
      console.log(req.body);

      // Find the user either by username, email, or mobile
      const user = await User.findOne({
        $or: [
          // { username: identifier },
          // { email: identifier },
          { mobile: identifier },
        ],
      });

      console.log(user);

      if (!user) {
        return res
          .status(200)
          .send({ message: "User does not exist", success: false });
      }

      const token = jwt.sign(
        {
          id: user._id,
          isUser: user.isUser,
          isDoctor: user.isDoctor,
          isAdmin: user.isAdmin,
          isNurse: user.isNurse,
          isGroomer: user.isGroomer,
        },
        process.env.JWT_SECRET,
        {
          expiresIn: "1d",
        }
      );
      if (token) {
        res.status(200).send({
          message: "Token generated Successfully",
          success: true,
          data: token,
        });
      }
      // Send a verification code to the user's phone
      // Sign the user in using the verification code they received on their phone
      // auth
      //   .signInWithPhoneNumber(phoneNumber, verificationCode)
      //   .then(function (result) {
      //     // The user has been signed in

      //     res.send(result, token);
      //   })
      //   .catch(function (error) {
      //     console.log(error);
      //     // An error occurred while signing the user in
      //   });
    } catch (error) {
      console.log(error);
      res
        .status(500)
        .send({ message: "Error Generating Token", success: false, error });
    }
  }
);
router.post("/login-email", async (req, res) => {
  try {
    const { identifier, password } = req.body;

    // Find the user either by username, email, or mobile
    const user = await User.findOne({
      $or: [
        { username: identifier },
        { email: identifier },
        // { mobile: identifier }
      ],
    });

    if (!user) {
      return res
        .status(200)
        .send({ message: "User does not exist", success: false });
    }

    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      return res
        .status(200)
        .send({ message: "Password is incorrect", success: false });
    }

    const token = jwt.sign(
      {
        id: user._id,
        isUser: user.isUser,
        isDoctor: user.isDoctor,
        isAdmin: user.isAdmin,
        isNurse: user.isNurse,
        isGroomer: user.isGroomer,
      },
      process.env.JWT_SECRET,
      {
        expiresIn: "1d",
      }
    );

    res
      .status(200)
      .send({ message: "Login successful", success: true, data: token });
  } catch (error) {
    console.log(error);
    res
      .status(500)
      .send({ message: "Error logging in", success: false, error });
  }
});
router.get("/api/user/count-records", async (req, res) => {
  try {
    const collection = db.stats("doctors"); // Replace with your collection name

    // Count the documents in the collection
    const count = await collection.countDocuments();

    res.json({ count });
  } catch (error) {
    console.error("Error counting documents:", error);
    res.status(500).json({ error: "Server error" });
  }
});

router.get("/user-details/:userId", authMiddleware, async (req, res) => {
  try {
    const { userId } = req.params;
    console.log(userId);
    const user = await User.findOne({ _id: userId });

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    res.json({ data: user });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal server error" });
  }
});

router.post("/get-user-info-by-id", authMiddleware, async (req, res) => {
  try {
    const user = await User.findOne({ _id: req.body.userId });
    user.password = undefined;
    if (!user) {
      return res
        .status(200)
        .send({ message: "User does not exist", success: false });
    } else {
      res.status(200).send({
        success: true,
        data: user,
      });
    }
  } catch (error) {
    res
      .status(500)
      .send({ message: "Error getting user info", success: false, error });
  }
});

router.post("/apply-doctor-account", authMiddleware, async (req, res) => {
  try {
    const newdoctor = new Doctor({ ...req.body, status: "pending" });
    console.log(newdoctor);
    await newdoctor.save();
    const adminUser = await User.findOne({ isAdmin: true });

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
router.get("/profile/:userId", authMiddleware, async (req, res) => {
  try {
    const { userId } = req.params;

    const receptionist = await User.findById(userId);

    if (!receptionist) {
      return res
        .status(404)
        .json({ success: false, message: "Receptionist not found" });
    }

    res.status(200).json({ success: true, data: receptionist });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: "An error occurred while fetching the receptionist profile",
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
router.get("/appointmentcount", async (req, res) => {
  try {
    const count = await UserappModel.countDocuments();
    res.json({ count });
  } catch (error) {
    console.error("Error counting appointments:", error);
    res.status(500).json({ error: "Server error" });
  }
});
router.get("/usercount", async (req, res) => {
  try {
    const count = await User.countDocuments();
    res.json({ count });
  } catch (error) {
    console.error("Error counting Users:", error);
    res.status(500).json({ error: "Server Error" });
  }
});
router.get("/petcount", async (req, res) => {
  try {
    const count = await Pet.countDocuments();
    res.json({ count });
  } catch (error) {
    console.error("Error Counting Pets:", error);
    res.status(500).json({ error: "Server Error" });
  }
});
router.post(
  "/mark-all-notifications-as-seen",
  authMiddleware,
  async (req, res) => {
    try {
      const user = await User.findOne({ _id: req.body.userId });
      const unseenNotifications = user.unseenNotifications;
      const seenNotifications = user.seenNotifications;
      seenNotifications.push(...unseenNotifications);
      user.unseenNotifications = [];
      user.seenNotifications = seenNotifications;
      const updatedUser = await user.save();
      updatedUser.password = undefined;
      res.status(200).send({
        success: true,
        message: "All notifications marked as seen",
        data: updatedUser,
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

router.post("/delete-all-notifications", authMiddleware, async (req, res) => {
  try {
    const user = await User.findOne({ _id: req.body.userId });
    user.seenNotifications = [];
    user.unseenNotifications = [];
    const updatedUser = await user.save();
    updatedUser.password = undefined;
    res.status(200).send({
      success: true,
      message: "All notifications cleared",
      data: updatedUser,
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

router.post("/book-appointment", authMiddleware, async (req, res) => {
  try {
    req.body.status = "approved";
    req.body.date = moment(req.body.date, "DD-MM-YYYY").toISOString();
    req.body.time = moment(req.body.time, "h:mm A").toISOString();
    const newAppointment = new Appointment(req.body);
    await newAppointment.save();
    //pushing notification to doctor based on his userid
    const user = await User.findOne({ _id: req.body.doctorInfo.userId });
    user.unseenNotifications.push({
      type: "new-appointment-request",
      message: `A new appointment request has been made by ${req.body.userInfo.name}`,
      onClickPath: "/user/appointmentlist",
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
    const appointments = await Appointment.find({
      doctorId,
      date,
      time: { $gte: fromTime, $lte: toTime },
    });
    // console.log(appointments);
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

router.post(
  "/get-appointments-by-doctor-id",
  authMiddleware,
  async (req, res) => {
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
  }
);
router.get("/get-all-appointments", authMiddleware, async (req, res) => {
  try {
    const appointmentList = await UserappModel.find({});
    // console.log(appointmentList);
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
      console.log(matchingObj2);
      // Combine the objects into a new object and push it to the result array
      combinedList.push({
        appointment: obj1,
        user: matchingObj2, // Use {} as a default in case there is no match
        doctor: matchingObj3, // Use {} as a default in case there is no match
      });
    });

    // const combinedData = appointmentList.map((item1) => {
    //   const user = users.find((item2) => {
    //     const objectId = mongoose.Types.ObjectId(item1.userId);
    //     console.log(objectId);

    //     item2._id.equals(item1.userId);
    //     console.log(item2._id.equals(item1.userId));
    //     return item2;
    //   });

    //   const doctor = doctors.find((item3) => {
    //     const objectId = mongoose.Types.ObjectId(item1.doctorId);
    //     console.log(objectId);

    //     item3._id.equals(item1.doctorId);
    //     console.log(item3._id.equals(item1.doctorId));
    //     return item3;
    //   });

    //   return {
    //     // Combine data from both tables here as needed
    //     appointment: item1,
    //     user: user,
    //     doctor: doctor,
    //   };
    // });

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
});
router.get("/get-all-open-appointments", async (req, res) => {
  try {
    const appointmentList = await OpenAppointment.find({})
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

router.get("/get-pets-by-userid", authMiddleware, async (req, res) => {
  try {
    const user = await User.findOne({ userId: req.body.userId });
    const pets = await Pet.findOne({ userId: user._id });
    // const appointments = await Appointment.find({ doctorId: doctor._id });
    res.status(200).send({
      message: "Pets fetched successfully",
      success: true,
      data: pets,
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({
      message: "Error fetching Pets",
      success: false,
      error,
    });
  }
});

router.get("/get-all-pet", authMiddleware, async (req, res) => {
  try {
    const pets = await Pet.find({});
    res.status(200).send({
      message: "Pet List fetched successfully",
      success: true,
      data: pets,
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({
      message: "Failed to fetch PetList details.",
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
router.get(
  "/api/user/:userId/pet/:petId/appointments",
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
router.get("/view-user/:id", async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }
    res.json({ success: true, data: user });
  } catch (error) {
    console.error("Error fetching user:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

// Edit user by ID
router.put("/edit-user/:id", async (req, res) => {
  try {
    const user = await User.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
    });

    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    res.json({ success: true, data: user });
  } catch (error) {
    console.error("Error editing user:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

// Delete user by ID
router.delete("/delete-user/:id", async (req, res) => {
  try {
    const user = await User.findByIdAndDelete(req.params.id);
    // console.log(user);
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }
    res.json({ success: true, message: "User deleted successfully" });
  } catch (error) {
    console.error("Error deleting user:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});
router.post(
  "/cancel-appointment/:appointmentId",
  authMiddleware,
  async (req, res) => {
    try {
      const { appointmentId } = req.params;

      // Find the appointment by appointmentId
      const appointment = await UserappModel.findById(appointmentId);
      // console.log(appointment);
      if (!appointment) {
        return res
          .status(404)
          .json({ success: false, message: "Appointment not found" });
      }

      // Check if the appointment is already cancelled
      if (appointment.status === "cancelled") {
        return res.status(400).json({
          success: false,
          message: "Appointment is already cancelled",
        });
      }

      // Update the appointment status to "cancelled"
      appointment.status = "cancelled";
      await appointment.save();

      return res.json({
        success: true,
        message: "Appointment has been cancelled successfully",
      });
    } catch (error) {
      console.error(error);
      return res
        .status(500)
        .json({ success: false, message: "Internal server error" });
    }
  }
);

router.get("/get-pets-by-user-id", authMiddleware, async (req, res) => {
  try {
    const pets = await Pet.find({ userId: req.body.userId });
    res.status(200).send({
      message: "Pets fetched successfully",
      success: true,
      data: pets,
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({
      message: "Error fetching pets",
      success: false,
      error,
    });
  }
});
router.post("/user-book-appointment", authMiddleware, async (req, res) => {
  try {
    const newAppointment = new UserappModel({
      module: req.body.module,
      userId: req.body.userId,
      doctorId: req.body.doctorId,
      service: req.body.service,
      breed: req.body.breed,
      age: req.body.age,
      date: req.body.date,
      time: req.body.time,
      pet: req.body.pet,
      petName: req.body.petName,
      size: req.body.size,
      lng: req.body.lng,
      lat: req.body.lat,

      // Add other fields if needed
    });
    const followUp = req.body.followUp;

    const savedAppointment = await newAppointment.save();

    if (followUp) {
      const user = await User.findOne({ _id: req?.body?.userId });
      const doctor = await Doctor.findOne({ _id: req?.body?.doctorId });

      const transporter = nodemailer.createTransport({
        host: "mailslurp.mx",
        port: 2587,
        auth: {
          user: process.env.USER,
          pass: process.env.PASS,
        },
      });
      console.log(user?.email);
      const mailOptions = {
        from: process.env.EMAIL,
        to: user?.email,
        subject: "Follow-Up Appointment",
        html: `
        <html>
          <body>
            <p>Hello ${user?.name},</p>
            <p>Thank you for scheduling your follow up Appointment for your ${
              req?.body?.pet
            } ${req?.body?.petName} </p>
            <p>The given below are the details for your appointment</p>
            ${
              doctor
                ? `<p>Doctor Name ${doctor?.firstName} ${doctor?.lastName}</p>`
                : ``
            }
            <p>Appointment Date: ${req?.body?.date}</p>
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

    const doctor = await Doctor.findOne({ _id: req.body.doctorId });

    res.json({
      success: true,
      message: "Appointment booked successfully",
      data: { savedAppointment, doctor },
    });
  } catch (error) {
    console.error(error);
    console.log(error);
    res
      .status(500)
      .json({ success: false, message: "Error booking appointment" });
  }
});
router.get("/subservices", authMiddleware, async (req, res) => {
  try {
    const subservices = await packModel.find(
      { serviceType: "Mobile Veterinary" },
      "subService price"
    );
    //  console.log(subservices);
    res.json({ success: true, data: subservices });
  } catch (error) {
    console.error(error);
    res
      .status(500)
      .json({ success: false, error: "Failed to fetch sub-services" });
  }
});
router.get("/subservices1", authMiddleware, async (req, res) => {
  try {
    const subservices = await packModel.find(
      { serviceType: "Mobile Grooming" },
      "subService price"
    );
    console.log(subservices);
    res.json({ success: true, data: subservices });
  } catch (error) {
    console.error(error);
    res
      .status(500)
      .json({ success: false, error: "Failed to fetch sub-services" });
  }
});
router.get("/appointments/grooming", authMiddleware, async (req, res) => {
  try {
    // const moduleType = req.params.module;

    // Fetch appointments for the specified module
    const appointments = await UserappModel.find({ module: "grooming" });

    // If appointments are found, you can fetch user details only
    const populatedAppointments = await Promise.all(
      appointments.map(async (appointment) => {
        const userId = appointment.userId;

        // Assuming you have a User model for user details
        const user = await User.findOne({ _id: userId });
        //   console.log("user:", user);

        return {
          ...appointment.toObject(),
          user,
        };
      })
    );

    console.log("populated Appointments:", populatedAppointments);
    res.json({ success: true, data: populatedAppointments });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal Server Error" });
  }
});
router.get("/appointments/veterinary", authMiddleware, async (req, res) => {
  try {
    // const moduleType = req.params.module;

    // Fetch appointments for the specified module
    const appointments = await UserappModel.find({ module: "veterinary" });
    console.log("appointments", appointments);

    // If appointments are found, you can fetch user details only
    const populatedAppointments = await Promise.all(
      appointments.map(async (appointment) => {
        const userId = appointment.userId;
        const doctorId = appointment.doctorId;
        // Assuming you have a User model for user details
        const user = await User.findOne({ _id: userId });
        const doctor = await Doctor.findOne({ _id: doctorId });
        // console.log("user:", user);

        return {
          ...appointment.toObject(),
          user,
          doctor,
        };
      })
    );

    console.log("populated Appointments:", populatedAppointments);
    res.json({ success: true, data: populatedAppointments });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal Server Error" });
  }
});
router.get("/appointments/mobvet", authMiddleware, async (req, res) => {
  try {
    // const moduleType = req.params.module;

    // Fetch appointments for the specified module
    const appointments = await UserappModel.find({
      module: "mobile_veterinary",
    });

    // If appointments are found, you can fetch user details only
    const populatedAppointments = await Promise.all(
      appointments.map(async (appointment) => {
        const userId = appointment.userId;
        //  const doctorId = appointment.doctorId;
        // Assuming you have a User model for user details
        const user = await User.findOne({ _id: userId });
        //   const doctor = await Doctor.findOne({ _id: doctorId });
        //  console.log("user:", user);

        return {
          ...appointment.toObject(),
          user,
          //  doctor
        };
      })
    );

    console.log("populated Appointments:", populatedAppointments);
    res.json({ success: true, data: populatedAppointments });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal Server Error" });
  }
});

router.get("/appointments/mobgroom", authMiddleware, async (req, res) => {
  try {
    // const moduleType = req.params.module;

    // Fetch appointments for the specified module
    const appointments = await UserappModel.find({
      module: "mobile_grooming",
    });

    // If appointments are found, you can fetch user details only
    const populatedAppointments = await Promise.all(
      appointments.map(async (appointment) => {
        const userId = appointment.userId;
        //  const doctorId = appointment.doctorId;
        // Assuming you have a User model for user details
        const user = await User.findOne({ _id: userId });
        //   const doctor = await Doctor.findOne({ _id: doctorId });
        //  console.log("user:", user);

        return {
          ...appointment.toObject(),
          user,
          //  doctor
        };
      })
    );

    console.log("populated Appointments:", populatedAppointments);
    res.json({ success: true, data: populatedAppointments });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal Server Error" });
  }
});

router.post("/change-password", authMiddleware, async (req, res) => {
  try {
    const { id, currentpass, newpass, username } = req.body;

    // Find the user either by email
    const user = await User.findById(id);

    if (!user) {
      return res
        .status(404)
        .send({ message: "User does not exist", success: false });
    }

    const isMatch = await bcrypt.compare(currentpass, user.password);

    if (!isMatch) {
      return res
        .status(404)
        .send({ message: "Password is incorrect", success: false });
    }

    const password = newpass;
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    user.username = username;

    user.password = hashedPassword;

    await user.save();

    res
      .status(200)
      .send({ message: "Password Change Successfully", success: true });
  } catch (error) {
    console.log(error);
    res
      .status(500)
      .send({ message: "Error in Changing Password", success: false, error });
  }
});

router.post("/update-profile", authMiddleware, async (req, res) => {
  try {
    const { data, doctor } = req.body;

    const { userId, username, name, email, mobile } = data;
    const { specialization, shift, website, experience, feePerCunsultation } =
      doctor;

    // Find the user either by email
    const user = await User.findById(userId);

    const doctors = await Doctor.findOne({ userId: userId });

    if (!user) {
      return res
        .status(404)
        .send({ message: "User does not exist", success: false });
    }

    if (!doctors) {
      return res
        .status(404)
        .send({ message: "Doctor does not exist", success: false });
    }

    if (username) user.username = username;
    if (name) user.name = name;
    if (email) user.email = email;
    if (mobile) user.mobile = mobile;

    await user.save();

    if (specialization) doctors.specialization = specialization;
    if (shift) doctors.shift = shift;
    if (feePerCunsultation) doctors.feePerCunsultation = feePerCunsultation;
    if (experience) doctors.experience = experience;
    if (website) doctors.website = website;

    await doctors.save();

    res
      .status(200)
      .send({ message: "Profile Updated Successfully", success: true });
  } catch (error) {
    console.log(error);
    res
      .status(500)
      .send({ message: "Error in Updating Profile", success: false, error });
  }
});

router.post("/pay", authMiddleware, async (req, res) => {
  try {
    const { userId, appointmentId, amount, status } = req.body;

    // Find the user either by email
    const user = await User.findById(userId);
    console.log(user);

    const appointment = await UserappModel.findById(appointmentId);
    console.log(appointment);

    if (!user) {
      return res
        .status(404)
        .send({ message: "User does not exist", success: false });
    }

    if (!appointment) {
      return res
        .status(404)
        .send({ message: "Appointment does not exist", success: false });
    }

    const payment = new Paymentmodel({ userId, appointmentId, amount, status });

    await payment.save();

    res
      .status(200)
      .send({ message: "Payment Created Successfully", success: true });
  } catch (error) {
    console.log(error);
    res
      .status(500)
      .send({ message: "Error in Creating Payment", success: false, error });
  }
});

router.get("/get-all-pay-by-userid", authMiddleware, async (req, res) => {
  try {
    const payments = await Paymentmodel.find({ userId: req.body.userId });
    const userID = payments.map((item) => item.userId);
    const appointmentId = payments.map((item) => item.appointmentId);
    const users = await User.find(
      { _id: { $in: userID } },
      { name: 1, _id: 1, email: 1, mobile: 1 }
    );
    const appointments = await UserappModel.find(
      { _id: { $in: appointmentId } },
      { customId: 1 }
    );

    // Create an empty result array
    const combinedList = [];

    // Loop through list1 and add objects from list2 and list3 based on commonField
    payments.forEach((obj1) => {
      // Find matching objects in list2 based on commonField
      const matchingObj2 = users.find(
        (obj2) => obj2._id.toString() === obj1.userId
      );

      // Find matching objects in list3 based on commonField
      const matchingObj3 = appointments.find(
        (obj3) => obj3._id.toString() === obj1.appointmentId
      );
      console.log(matchingObj2);
      // Combine the objects into a new object and push it to the result array
      combinedList.push({
        payment: obj1,
        user: matchingObj2, // Use {} as a default in case there is no match
        appointment: matchingObj3, // Use {} as a default in case there is no match
      });
    });

    console.log(combinedList);

    res.status(200).send({
      message: "Payment Fetched Successfully",
      success: true,
      data: combinedList,
    });
  } catch (error) {
    console.log(error);
    res
      .status(500)
      .send({ message: "Error in Fetching Payment", success: false, error });
  }
});

module.exports = router;
