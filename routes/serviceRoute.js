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


module.exports = router;