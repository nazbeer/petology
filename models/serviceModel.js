const mongoose = require("mongoose");

const serviceSchema = new mongoose.Schema(
  {
   name:{
    type :Object ,
    required: true,
   
   },
   subservice:{
    type: Object,
    required:true, 
   },
   
    status:{
        type : String,
        required :false,
      default:'pending',
    }
    
  },
  {
    timestamps: true,
  }
);

const serviceModel = mongoose.model("services", serviceSchema);

module.exports = serviceModel;
