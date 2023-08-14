const express = require("express");
const router = express.Router();
// const Service = require("../models/serviceModel");
const authMiddleware =require("../middlewares/authMiddleware");
const serviceModel = require("../models/serviceModel");
router.get("/get-all-services", async (req, res) => {
    try{
        const service = await Service.find({});
        res.status(200).send({
            success:true,
            message:"All services fetched successfully.",
            data: service,
        });
    } catch(error){
        res.status(500).send({
            success:false,
            message:"Unable to fetch the service List details",
            error,
        });
    }
});

router.post('/create-service', async (req, res) => {
    // console.log(req.body);
    // return;

//     const serviceData ={sname:req.body.sname, subserivce:req.body.subserivce};
  
//   
//       const newService = new serviceModel(serviceData);
    
//        await newService.save().then((res)=>{
//         console.log(res);
//       }).catch((err)=>{
// console.log(err);
//       });
//       return;
    try {
      const serviceData ={sname:req.body.sname, subserivce:req.body.subserivce};
  
      // Create a new appointment
      const newService = new serviceModel(serviceData);
    
      const response = await newService.save();
  
        //  console.log('appointment', newAppointment);
      // Update the user's appointment array
      // await User.findByIdAndUpdate(
      //     appointmentData.userId,
      //     { $addToSet: { appointments: savedAppointment._id } },
      //     { new: true }
      // );
  
      res.status(200).json({ success: true, message: 'Service added successfully', data: response });
      console.log(res);
      } catch (error) {
      console.error(error);
      res.status(500).json({ success: false, message: 'An error occurred while adding service' });
      }
  });
  


// router.post('/create-service', authMiddleware,async (req, res) => {
//     try {
//      const { sname, subservice } = req.body;
       
//       const service = new Service({ sname,  subservice });
//       await service.save();
//       res.json(service);
//     //   res.status(201).json({
//     //     success: true,
//     //     message: 'Service created successfully',
//     //   //  data: savedService,
//     //   });
//     } catch (error) {
//       res.status(500).json({
//         success: false,
//         error: 'Internal server error',
//       });
//     }
//   });


module.exports = router;