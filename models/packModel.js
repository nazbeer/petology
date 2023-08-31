const mongoose = require("mongoose");

const packSchema = new mongoose.Schema(
    {
      pet:{
        type:String,
        required:true,
      },
      size:{
        type:String,
        required:true,
      },
        name: {
          type: String,
          unique: true,
          required: true,
        },
        subService: {
          type: String,
          required: true,
        },
        serviceType: {
            type: String,
            required: true,
          },
          price:{
            type:String,
            required:true
          },
        status:{
            type:String,
            default:"approved"
        }
      },
      {
        timestamps: true,
      }
    );

const packModel = mongoose.model("packs", packSchema);

module.exports = packModel;
