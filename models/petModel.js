const mongoose = require("mongoose");

const petSchema = new mongoose.Schema(
  {
   pet:{
    type :String ,
    required: true,
   },
   dimension:{
    type: String,
    required:true, 
   },
   size:{
    type:String,
    enum: ['S', 'M', 'L'],
    required:true,
   },
   breed:{
    type:String,
    required:true,
   },
   image:{
    data: Buffer,
    type: String,
    required: true,
    // default:'image/png',
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

const petModel = mongoose.model("petlists", petSchema);

module.exports = petModel;
