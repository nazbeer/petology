const mongoose = require("mongoose");

const breaktimeSchema = new mongoose.Schema(
  {
    doctorId:{
      type:String
    },
   duration:{
    type :String ,
   // required: true,
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

const breaktimeModel = mongoose.model("breaktime", breaktimeSchema);

module.exports = breaktimeModel;
