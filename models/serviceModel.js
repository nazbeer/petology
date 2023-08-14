const mongoose = require("mongoose");

const serviceSchema = new mongoose.Schema({
    name: {
        type: String,
        //  default:"Veterinary"
        unique: true,
    },
    subservice: {
        type: String,
        //  default:"Consultation"
        unique: true,
    }
} );

const serviceModel = mongoose.model("packs", serviceSchema);

module.exports = serviceModel;