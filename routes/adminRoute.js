const express = require("express");
const router = express.Router();
const User = require("../models/userModel");
const Doctor = require("../models/doctorModel");
const Appointment = require("../models/appointmentModel");
const Pet = require("../models/petModel");
const serviceModel = require('../models/serviceModel');
const OpenAppointment = require("../models/openAppointmentModel");
const authMiddleware = require("../middlewares/authMiddleware");
const breaktimeModel = require("../models/breaktimeModel");
//const { default: Appointments } = require("../client/src/pages/Appointments");
//const { default: Appointments } = require("../client/src/pages/Appointments");

// router.get("/get-all-services", authMiddleware, async (req, res) => {
//   try{
//       const service = await serviceModel.find({});
//     //  console.log(service);
//       res.status(200).send({
//           success:true,
//           message:"All services fetched successfully.",
//           data: service,
//       });
//   } catch(error){
//       res.status(500).send({
//           success:false,
//           message:"Unable to fetch the service List details",
//           error,
//       });
//   }
// });


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

    // Update the doctor's appointments array
    await Doctor.findByIdAndUpdate(
      doctorId,
      { $addToSet: { appointments: appointmentId } },
      { new: true }
    );

    res.status(200).json({ success: true, message: 'Doctor assigned successfully', data: updatedAppointment });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: 'An error occurred while assigning the doctor' });
  }
});

router.get('/doctordetails/:doctorId', async (req, res) => {
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
      message: 'An error occurred while fetching doctor details.',
    });
  }
});

router.get('/get-all-open-appointments', async (req, res) => {
  try {
    const appointmentList = await OpenAppointment.find({})
      .populate('doctors', 'name specialization') // Assuming 'doctor' field is a reference to User model
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
router.get('/get-all-appointments', authMiddleware, async (req, res) => {
  try {
    const appointmentList = await Appointment.find({})
      .populate('doctors', 'name') // Assuming 'doctor' field is a reference to User model
      .populate('petlists', 'name') // Assuming 'pet' field is a reference to Pet model
      .exec();
    console.log(appointmentList);
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


router.post('/set-break-time', async (req, res) => {
 
  const breaktime ={doctorId:req.body.doctorId, duration:req.body.duration};
  const newBreaktime = new breaktimeModel(breaktime);
  await newBreaktime.save().then((resss)=>{
      console.log(resss);
      return   res.status(200).json({ success: true, message: 'Break Time added successfully'});
  }).catch((errr)=>{
      console.log(errr);
      return  res.status(500).json({ success: false, message: 'An error occurred while adding Break Time' });
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
          doctorName: (doctor.firstName + " " + doctor.lastName),
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
router.post('/change-appointment-status/:id', authMiddleware, async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    const updatedAppointment = await Appointment.findByIdAndUpdate(
      id,
      { status }, // Update the status field
      { new: true } // Return the updated appointment
    );

    if (!updatedAppointment) {
      return res.status(404).json({ success: false, message: 'Appointment not found' });
    }

    res.status(200).json({ success: true, message: 'Appointment status changed successfully', data: updatedAppointment });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: 'An error occurred while changing appointment status' });
  }
});


router.post('/change-open-appointment-status/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    const updatedAppointment = await OpenAppointment.findByIdAndUpdate(
      id,
      { status }, // Update the status field
      { new: true } // Return the updated appointment
    );

    if (!updatedAppointment) {
      return res.status(404).json({ success: false, message: 'Appointment not found' });
    }

    res.status(200).json({ success: true, message: 'Appointment status changed successfully', data: updatedAppointment });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: 'An error occurred while changing appointment status' });
  }
});



router.post("/apply-doctor-account", authMiddleware, async (req, res) => {
  try {
    const newdoctor = new Doctor({ ...req.body, status: "pending" });
    //console.log(newdoctor);
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
module.exports = router;
