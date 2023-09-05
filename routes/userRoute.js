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
const nodemailer = require('nodemailer');
// router.post("/register", async (req, res) => {
//   try {
//     const userExists = await User.findOne({
//       $or: [
//         { email: req.body.email },
//         { username: req.body.username },
//         { mobile: req.body.mobile }
//       ]
//     });

//     if (userExists) {
//       return res
//         .status(200)
//         .send({ message: "User already exists with the provided username, email, or mobile number", success: false });
//     }
//     const password = req.body.password;
//     const salt = await bcrypt.genSalt(10);
//     const hashedPassword = await bcrypt.hash(password, salt);
//     req.body.password = hashedPassword;
//     const newuser = new User(req.body);
//     console.log(newuser);
//     await newuser.save();
    
//     res
//       .status(200)
//       .send({ message: "User created successfully", success: true });
//   } catch (error) {
//     console.log(error);
//     res
//       .status(500)
//       .send({ message: "Error creating user", success: false, error });
//   }

//   // const transporter = nodemailer.createTransport({
//     //   service: 'gmail', // e.g., 'Gmail'
//     //   auth: {
//     //     user: 'nazbeer.ahammed@gmail.com',
//     //     pass: 'Meherin@2019!',
//     //   },
//     // });

//     // const mailOptions = {
//     //   from: 'nazbeer.ahammed@gmail.com',
//     //   to: req.body.email,
//     //   subject: 'Welcome to Your App',
//     //   text: `Hello ${req.body.name},\n\nThank you for registering on Your App!`,
//     // };

//     // transporter.sendMail(mailOptions, (error, info) => {
//     //   if (error) {
//     //     console.log('Error sending email:', error);
//     //   } else {
//     //     console.log('Email sent:', info.response);
//     //   }
//     // });
// });
router.post("/register", async (req, res) => {
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
      return res.status(400).send({ message: "No valid search parameters provided", success: false });
    }

    const userExists = await User.findOne({ $or: conditions });

    if (userExists) {
      return res
        .status(400)
        .send({ message: "User already exists", success: false });
    }

    const password = req.body.password;
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);
    req.body.password = hashedPassword;

    const newUser = new User(req.body);
    await newUser.save();

    res
      .status(201) // Status code 201 represents "Created"
      .send({ message: "User created successfully", success: true });
  } catch (error) {
    console.log(error);
    res
      .status(500)
      .send({ message: "Error creating user", success: false, error });
  }
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
    return res.status(400).send({ message: "No valid search parameters provided", success: false });
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
    // const transporter = nodemailer.createTransport({
    //   service: 'Gmail', // e.g., 'Gmail'
    //   auth: {
    //     user: 'your_email@example.com',
    //     pass: 'your_email_password',
    //   },
    // });

    // const mailOptions = {
    //   from: 'nazbeer.ahammed@gmail.com',
    //   to: req.body.email,
    //   subject: 'Welcome to Your App',
    //   text: `Hello ${req.body.name},\n\nThank you for registering on Your App!`,
    // };

    // transporter.sendMail(mailOptions, (error, info) => {
    //   if (error) {
    //     console.log('Error sending email:', error);
    //   } else {
    //     console.log('Email sent:', info.response);
    //   }
    // });
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

// router.post("/login", async (req, res) => {
//   try {
//     const user = await User.findOne({ email: req.body.email });
//     if (!user) {
//       return res
//         .status(200)
//         .send({ message: "User does not exist", success: false });
//     }
//     const isMatch = await bcrypt.compare(req.body.password, user.password);
//     if (!isMatch) {
//       return res
//         .status(200)
//         .send({ message: "Password is incorrect", success: false });
//     } else {
//       const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
//         expiresIn: "1d",
//       });
//       res
//         .status(200)
//         .send({ message: "Login successful", success: true, data: token });
//     }
//   } catch (error) {
//     console.log(error);
//     res
//       .status(500)
//       .send({ message: "Error logging in", success: false, error });
//   }
// });

router.post("/login", async (req, res) => {
  try {
    const { identifier, password } = req.body;

    // Find the user either by username, email, or mobile
    const user = await User.findOne({
      $or: [
        { username: identifier },
        { email: identifier },
        { mobile: identifier }
      ]
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
        isGroomer: user.isGroomer
      },
      process.env.JWT_SECRET,
      {
        expiresIn: "1d",
      }
    );

    res.status(200).send({ message: "Login successful", success: true, data: token });

  } catch (error) {
    console.log(error);
    res.status(500).send({ message: "Error logging in", success: false, error });
  }
});
router.get('/api/user/count-records', async (req, res) => {
  try {
    const collection = db.stats('doctors'); // Replace with your collection name

    // Count the documents in the collection
    const count = await collection.countDocuments();

    res.json({ count });
  } catch (error) {
    console.error('Error counting documents:', error);
    res.status(500).json({ error: 'Server error' });
  }
});
// router.get('/get-user-id', authMiddleware, (req, res) => {
//   // Assuming user ID is stored in req.user.userId after token verification
//   const userId = req.user._id;
//   res.json({ success: true, userId });
// });


