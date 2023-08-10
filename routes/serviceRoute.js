const express = require("express");
const router = express.Router();
const Service = require("../models/serviceModel");
const authMiddleware =require("../middlewares/authMiddleware");
//const multer = require('multer');
router.get("/get-all-services", authMiddleware, async (req, res) => {
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

//const upload = multer({ dest: 'uploads/' });

router.post('/create-new-service', authMiddleware, async (req, res) => {
  try {
    const { name, subservice} = req.body;
   // const image = req.file ? req.file.path : ''; // Store the image path

    const newService = new Service({name, subservice });
    console.log(newService);
    await newService.save();

    res.json(newService);
  } catch (error) {
    console.error('Error saving Service:', error);
    res.status(500).json({ error: 'Server error' });
  }
});
module.exports = router;