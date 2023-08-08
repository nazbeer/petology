const mongoose = require("mongoose");

const scheduleSchema = new mongoose.Schema(
  {
   doctorId:{
    type :String ,
    required: true,
   },
   userId:{
    type:String,
    required:true,
   },
   duration:{
    type: String,
    required:true, 
   },
   starttime:{
    type:Date,
    required:true,
   },
   endtime:{
    type:Date,
    required:true,
   },
   status:{
    type:String,
    required:true,
   },
  

    
  },
  {
    timestamps: true,
  }
);

const scheduleModel = mongoose.model("schedule", scheduleSchema);

module.exports = scheduleModel;
