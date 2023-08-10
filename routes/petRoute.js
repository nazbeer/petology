const express = require("express");
const router = express.Router();
const Pet = require("../models/petModel");
const authMiddleware =require("../middlewares/authMiddleware");
const multer = require('multer');

router.get("/get-all-pets", authMiddleware, async (req, res) => {
    try{
        const pet = await Pet.find({});
        res.status(200).send({
            success:true,
            message:"All pets fetched successfully.",
            data: pet,
        });
    } catch(error){
        res.status(500).send({
            success:false,
            message:"Unable to fetch the Pet List details",
            error,
        });
    }
});

const upload = multer({ dest: 'uploads/' });

router.post('/create-new-pet', upload.single('image'), authMiddleware, async (req, res) => {
  try {
    const { pet, size, breed } = req.body;
    const image = req.file ? req.file.path : ''; // Store the image path

    const newPet = new Pet({ pet, size, image, breed });
    await newPet.save();

    res.json(newPet);
  } catch (error) {
    console.error('Error saving pet:', error);
    res.status(500).json({ error: 'Server error' });
  }
});
router.get("/get-pets-by-user-id", authMiddleware, async (req, res) => {
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
module.exports = router;