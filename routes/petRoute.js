const express = require("express");
const router = express.Router();
const Pet = require("../models/petModel");
const authMiddleware =require("../middlewares/authMiddleware");
const multer = require('multer');
const path = require('path');

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

// const upload = multer({ dest: '../../uploads/' });

// router.post('/create-new-pet', upload.single('image'), authMiddleware, async (req, res) => {
//   try {
//     const { pet, size, breed, userId } = req.body;
//     const image = req.file ? req.file.path : ''; // Store the image path

//     const newPet = new Pet({ pet, size, image, breed, userId });
//     await newPet.save();

//     res.json(newPet);
//   } catch (error) {
//     console.error('Error saving pet:', error);
//     res.status(500).json({ error: 'Server error' });
//   }
// });

const upload = multer({ 
  storage: multer.diskStorage({
    destination: (req, file, cb) => {
      cb(null, path.join(__dirname, 'uploads'));
    },
    filename: (req, file, cb) => {
      const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
      cb(null, uniqueSuffix + path.extname(file.originalname));
    }
  })
});

router.post('/create-new-pet', upload.single('image'), authMiddleware, async (req, res) => {
  try {
    const { pet, size, breed,age, userId, custompetId} = req.body;
    const image = req.file ? req.file.filename : ''; // Store the image filename

    const newPet = new Pet({ pet, size, image, breed, age, userId, custompetId });
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


// Edit Pet
router.put("/edit-pet/:id", async (req, res) => {
  try {
    const petId = req.params.id;
    const updatedPet = req.body; // Update pet data

    const result = await Pet.findByIdAndUpdate(petId, updatedPet, { new: true });

    if (!result) {
      return res.status(404).json({ success: false, message: "Pet not found" });
    }

    res.status(200).json({ success: true, message: "Pet updated successfully", data: result });
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

    res.status(200).json({ success: true, message: "Pet deleted successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: "Internal server error" });
  }
});

module.exports = router;