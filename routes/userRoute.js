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

router.post("/register", async (req, res) => {
  try {
    const userExists = await User.findOne({ email: req.body.email });
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

router.post("/login", async (req, res) => {
  try {
    const user = await User.findOne({ email: req.body.email });
    if (!user) {
      return res
        .status(200)
        .send({ message: "User does not exist", success: false });
    }
    const isMatch = await bcrypt.compare(req.body.password, user.password);
    if (!isMatch) {
      return res
        .status(200)
        .send({ message: "Password is incorrect", success: false });
    } else {
      const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
        expiresIn: "1d",
      });
      res
        .status(200)
        .send({ message: "Login successful", success: true, data: token });
    }
  } catch (error) {
    console.log(error);
    res
      .status(500)
      .send({ message: "Error logging in", success: false, error });
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
    req.body.status = "pending";
    req.body.date = moment(req.body.date, "DD-MM-YYYY").toISOString();
    req.body.time = moment(req.body.time, "HH:mm").toISOString();
    const newAppointment = new Appointment(req.body);
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
    const appointments = await Appointment.find({
      doctorId,
      date,
      time: { $gte: fromTime, $lte: toTime },
    });
    console.log(appointments);
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
    console.log(appointmentList);
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
})


router.get(
  "/get-pets-by-userid",
  authMiddleware,
  async (req, res) => {
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
    const users = await User.find({status:req.body.status});
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

module.exports = router;
