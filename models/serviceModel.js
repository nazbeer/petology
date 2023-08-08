const mongoose = require("mongoose");

const serviceSchema = new mongoose.Schema(
  {
   name:{
    type :String ,
    required: true,
   },
   subservice:{
    type: String,
    required:true, 
   },
  
    status:{
        type : String,
        required :false,
    
    }
    
  },
  {
    timestamps: true,
  }
);

const serviceModel = mongoose.model("services", serviceSchema);

module.exports = serviceModel;