router.get('/user-details/:userId', authMiddleware, async (req, res) => {
  try {
    const { userId } = req.params;
    console.log(userId);
    const user = await User.findOne({ _id: userId });

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    res.json({ data: user });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal server error' });
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
router.get('/doctorcount', async (req, res) => {
  try {
    const count = await Doctor.countDocuments();
    res.json({ count });
  } catch (error) {
    console.error('Error counting doctors:', error);
    res.status(500).json({ error: 'Server error' });
  }
});
router.get('/appointmentcount', async (req, res) => {
  try {
    const count = await Appointment.countDocuments();
    res.json({ count });
  } catch (error) {
    console.error('Error counting appointments:', error);
    res.status(500).json({ error: 'Server error' });
  }
});
router.get('/usercount', async (req, res) => {
  try{
    const count = await User.countDocuments();
    res.json({ count });

  } catch (error){
    console.error("Error counting Users:" , error);
    res.status(500).json({ error: 'Server Error'});
  }
});
router.get('/petcount', async (req, res) => {
  try{
    const count = await Pet.countDocuments();
    res.json({ count });

  } catch(error){
    console.error("Error Counting Pets:", error );  
    res.status(500).json({ error : 'Server Error'}) ;
  }
})
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

    res.status(200).json({ success: true, message: 'Doctor assigned successfully', data: updatedAppointment });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: 'An error occurred while assigning the doctor' });
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

// router.post("/check-booking-avilability", authMiddleware, async (req, res) => {
//   try {
//     const date = moment(req.body.date, "DD-MM-YYYY").toISOString();
//     const selectedTime = moment(req.body.time, "HH:mm");
//     let shiftStart, shiftEnd;
//     console.log(req.body.selectedTime);
//     // Determine the shift timings based on the doctor's shift type
//     if (req.body.shift === "day") {
//       shiftStart = moment("08:00", "HH:mm");
//       shiftEnd = moment("15:00", "HH:mm");
//     } else if (req.body.shift === "night") {
//       shiftStart = moment("15:00", "HH:mm");
//       shiftEnd = moment("20:00", "HH:mm");
//     } else {
//       return res.status(400).send({
//         message: "Invalid shift type",
//         success: false,
//       });
//     }

//     if (!selectedTime.isBetween(shiftStart, shiftEnd)) {
//       return res.status(200).send({
//         message: "Appointments not available during this shift",
//         success: false,
//       });
//     }

//     const doctorId = req.body.doctorId;
//     const appointments = await Appointment.find({
//       doctorId,
//       date,
//       time: { $gte: shiftStart.toISOString(), $lte: shiftEnd.toISOString() },
//     });

//     if (appointments.length > 0) {
//       return res.status(200).send({
//         message: "Appointments not available",
//         success: false,
//       });
//     } else {
//       return res.status(200).send({
//         message: "Appointments available",
//         success: true,
//       });
//     }
//   } catch (error) {
//     console.log(error);
//     res.status(500).send({
//       message: "Error checking appointment availability",
//       success: false,
//       error,
//     });
//   }
// });


router.get("/get-appointments-by-user-id", authMiddleware, async (req, res) => {
  try {
    const appointments = await Appointment.find({ userId: req.body.userId });
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
router.get("/get-all-appointments", authMiddleware, async (req, res)=>{
  try{
    const appointmentList = await Appointment.find({});
   // console.log(appointmentList);
    res.status(200).send({
      message: "Appointment List fetched successfully",
      success: true,
      data: appointmentList,
    });

  }catch(error){
    console.log(error);
    res.status(500).send({
      message: "Error fetching All Appointments",
      success: false,
      error,
    })
  }
});

router.get('/get-all-open-appointments', async (req, res) => {
  try {
    const appointmentList = await OpenAppointment.find({})
      .populate('doctor', 'name specialization') // Assuming 'doctor' field is a reference to User model
      .exec();
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
  }
);

router.get("/get-all-pet", authMiddleware, async(req, res) => {
  try{
    const pets = await Pet.find({});
    res.status(200).send({
      message: "Pet List fetched successfully",
      success: true,
      data: pets,
    })
  }catch(error){
    console.log(error);
    res.status(500).send({
      message: "Failed to fetch PetList details.",
      success: false,
      error,
    })
  }
})
router.get("/get-all-users", authMiddleware, async(req, res)=>{
  try{
    const users = await User.find();
    //const users = await User.find({status:req.body.status});
    res.status(200).send({
      message: "Users list fetched succcessfully",
      success :true,
      data: users,
    });

  }catch (error){
    console.log(error);
    res.status(500).send({
      message:"Failed to fetch user's details.",
      success:false,
      error,
    });
  }
});
router.get('/api/user/:userId/pet/:petId/appointments', authMiddleware, async (req, res) => {
  const { userId, petId } = req.params;

  try {
    const appointments = await Appointment.find({ userId, petId });
   // console.log(appointments);
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
router.post("/cancel-appointment/:appointmentId", authMiddleware, async (req, res) => {
  try {
    const { appointmentId } = req.params;

    // Find the appointment by appointmentId
    const appointment = await Appointment.findById(appointmentId);
   // console.log(appointment);
    if (!appointment) {
      return res.status(404).json({ success: false, message: "Appointment not found" });
    }

    // Check if the appointment is already cancelled
    if (appointment.status === "cancelled") {
      return res.status(400).json({ success: false, message: "Appointment is already cancelled" });
    }

    // Update the appointment status to "cancelled"
    appointment.status = "cancelled";
    await appointment.save();

    return res.json({ success: true, message: "Appointment has been cancelled successfully" });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ success: false, message: "Internal server error" });
  }
});


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
module.exports = router;
