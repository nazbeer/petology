const express = require("express");
const router = express.Router();
// const Service = require("../models/serviceModel");
const authMiddleware =require("../middlewares/authMiddleware");
const serviceModel = require("../models/serviceModel");

router.get("/get-all-services", authMiddleware,  async (req, res) => {
    try{
        const service = await serviceModel.find({});
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
   // console.log(req.body.name, req.body.subservice);
   // return;
   // console.log(req.body);
   // return;
   
      const serviceData ={name:req.body.name, subservice:req.body.subservice};
        const newService = new serviceModel(serviceData);
        await newService.save().then((resss)=>{
            console.log(resss);
            return   res.status(200).json({ success: true, message: 'Service added successfully'});
        }).catch((errr)=>{
            console.log(errr);
            return  res.status(500).json({ success: false, message: 'An error occurred while adding service' });
        });
        return;
       
  });
  

module.exports = router;