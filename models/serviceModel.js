const mongoose = require("mongoose");

const serviceSchema = new mongoose.Schema({
    name: {
        type: String,
        //  default:"Veterinary"
        // unique: true,
       required:true
    },
    subservice: {
        type: String,
        //  default:"Consultation"
        required:true
       // unique: true,
    }
} );

const serviceModel = mongoose.model("timewaster", serviceSchema);

module.exports = serviceModel;