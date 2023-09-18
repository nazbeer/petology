const mongoose = require("mongoose");

const prescriptionSchema = new mongoose.Schema(
  {
   userId:{
    type :String ,
    required: true,
   },
   petId:{
    type: String,
    required:false, 
   },
   appointmentId:{
    type:String,
    required:true,
   },
   doctorId:{
    type:String,
    required:true,
   },
   prescription:{
    type:String,
    required:true,
   },
   description:{
    type:String,
    required:true,
   },
   ndate:{
    type:Date,
    
   },
  //  ntime:{
  //   type:Date,

  //  },
    status:{
        type : String,
        required :false,
    
    }
    
  },
  {
    timestamps: true,
  }
);

const prescriptionModel = mongoose.model("prescription", prescriptionSchema);

module.exports = prescriptionModel;
